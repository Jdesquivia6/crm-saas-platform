import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateTicketCategoryDto,
  UpdateTicketCategoryDto,
  CreateSlaPolicyDto,
  CreateTicketDto,
  UpdateTicketDto,
  CreateTicketCommentDto,
  AssignTicketDto,
  CreateSatisfactionSurveyDto,
  SearchTicketsDto,
} from './dto/ticketing.dto';

@Injectable()
export class TicketingService {
  private readonly logger = new Logger(TicketingService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── CATEGORIES ─────────────────────────────────────

  async createCategory(tenantId: string, dto: CreateTicketCategoryDto) {
    return this.prisma.ticketCategory.create({
      data: { tenantId, ...dto },
    });
  }

  async findCategories(tenantId: string) {
    return this.prisma.ticketCategory.findMany({
      where: { tenantId, isActive: true },
      include: { _count: { select: { tickets: true } } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async updateCategory(tenantId: string, id: string, dto: UpdateTicketCategoryDto) {
    const category = await this.prisma.ticketCategory.findFirst({ where: { id, tenantId } });
    if (!category) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return this.prisma.ticketCategory.update({ where: { id }, data: dto });
  }

  async deleteCategory(tenantId: string, id: string) {
    const category = await this.prisma.ticketCategory.findFirst({ where: { id, tenantId } });
    if (!category) throw new NotFoundException(`Categoría ${id} no encontrada`);
    return this.prisma.ticketCategory.update({ where: { id }, data: { isActive: false } });
  }

  // ─── SLA POLICIES ───────────────────────────────────

  async createSlaPolicy(tenantId: string, dto: CreateSlaPolicyDto) {
    return this.prisma.slaPolicy.create({
      data: { tenantId, ...dto },
    });
  }

  async findSlaPolicies(tenantId: string) {
    return this.prisma.slaPolicy.findMany({
      where: { tenantId, isActive: true },
      orderBy: { priority: 'asc' },
    });
  }

  async updateSlaPolicy(tenantId: string, id: string, dto: Partial<CreateSlaPolicyDto>) {
    const policy = await this.prisma.slaPolicy.findFirst({ where: { id, tenantId } });
    if (!policy) throw new NotFoundException(`Política SLA ${id} no encontrada`);
    return this.prisma.slaPolicy.update({ where: { id }, data: dto });
  }

  // ─── TICKETS ────────────────────────────────────────

  async createTicket(tenantId: string, dto: CreateTicketDto) {
    const slaPolicy = dto.priority
      ? await this.prisma.slaPolicy.findFirst({ where: { tenantId, priority: dto.priority, isActive: true } })
      : null;

    const now = new Date();
    const slaResponseAt = slaPolicy ? new Date(now.getTime() + slaPolicy.responseTime * 60 * 1000) : now;
    const slaResolveAt = slaPolicy ? new Date(now.getTime() + slaPolicy.resolutionTime * 60 * 1000) : now;

    const ticket = await this.prisma.ticket.create({
      data: {
        tenantId,
        contactId: dto.contactId || null,
        companyId: dto.companyId || null,
        categoryId: dto.categoryId || null,
        slaPolicyId: slaPolicy?.id || null,
        subject: dto.subject,
        description: dto.description,
        priority: dto.priority || 'NORMAL',
        channel: dto.channel,
        slaResponseAt: slaResponseAt,
        slaResolveAt: slaResolveAt,
      },
      include: {
        category: true,
        slaPolicy: true,
      },
    });

    if (slaPolicy) {
      await this.prisma.ticketSlaEvent.createMany({
        data: [
          { tenantId, ticketId: ticket.id, eventType: 'RESPONSE_DUE', dueAt: slaResponseAt },
          { tenantId, ticketId: ticket.id, eventType: 'RESOLUTION_DUE', dueAt: slaResolveAt },
        ],
      });
    }

    return ticket;
  }

  async findTickets(tenantId: string, params: SearchTicketsDto) {
    const where: Prisma.TicketWhereInput = { tenantId };

    if (params.status) where.status = params.status;
    if (params.priority) where.priority = params.priority;
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.contactId) where.contactId = params.contactId;

    return this.prisma.ticket.findMany({
      where,
      skip: parseInt(params.skip || '0', 10),
      take: parseInt(params.take || '20', 10),
      include: {
        category: true,
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignments: {
          include: { user: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findTicketById(tenantId: string, id: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, tenantId },
      include: {
        category: true,
        slaPolicy: true,
        contact: { select: { id: true, firstName: true, lastName: true, email: true } },
        company: { select: { id: true, name: true } },
        comments: { orderBy: { createdAt: 'desc' } },
        assignments: {
          include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        },
        statusHistory: { orderBy: { createdAt: 'desc' }, take: 10 },
        slaEvents: true,
        satisfactionSurvey: true,
      },
    });
    if (!ticket) throw new NotFoundException(`Ticket ${id} no encontrado`);
    return ticket;
  }

  async updateTicket(tenantId: string, id: string, dto: UpdateTicketDto) {
    const ticket = await this.findTicketById(tenantId, id);

    if (dto.status && dto.status !== ticket.status) {
      await this.prisma.ticketStatusHistory.create({
        data: { tenantId, ticketId: id, fromStatus: ticket.status, toStatus: dto.status },
      });

      if (dto.status === 'RESOLVED') {
        await this.prisma.ticket.update({
          where: { id },
          data: { resolvedAt: new Date() },
        });
      }
      if (dto.status === 'CLOSED') {
        await this.prisma.ticket.update({
          where: { id },
          data: { closedAt: new Date() },
        });
      }
    }

    return this.prisma.ticket.update({ where: { id }, data: dto });
  }

  // ─── TICKET COMMENTS ────────────────────────────────

  async addComment(tenantId: string, ticketId: string, userId: string | undefined, dto: CreateTicketCommentDto) {
    const ticket = await this.findTicketById(tenantId, ticketId);

    const comment = await this.prisma.ticketComment.create({
      data: {
        tenantId,
        ticketId,
        userId: userId || null,
        content: dto.content,
        isInternal: dto.isInternal || false,
      },
    });

    if (!dto.isInternal && !ticket.firstResponseAt) {
      await this.prisma.ticket.update({
        where: { id: ticketId },
        data: { firstResponseAt: new Date() },
      });

      const slaEvent = await this.prisma.ticketSlaEvent.findFirst({
        where: { ticketId, eventType: 'RESPONSE_DUE', occurredAt: null },
      });
      if (slaEvent) {
        await this.prisma.ticketSlaEvent.update({
          where: { id: slaEvent.id },
          data: { occurredAt: new Date() },
        });
      }
    }

    return comment;
  }

  async findComments(tenantId: string, ticketId: string) {
    return this.prisma.ticketComment.findMany({
      where: { ticketId, tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteComment(tenantId: string, commentId: string) {
    return this.prisma.ticketComment.delete({ where: { id: commentId } });
  }

  // ─── TICKET ASSIGNMENTS ─────────────────────────────

  async assignTicket(tenantId: string, ticketId: string, dto: AssignTicketDto) {
    const ticket = await this.findTicketById(tenantId, ticketId);

    const existing = await this.prisma.ticketAssignment.findUnique({
      where: { ticketId_userId: { ticketId, userId: dto.userId } },
    });
    if (existing) throw new ConflictException('Usuario ya asignado a este ticket');

    return this.prisma.ticketAssignment.create({
      data: {
        tenantId,
        ticketId,
        userId: dto.userId,
        isPrimary: dto.isPrimary || false,
      },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });
  }

  async unassignTicket(ticketId: string, userId: string) {
    return this.prisma.ticketAssignment.delete({
      where: { ticketId_userId: { ticketId, userId } },
    });
  }

  // ─── SATISFACTION SURVEYS ───────────────────────────

  async createSatisfactionSurvey(tenantId: string, ticketId: string, dto: CreateSatisfactionSurveyDto) {
    const ticket = await this.findTicketById(tenantId, ticketId);
    if (!ticket.contactId) throw new ConflictException('Ticket no tiene contacto asociado');

    const existing = await this.prisma.satisfactionSurvey.findUnique({
      where: { ticketId },
    });
    if (existing) throw new ConflictException('Encuesta ya existe para este ticket');

    return this.prisma.satisfactionSurvey.create({
      data: {
        tenantId,
        ticketId,
        contactId: ticket.contactId,
        rating: dto.rating,
        comment: dto.comment,
        nps: dto.nps,
        respondedAt: new Date(),
      },
    });
  }

  async findSurveys(tenantId: string) {
    return this.prisma.satisfactionSurvey.findMany({
      where: { tenantId },
      include: {
        ticket: { select: { id: true, subject: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ─── STATS ──────────────────────────────────────────

  async getTicketStats(tenantId: string) {
    const [total, open, inProgress, resolved, closed, byPriority, byCategory] = await Promise.all([
      this.prisma.ticket.count({ where: { tenantId } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'OPEN' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'RESOLVED' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'CLOSED' } }),
      this.prisma.ticket.groupBy({
        by: ['priority'],
        where: { tenantId },
        _count: true,
      }),
      this.prisma.ticket.groupBy({
        by: ['categoryId'],
        where: { tenantId },
        _count: true,
      }),
    ]);

    return {
      total, open, inProgress, resolved, closed,
      byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count })),
      byCategory: byCategory.map((c) => ({ categoryId: c.categoryId, count: c._count })),
    };
  }
}
