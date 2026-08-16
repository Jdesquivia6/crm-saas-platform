import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ChatGateway } from './chat.gateway';
import {
  CreateChannelAccountDto,
  UpdateChannelAccountDto,
  CreateConversationDto,
  UpdateConversationDto,
  SendMessageDto,
  CreateCannedResponseDto,
  UpdateCannedResponseDto,
  SearchConversationsDto,
} from './dto/omnichannel.dto';

@Injectable()
export class OmnichannelService {
  private readonly logger = new Logger(OmnichannelService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: ChatGateway,
  ) {}

  // ─── CHANNEL ACCOUNTS ───────────────────────────────

  async createChannelAccount(tenantId: string, dto: CreateChannelAccountDto) {
    return this.prisma.channelAccount.create({
      data: { tenantId, ...dto, config: dto.config || {} },
    });
  }

  async findChannelAccounts(tenantId: string) {
    return this.prisma.channelAccount.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findChannelAccountById(tenantId: string, id: string) {
    const account = await this.prisma.channelAccount.findFirst({
      where: { id, tenantId },
    });
    if (!account) throw new NotFoundException(`Cuenta de canal ${id} no encontrada`);
    return account;
  }

  async updateChannelAccount(tenantId: string, id: string, dto: UpdateChannelAccountDto) {
    await this.findChannelAccountById(tenantId, id);
    return this.prisma.channelAccount.update({ where: { id }, data: dto });
  }

  async deleteChannelAccount(tenantId: string, id: string) {
    await this.findChannelAccountById(tenantId, id);
    return this.prisma.channelAccount.delete({ where: { id } });
  }

  // ─── CONTACT CHANNEL IDENTITIES ─────────────────────

  async upsertContactIdentity(tenantId: string, contactId: string, channelType: string, identifier: string, displayName?: string) {
    return this.prisma.contactChannelIdentity.upsert({
      where: { tenantId_channelType_channelIdentifier: { tenantId, channelType, channelIdentifier: identifier } },
      update: { contactId, displayName },
      create: { tenantId, contactId, channelType, channelIdentifier: identifier, displayName },
    });
  }

  async findContactIdentities(tenantId: string, contactId: string) {
    return this.prisma.contactChannelIdentity.findMany({
      where: { contactId, tenantId },
    });
  }

  async findContactByIdentity(tenantId: string, channelType: string, identifier: string) {
    return this.prisma.contactChannelIdentity.findUnique({
      where: { tenantId_channelType_channelIdentifier: { tenantId, channelType, channelIdentifier: identifier } },
      include: { contact: true },
    });
  }

  // ─── CONVERSATIONS ──────────────────────────────────

  async createConversation(tenantId: string, dto: CreateConversationDto) {
    const conversation = await this.prisma.conversation.create({
      data: {
        tenantId,
        contactId: dto.contactId || null,
        channelType: dto.channelType,
        channelAccountId: dto.channelAccountId || null,
        externalId: dto.externalId || null,
        subject: dto.subject || null,
      },
    });

    if (dto.contactId) {
      await this.prisma.conversationParticipant.create({
        data: {
          conversationId: conversation.id,
          contactId: dto.contactId,
          role: 'PARTICIPANT',
        },
      });
    }

    return this.findConversationById(tenantId, conversation.id);
  }

  async findConversations(tenantId: string, params: SearchConversationsDto) {
    const where: Prisma.ConversationWhereInput = { tenantId };

    if (params.status) where.status = params.status;
    if (params.channelType) where.channelType = params.channelType;
    if (params.contactId) where.contactId = params.contactId;

    return this.prisma.conversation.findMany({
      where,
      skip: parseInt(params.skip || '0', 10),
      take: parseInt(params.take || '20', 10),
      include: {
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        participants: {
          include: { contact: { select: { id: true, firstName: true, lastName: true } } },
        },
        assignments: true,
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  async findConversationById(tenantId: string, id: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, tenantId },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        participants: {
          include: { contact: { select: { id: true, firstName: true, lastName: true } } },
        },
        assignments: true,
        messages: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    });
    if (!conversation) throw new NotFoundException(`Conversación ${id} no encontrada`);
    return conversation;
  }

  async updateConversation(tenantId: string, id: string, dto: UpdateConversationDto) {
    await this.findConversationById(tenantId, id);

    if (dto.status) {
      await this.prisma.conversationStatusHistory.create({
        data: {
          conversationId: id,
          toStatus: dto.status,
        },
      });
    }

    return this.prisma.conversation.update({ where: { id }, data: dto });
  }

  async closeConversation(tenantId: string, id: string) {
    await this.findConversationById(tenantId, id);
    return this.prisma.conversation.update({
      where: { id },
      data: { status: 'CLOSED', closedAt: new Date() },
    });
  }

  // ─── MESSAGES ───────────────────────────────────────

  async sendMessage(tenantId: string, conversationId: string, dto: SendMessageDto) {
    const conversation = await this.findConversationById(tenantId, conversationId);

    const message = await this.prisma.message.create({
      data: {
        tenantId,
        conversationId,
        senderType: dto.senderType || 'USER',
        senderId: dto.senderId || null,
        direction: dto.senderType === 'CONTACT' ? 'INBOUND' : 'OUTBOUND',
        content: dto.content,
        contentType: dto.contentType || 'TEXT',
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        lastMessageAt: new Date(),
        lastMessagePreview: dto.content.substring(0, 500),
      },
    });

    this.gateway.broadcastToConversation(conversationId, 'new-message', message);

    return message;
  }

  async findMessages(tenantId: string, conversationId: string, params?: { skip?: number; take?: number }) {
    return this.prisma.message.findMany({
      where: { conversationId, tenantId },
      skip: params?.skip || 0,
      take: params?.take || 50,
      include: { attachments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── CONVERSATION ASSIGNMENTS ───────────────────────

  async assignConversation(tenantId: string, conversationId: string, userId: string) {
    return this.prisma.conversationAssignment.create({
      data: { conversationId, userId },
    });
  }

  async unassignConversation(conversationId: string, userId: string) {
    return this.prisma.conversationAssignment.delete({
      where: { conversationId_userId: { conversationId, userId } },
    });
  }

  // ─── CANNED RESPONSES ───────────────────────────────

  async createCannedResponse(tenantId: string, dto: CreateCannedResponseDto) {
    return this.prisma.cannedResponse.create({
      data: { tenantId, ...dto },
    });
  }

  async findCannedResponses(tenantId: string, category?: string) {
    const where: Prisma.CannedResponseWhereInput = { tenantId, isActive: true };
    if (category) where.category = category;

    return this.prisma.cannedResponse.findMany({
      where,
      orderBy: { shortcut: 'asc' },
    });
  }

  async updateCannedResponse(tenantId: string, id: string, dto: UpdateCannedResponseDto) {
    const response = await this.prisma.cannedResponse.findFirst({
      where: { id, tenantId },
    });
    if (!response) throw new NotFoundException(`Respuesta rápida ${id} no encontrada`);

    return this.prisma.cannedResponse.update({ where: { id }, data: dto });
  }

  async deleteCannedResponse(tenantId: string, id: string) {
    const response = await this.prisma.cannedResponse.findFirst({
      where: { id, tenantId },
    });
    if (!response) throw new NotFoundException(`Respuesta rápida ${id} no encontrada`);

    return this.prisma.cannedResponse.delete({ where: { id } });
  }

  // ─── STATS ──────────────────────────────────────────

  async getOmnichannelStats(tenantId: string) {
    const [totalConversations, openConversations, totalMessages, byChannel] = await Promise.all([
      this.prisma.conversation.count({ where: { tenantId } }),
      this.prisma.conversation.count({ where: { tenantId, status: 'OPEN' } }),
      this.prisma.message.count({ where: { tenantId } }),
      this.prisma.conversation.groupBy({
        by: ['channelType'],
        where: { tenantId },
        _count: true,
      }),
    ]);

    return {
      conversations: { total: totalConversations, open: openConversations },
      messages: { total: totalMessages },
      byChannel: byChannel.map((c) => ({ channel: c.channelType, count: c._count })),
    };
  }
}
