import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class OpportunitiesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { search, pipelineId, stageId, status, assignedTo, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId, deletedAt: null };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (pipelineId) where.pipelineId = pipelineId;
    if (stageId) where.stageId = stageId;
    if (status) where.status = status;
    if (assignedTo) where.assignedTo = assignedTo;

    const [opportunities, total] = await Promise.all([
      this.prisma.opportunity.findMany({
        where,
        include: {
          pipeline: true,
          stage: true,
          contact: true,
          company: true,
          assignee: true,
          contacts: { include: { contact: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.opportunity.count({ where }),
    ]);

    return { opportunities, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(tenantId: string, id: string) {
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        pipeline: true,
        stage: true,
        contact: true,
        company: true,
        assignee: true,
        contacts: { include: { contact: true } },
        stageHistory: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!opportunity) throw new NotFoundException('Opportunity not found');
    return opportunity;
  }

  async create(tenantId: string, data: any) {
    const { contacts, ...opportunityData } = data;

    const opportunity = await this.prisma.opportunity.create({
      data: {
        tenantId,
        ...opportunityData,
      },
    });

    if (contacts && contacts.length > 0) {
      await this.prisma.opportunityContact.createMany({
        data: contacts.map((c: any) => ({
          tenantId,
          opportunityId: opportunity.id,
          contactId: c.contactId,
          role: c.role,
          isPrimary: c.isPrimary || false,
        })),
      });
    }

    return this.findOne(tenantId, opportunity.id);
  }

  async update(tenantId: string, id: string, data: any) {
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!opportunity) throw new NotFoundException('Opportunity not found');

    if (data.stageId && data.stageId !== opportunity.stageId) {
      await this.prisma.opportunityStageHistory.create({
        data: {
          tenantId,
          opportunityId: id,
          fromStageId: opportunity.stageId,
          toStageId: data.stageId,
        },
      });

      const stage = await this.prisma.pipelineStage.findUnique({
        where: { id: data.stageId },
      });

      if (stage) {
        data.probability = stage.probability;
      }
    }

    if (data.status === 'WON' || data.status === 'LOST') {
      data.actualCloseDate = new Date();
    }

    return this.prisma.opportunity.update({
      where: { id },
      data,
      include: {
        pipeline: true,
        stage: true,
        contact: true,
        company: true,
        assignee: true,
        contacts: { include: { contact: true } },
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const opportunity = await this.prisma.opportunity.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!opportunity) throw new NotFoundException('Opportunity not found');

    return this.prisma.opportunity.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats(tenantId: string, pipelineId?: string) {
    const where: any = { tenantId, deletedAt: null };
    if (pipelineId) where.pipelineId = pipelineId;

    const [total, byStatus, byStage, totalAmount] = await Promise.all([
      this.prisma.opportunity.count({ where }),
      this.prisma.opportunity.groupBy({
        by: ['status'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.opportunity.groupBy({
        by: ['stageId'],
        where,
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.opportunity.aggregate({
        where,
        _sum: { amount: true },
      }),
    ]);

    return {
      total,
      byStatus,
      byStage,
      totalAmount: totalAmount._sum.amount || 0,
    };
  }
}
