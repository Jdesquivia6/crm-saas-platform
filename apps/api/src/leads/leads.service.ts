import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { search, status, priority, assignedTo, sourceId, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId, deletedAt: null };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignedTo) where.assignedTo = assignedTo;
    if (sourceId) where.sourceId = sourceId;

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        include: {
          source: true,
          contact: true,
          company: true,
          assignee: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { leads, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(tenantId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        source: true,
        contact: true,
        company: true,
        assignee: true,
        statusHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async create(tenantId: string, data: any) {
    return this.prisma.lead.create({
      data: {
        tenantId,
        ...data,
      },
      include: {
        source: true,
        contact: true,
        company: true,
        assignee: true,
      },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!lead) throw new NotFoundException('Lead not found');

    if (data.status && data.status !== lead.status) {
      await this.prisma.leadStatusHistory.create({
        data: {
          tenantId,
          leadId: id,
          fromStatus: lead.status,
          toStatus: data.status,
        },
      });
    }

    return this.prisma.lead.update({
      where: { id },
      data,
      include: {
        source: true,
        contact: true,
        company: true,
        assignee: true,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!lead) throw new NotFoundException('Lead not found');

    return this.prisma.lead.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async convertToOpportunity(tenantId: string, leadId: string, pipelineId: string, stageId: string) {
    const lead = await this.prisma.lead.findFirst({
      where: { id: leadId, tenantId, deletedAt: null },
    });

    if (!lead) throw new NotFoundException('Lead not found');
    if (lead.status === 'CONVERTED') throw new BadRequestException('Lead already converted');

    const opportunity = await this.prisma.opportunity.create({
      data: {
        tenantId,
        pipelineId,
        stageId,
        contactId: lead.contactId,
        companyId: lead.companyId,
        assignedTo: lead.assignedTo,
        title: `${lead.firstName} ${lead.lastName || ''}`.trim(),
        amount: lead.budget,
        expectedCloseDate: lead.expectedCloseDate,
        status: 'OPEN',
      },
    });

    await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        status: 'CONVERTED',
        convertedAt: new Date(),
      },
    });

    await this.prisma.leadStatusHistory.create({
      data: {
        tenantId,
        leadId,
        fromStatus: lead.status,
        toStatus: 'CONVERTED',
      },
    });

    return opportunity;
  }

  async getStats(tenantId: string) {
    const [total, byStatus, byPriority] = await Promise.all([
      this.prisma.lead.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.lead.groupBy({
        by: ['status'],
        where: { tenantId, deletedAt: null },
        _count: true,
      }),
      this.prisma.lead.groupBy({
        by: ['priority'],
        where: { tenantId, deletedAt: null },
        _count: true,
      }),
    ]);

    return { total, byStatus, byPriority };
  }
}
