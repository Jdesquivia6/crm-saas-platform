import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateCustomFieldDto,
  UpdateCustomFieldDto,
  SetCustomFieldValueDto,
  CreateActivityDto,
  UpdateActivityDto,
  CreateConsentDto,
  GetTimelineDto,
} from './dto/client360.dto';

@Injectable()
export class Client360Service {
  private readonly logger = new Logger(Client360Service.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── TIMELINE ───────────────────────────────────────

  async getTimeline(tenantId: string, contactId: string, params: GetTimelineDto) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, tenantId, deletedAt: null },
    });
    if (!contact) throw new NotFoundException(`Contacto ${contactId} no encontrado`);

    const where: Prisma.ActivityWhereInput = { contactId, tenantId };

    if (params.startDate || params.endDate) {
      where.createdAt = {};
      if (params.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params.endDate) where.createdAt.lte = new Date(params.endDate);
    }

    if (params.types) {
      const types = params.types.split(',');
      where.activityType = { in: types };
    }

    const [activities, notes, total] = await Promise.all([
      this.prisma.activity.findMany({
        where,
        skip: parseInt(params.skip || '0', 10),
        take: parseInt(params.take || '50', 10),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactNote.findMany({
        where: { contactId, tenantId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.activity.count({ where }),
    ]);

    const timeline = [
      ...activities.map((a) => ({ ...a, _type: 'activity' as const })),
      ...notes.map((n) => ({
        id: n.id,
        createdAt: n.createdAt,
        _type: 'note' as const,
        activityType: 'NOTE',
        subject: null,
        description: n.content,
        status: n.isPinned ? 'PINNED' : null,
        tenantId,
        contactId,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return { timeline, total };
  }

  // ─── CONTACT SUMMARY ────────────────────────────────

  async getContactSummary(tenantId: string, contactId: string) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, tenantId, deletedAt: null },
      include: {
        contactTags: { include: { tag: true } },
        contactCompanyRelations: {
          include: { company: { select: { id: true, name: true, tradeName: true } } },
        },
        assignments: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
        identifiers: true,
        addresses: true,
      },
    });
    if (!contact) throw new NotFoundException(`Contacto ${contactId} no encontrado`);

    const [totalActivities, recentActivities, totalNotes, consents] = await Promise.all([
      this.prisma.activity.count({ where: { contactId, tenantId } }),
      this.prisma.activity.findMany({
        where: { contactId, tenantId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.contactNote.count({ where: { contactId, tenantId } }),
      this.prisma.contactConsent.findMany({
        where: { contactId, tenantId },
      }),
    ]);

    return {
      contact,
      stats: {
        totalActivities,
        totalNotes,
        recentActivities,
        consents,
      },
    };
  }

  // ─── CUSTOM FIELDS ──────────────────────────────────

  async createCustomField(tenantId: string, dto: CreateCustomFieldDto) {
    const existing = await this.prisma.customField.findUnique({
      where: { tenantId_entityType_fieldName: { tenantId, entityType: dto.entityType, fieldName: dto.fieldName } },
    });
    if (existing) throw new ConflictException(`Campo personalizado '${dto.fieldName}' ya existe`);

    const { options, ...fieldData } = dto;
    const field = await this.prisma.customField.create({
      data: { tenantId, ...fieldData },
    });

    if (options && options.length > 0) {
      await this.prisma.customFieldOption.createMany({
        data: options.map((opt, i) => ({
          customFieldId: field.id,
          value: opt.value,
          label: opt.label,
          color: opt.color,
          sortOrder: i,
        })),
      });
    }

    return this.findCustomFieldById(tenantId, field.id);
  }

  async findCustomFields(tenantId: string, entityType?: string) {
    const where: Prisma.CustomFieldWhereInput = { tenantId };
    if (entityType) where.entityType = entityType;

    return this.prisma.customField.findMany({
      where,
      include: { options: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findCustomFieldById(tenantId: string, id: string) {
    const field = await this.prisma.customField.findFirst({
      where: { id, tenantId },
      include: { options: { orderBy: { sortOrder: 'asc' } } },
    });
    if (!field) throw new NotFoundException(`Campo personalizado ${id} no encontrado`);
    return field;
  }

  async updateCustomField(tenantId: string, id: string, dto: UpdateCustomFieldDto) {
    await this.findCustomFieldById(tenantId, id);
    return this.prisma.customField.update({ where: { id }, data: dto });
  }

  async deleteCustomField(tenantId: string, id: string) {
    await this.findCustomFieldById(tenantId, id);
    return this.prisma.customField.delete({ where: { id } });
  }

  // ─── CUSTOM FIELD VALUES ────────────────────────────

  async setCustomFieldValue(tenantId: string, contactId: string, dto: SetCustomFieldValueDto) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, tenantId, deletedAt: null },
    });
    if (!contact) throw new NotFoundException(`Contacto ${contactId} no encontrado`);

    const field = await this.findCustomFieldById(tenantId, dto.customFieldId);

    return this.prisma.contactCustomValue.upsert({
      where: { contactId_customFieldId: { contactId, customFieldId: dto.customFieldId } },
      update: { value: dto.value },
      create: { tenantId, contactId, customFieldId: dto.customFieldId, value: dto.value },
    });
  }

  async getCustomFieldValues(tenantId: string, contactId: string) {
    return this.prisma.contactCustomValue.findMany({
      where: { contactId, tenantId },
      include: {
        customField: {
          include: { options: { orderBy: { sortOrder: 'asc' } } },
        },
      },
    });
  }

  async deleteCustomFieldValue(id: string) {
    return this.prisma.contactCustomValue.delete({ where: { id } });
  }

  // ─── ACTIVITIES ─────────────────────────────────────

  async createActivity(tenantId: string, userId: string | undefined, dto: CreateActivityDto) {
    if (dto.contactId) {
      const contact = await this.prisma.contact.findFirst({
        where: { id: dto.contactId, tenantId, deletedAt: null },
      });
      if (!contact) throw new NotFoundException(`Contacto ${dto.contactId} no encontrado`);
    }

    return this.prisma.activity.create({
      data: {
        tenantId,
        userId: userId || null,
        contactId: dto.contactId || null,
        companyId: dto.companyId || null,
        activityType: dto.activityType,
        direction: dto.direction,
        subject: dto.subject,
        description: dto.description,
        outcome: dto.outcome,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
        duration: dto.duration,
        priority: dto.priority || 'MEDIUM',
        status: dto.status || 'OPEN',
      },
    });
  }

  async findActivities(tenantId: string, params?: { skip?: number; take?: number; contactId?: string; status?: string }) {
    const where: Prisma.ActivityWhereInput = { tenantId };
    if (params?.contactId) where.contactId = params.contactId;
    if (params?.status) where.status = params.status;

    return this.prisma.activity.findMany({
      where,
      skip: params?.skip || 0,
      take: params?.take || 50,
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        company: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findActivityById(tenantId: string, id: string) {
    const activity = await this.prisma.activity.findFirst({
      where: { id, tenantId },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        company: { select: { id: true, name: true } },
      },
    });
    if (!activity) throw new NotFoundException(`Actividad ${id} no encontrada`);
    return activity;
  }

  async updateActivity(tenantId: string, id: string, dto: UpdateActivityDto) {
    await this.findActivityById(tenantId, id);
    return this.prisma.activity.update({
      where: { id },
      data: {
        ...dto,
        completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
      },
    });
  }

  async deleteActivity(tenantId: string, id: string) {
    await this.findActivityById(tenantId, id);
    return this.prisma.activity.delete({ where: { id } });
  }

  async completeActivity(tenantId: string, id: string) {
    await this.findActivityById(tenantId, id);
    return this.prisma.activity.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
  }

  // ─── CONSENTS ───────────────────────────────────────

  async upsertConsent(tenantId: string, contactId: string, dto: CreateConsentDto) {
    const contact = await this.prisma.contact.findFirst({
      where: { id: contactId, tenantId, deletedAt: null },
    });
    if (!contact) throw new NotFoundException(`Contacto ${contactId} no encontrado`);

    const status = dto.status || 'GRANTED';
    const now = new Date();
    const updateData: Prisma.ContactConsentUpdateInput = { status, source: dto.source, purpose: dto.purpose, legalBasis: dto.legalBasis };

    if (status === 'GRANTED') updateData.grantedAt = now;
    else if (status === 'DENIED') updateData.deniedAt = now;
    else if (status === 'WITHDRAWN') updateData.withdrawnAt = now;

    return this.prisma.contactConsent.upsert({
      where: { tenantId_contactId_channel: { tenantId, contactId, channel: dto.channel } },
      update: updateData,
      create: {
        tenantId,
        contactId,
        channel: dto.channel,
        status,
        source: dto.source,
        purpose: dto.purpose,
        legalBasis: dto.legalBasis,
        grantedAt: status === 'GRANTED' ? now : null,
      },
    });
  }

  async findConsents(tenantId: string, contactId: string) {
    return this.prisma.contactConsent.findMany({
      where: { contactId, tenantId },
      orderBy: { channel: 'asc' },
    });
  }

  async deleteConsent(tenantId: string, contactId: string, channel: string) {
    return this.prisma.contactConsent.delete({
      where: { tenantId_contactId_channel: { tenantId, contactId, channel } },
    });
  }
}
