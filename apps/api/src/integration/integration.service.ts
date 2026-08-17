import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateConnectionDto,
  UpdateConnectionDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  SendWhatsAppMessageDto,
  ProcessWebhookDto,
} from './dto/integration.dto';

@Injectable()
export class IntegrationService {
  private readonly logger = new Logger(IntegrationService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── CONNECTIONS ────────────────────────────────────

  async createConnection(tenantId: string, dto: CreateConnectionDto) {
    return this.prisma.integrationConnection.create({
      data: { tenantId, ...dto, config: dto.config as any },
    });
  }

  async findConnections(tenantId: string) {
    return this.prisma.integrationConnection.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findConnectionById(tenantId: string, id: string) {
    const conn = await this.prisma.integrationConnection.findFirst({
      where: { id, tenantId },
    });
    if (!conn) throw new NotFoundException(`Conexión ${id} no encontrada`);
    return conn;
  }

  async updateConnection(tenantId: string, id: string, dto: UpdateConnectionDto) {
    await this.findConnectionById(tenantId, id);
    return this.prisma.integrationConnection.update({
      where: { id },
      data: { ...dto, config: dto.config as any },
    });
  }

  async deleteConnection(tenantId: string, id: string) {
    await this.findConnectionById(tenantId, id);
    return this.prisma.integrationConnection.delete({ where: { id } });
  }

  // ─── WEBHOOK INBOX ──────────────────────────────────

  async processInboundWebhook(tenantId: string, dto: ProcessWebhookDto) {
    const inbox = await this.prisma.integrationWebhookInbox.create({
      data: {
        tenantId,
        provider: dto.provider,
        payload: dto.payload as any,
        headers: dto.headers as any,
        status: 'RECEIVED',
      },
    });

    try {
      await this.handleInboundPayload(tenantId, dto.provider, dto.payload);
      await this.prisma.integrationWebhookInbox.update({
        where: { id: inbox.id },
        data: { status: 'PROCESSED', processedAt: new Date() },
      });
    } catch (error) {
      await this.prisma.integrationWebhookInbox.update({
        where: { id: inbox.id },
        data: { status: 'FAILED', errorMessage: error.message },
      });
      this.logger.error(`Webhook processing failed: ${error.message}`);
    }

    return inbox;
  }

  private async handleInboundPayload(tenantId: string, provider: string, payload: any) {
    if (provider === 'WHATSAPP_BUSINESS') {
      await this.handleWhatsAppInbound(tenantId, payload);
    }
  }

  private async handleWhatsAppInbound(tenantId: string, payload: any) {
    const entry = payload.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.length) return;

    for (const msg of value.messages) {
      const from = msg.from;
      const contact = value.contacts?.[0];

      let conversation = await this.prisma.conversation.findFirst({
        where: { externalId: from, tenantId },
      });

      if (!conversation) {
        const existingContact = await this.findOrCreateContactByPhone(tenantId, from, contact?.profile?.name);
        conversation = await this.prisma.conversation.create({
          data: {
            tenantId,
            contactId: existingContact.id,
            channelType: 'WHATSAPP',
            externalId: from,
            subject: `WhatsApp - ${contact?.profile?.name || from}`,
          },
        });
      }

      const messageContent = msg.text?.body || msg.type;
      await this.prisma.message.create({
        data: {
          tenantId,
          conversationId: conversation.id,
          senderType: 'CONTACT',
          direction: 'INBOUND',
          content: messageContent,
          contentType: msg.type === 'text' ? 'TEXT' : msg.type?.toUpperCase() || 'TEXT',
          externalId: msg.id,
          metadata: msg as any,
        },
      });

      await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date(), lastMessagePreview: messageContent.substring(0, 500) },
      });
    }
  }

  private async findOrCreateContactByPhone(tenantId: string, phone: string, name?: string) {
    const identifier = await this.prisma.contactChannelIdentity.findUnique({
      where: { tenantId_channelType_channelIdentifier: { tenantId, channelType: 'WHATSAPP', channelIdentifier: phone } },
    });

    if (identifier) {
      const contact = await this.prisma.contact.findFirst({ where: { id: identifier.contactId } });
      if (contact) return contact;
    }

    const nameParts = name?.split(' ') || ['Contacto'];
    const firstName = nameParts[0] || 'Contacto';
    const lastName = nameParts.slice(1).join(' ') || '';

    const contact = await this.prisma.contact.create({
      data: { tenantId, firstName, lastName, phone, leadSource: 'WHATSAPP' },
    });

    await this.prisma.contactChannelIdentity.create({
      data: { tenantId, contactId: contact.id, channelType: 'WHATSAPP', channelIdentifier: phone, displayName: name },
    });

    return contact;
  }

  // ─── WEBHOOK OUTBOX ─────────────────────────────────

  async queueOutboundMessage(tenantId: string, provider: string, externalId: string, payload: any) {
    return this.prisma.integrationWebhookOutbox.create({
      data: {
        tenantId,
        provider,
        externalId,
        payload: payload as any,
        status: 'PENDING',
      },
    });
  }

  async processOutboundQueue(tenantId: string) {
    const pending = await this.prisma.integrationWebhookOutbox.findMany({
      where: { tenantId, status: { in: ['PENDING', 'RETRYING'] } },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    const results = [];
    for (const item of pending) {
      try {
        await this.sendToProvider(item.provider, item.payload as any);
        await this.prisma.integrationWebhookOutbox.update({
          where: { id: item.id },
          data: { status: 'SENT', lastAttemptAt: new Date(), attempts: item.attempts + 1 },
        });
        results.push({ id: item.id, status: 'SENT' });
      } catch (error) {
        const newAttempts = item.attempts + 1;
        const newStatus = newAttempts >= item.maxAttempts ? 'FAILED' : 'RETRYING';
        await this.prisma.integrationWebhookOutbox.update({
          where: { id: item.id },
          data: { status: newStatus, attempts: newAttempts, lastAttemptAt: new Date(), errorMessage: error.message },
        });
        results.push({ id: item.id, status: newStatus });
      }
    }

    return results;
  }

  private async sendToProvider(provider: string, payload: any) {
    if (provider === 'WHATSAPP_BUSINESS') {
      this.logger.log(`Would send WhatsApp message to ${payload.to}`);
    }
  }

  // ─── DELIVERY EVENTS ────────────────────────────────

  async processDeliveryEvent(tenantId: string, externalMessageId: string, status: string, metadata?: any) {
    const message = await this.prisma.message.findFirst({
      where: { externalId: externalMessageId, tenantId },
    });

    if (message) {
      await this.prisma.message.update({
        where: { id: message.id },
        data: { status: status.toUpperCase() },
      });
    }

    return this.prisma.messageDeliveryEvent.create({
      data: {
        tenantId,
        messageId: message?.id || 'unknown',
        externalId: externalMessageId,
        status: status.toUpperCase(),
        metadata: metadata as any,
      },
    });
  }

  // ─── TEMPLATES ──────────────────────────────────────

  async createTemplate(tenantId: string, dto: CreateTemplateDto) {
    return this.prisma.messageTemplate.create({
      data: { tenantId, ...dto, variables: dto.variables as any },
    });
  }

  async findTemplates(tenantId: string, category?: string) {
    const where: Prisma.MessageTemplateWhereInput = { tenantId };
    if (category) where.category = category;

    return this.prisma.messageTemplate.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findTemplateById(tenantId: string, id: string) {
    const template = await this.prisma.messageTemplate.findFirst({
      where: { id, tenantId },
    });
    if (!template) throw new NotFoundException(`Plantilla ${id} no encontrada`);
    return template;
  }

  async updateTemplate(tenantId: string, id: string, dto: UpdateTemplateDto) {
    await this.findTemplateById(tenantId, id);
    return this.prisma.messageTemplate.update({
      where: { id },
      data: { ...dto, variables: dto.variables as any },
    });
  }

  async deleteTemplate(tenantId: string, id: string) {
    await this.findTemplateById(tenantId, id);
    return this.prisma.messageTemplate.delete({ where: { id } });
  }

  async renderTemplate(tenantId: string, id: string, variables: Record<string, string>) {
    const template = await this.findTemplateById(tenantId, id);
    let body = template.body;

    for (const [key, value] of Object.entries(variables)) {
      body = body.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
    }

    return { ...template, renderedBody: body };
  }

  // ─── SEND WHATSAPP MESSAGE ──────────────────────────

  async sendWhatsAppMessage(tenantId: string, dto: SendWhatsAppMessageDto) {
    const conn = await this.prisma.integrationConnection.findFirst({
      where: { tenantId, provider: 'WHATSAPP_BUSINESS', status: 'ACTIVE' },
    });
    if (!conn) throw new BadRequestException('No hay conexión WhatsApp activa');

    let content = dto.message;
    if (dto.templateId) {
      const rendered = await this.renderTemplate(tenantId, dto.templateId, dto.templateVariables || {});
      content = (rendered as any).renderedBody;
    }

    const conversation = await this.prisma.conversation.findFirst({
      where: { externalId: dto.to, tenantId },
    });

    let conversationId = conversation?.id;
    if (!conversationId) {
      const conv = await this.prisma.conversation.create({
        data: { tenantId, channelType: 'WHATSAPP', externalId: dto.to, subject: `WhatsApp - ${dto.to}` },
      });
      conversationId = conv.id;
    }

    const message = await this.prisma.message.create({
      data: {
        tenantId,
        conversationId,
        senderType: 'USER',
        direction: 'OUTBOUND',
        content,
        contentType: 'TEXT',
        status: 'SENT',
      },
    });

    await this.queueOutboundMessage(tenantId, 'WHATSAPP_BUSINESS', dto.to, {
      messaging_product: 'whatsapp',
      to: dto.to,
      type: 'text',
      text: { body: content },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date(), lastMessagePreview: content.substring(0, 500) },
    });

    return message;
  }

  // ─── STATS ──────────────────────────────────────────

  async getIntegrationStats(tenantId: string) {
    const [connections, pendingOutbox, templates, recentDeliveryEvents, syncJobs] = await Promise.all([
      this.prisma.integrationConnection.count({ where: { tenantId } }),
      this.prisma.integrationWebhookOutbox.count({ where: { tenantId, status: 'PENDING' } }),
      this.prisma.messageTemplate.count({ where: { tenantId } }),
      this.prisma.messageDeliveryEvent.count({ where: { tenantId } }),
      this.prisma.integrationSyncJob.count({ where: { tenantId } }),
    ]);

    return { connections, pendingOutbox, templates, recentDeliveryEvents, syncJobs };
  }

  // ─── SYNC JOBS ──────────────────────────────────────

  async createSyncJob(tenantId: string, channelType: string, connectionId?: string, syncType: string = 'FULL') {
    return this.prisma.integrationSyncJob.create({
      data: {
        tenantId,
        channelType,
        connectionId: connectionId || null,
        syncType,
        status: 'PENDING',
      },
    });
  }

  async findSyncJobs(tenantId: string, channelType?: string) {
    const where: Prisma.IntegrationSyncJobWhereInput = { tenantId };
    if (channelType) where.channelType = channelType;

    return this.prisma.integrationSyncJob.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findSyncJobById(tenantId: string, id: string) {
    const job = await this.prisma.integrationSyncJob.findFirst({
      where: { id, tenantId },
    });
    if (!job) throw new NotFoundException(`Sync job ${id} no encontrado`);
    return job;
  }

  async startSyncJob(tenantId: string, id: string) {
    await this.findSyncJobById(tenantId, id);
    return this.prisma.integrationSyncJob.update({
      where: { id },
      data: { status: 'RUNNING', startedAt: new Date() },
    });
  }

  async completeSyncJob(tenantId: string, id: string, processedCount: number, errorCount: number = 0) {
    await this.findSyncJobById(tenantId, id);
    return this.prisma.integrationSyncJob.update({
      where: { id },
      data: {
        status: errorCount > 0 ? 'FAILED' : 'COMPLETED',
        completedAt: new Date(),
        processedCount,
        errorCount,
      },
    });
  }

  async failSyncJob(tenantId: string, id: string, errorMessage: string) {
    await this.findSyncJobById(tenantId, id);
    return this.prisma.integrationSyncJob.update({
      where: { id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        errorMessage,
      },
    });
  }

  // ─── CHANNEL ADAPTERS ───────────────────────────────

  async processChannelInbound(tenantId: string, channelType: string, payload: any) {
    const { InstagramAdapter, MessengerAdapter, EmailAdapter } = require('./adapters/channel.adapters');

    const adapters: Record<string, any> = {
      INSTAGRAM: new InstagramAdapter(),
      FACEBOOK: new MessengerAdapter(),
      EMAIL: new EmailAdapter(),
    };

    const adapter = adapters[channelType];
    if (!adapter) {
      this.logger.warn(`No adapter for channel type: ${channelType}`);
      return;
    }

    await adapter.handleInbound(tenantId, payload);
  }

  async sendViaChannel(tenantId: string, channelType: string, config: any, payload: any) {
    const { InstagramAdapter, MessengerAdapter, EmailAdapter } = require('./adapters/channel.adapters');

    const adapters: Record<string, any> = {
      INSTAGRAM: new InstagramAdapter(),
      FACEBOOK: new MessengerAdapter(),
      EMAIL: new EmailAdapter(),
    };

    const adapter = adapters[channelType];
    if (!adapter) {
      throw new BadRequestException(`No adapter for channel type: ${channelType}`);
    }

    return adapter.sendOutbound(tenantId, config, payload);
  }
}
