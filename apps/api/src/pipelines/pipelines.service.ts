import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class PipelinesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.pipeline.findMany({
      where: { tenantId },
      include: {
        stages: { orderBy: { position: 'asc' } },
        _count: { select: { opportunities: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id, tenantId },
      include: {
        stages: {
          orderBy: { position: 'asc' },
          include: {
            opportunities: {
              where: { deletedAt: null },
              include: { contact: true, company: true, assignee: true },
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!pipeline) throw new NotFoundException('Pipeline not found');
    return pipeline;
  }

  async create(tenantId: string, data: any) {
    if (data.isDefault) {
      await this.prisma.pipeline.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.pipeline.create({
      data: { tenantId, ...data },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id, tenantId },
    });

    if (!pipeline) throw new NotFoundException('Pipeline not found');

    if (data.isDefault) {
      await this.prisma.pipeline.updateMany({
        where: { tenantId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.pipeline.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id, tenantId },
      include: { _count: { select: { opportunities: true } } },
    });

    if (!pipeline) throw new NotFoundException('Pipeline not found');
    if (pipeline._count.opportunities > 0) {
      throw new BadRequestException('Cannot delete pipeline with opportunities');
    }

    return this.prisma.pipeline.delete({ where: { id } });
  }

  async addStage(tenantId: string, pipelineId: string, data: any) {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id: pipelineId, tenantId },
    });

    if (!pipeline) throw new NotFoundException('Pipeline not found');

    const maxPosition = await this.prisma.pipelineStage.findFirst({
      where: { pipelineId },
      orderBy: { position: 'desc' },
      select: { position: true },
    });

    return this.prisma.pipelineStage.create({
      data: {
        tenantId,
        pipelineId,
        ...data,
        position: data.position ?? (maxPosition?.position ?? 0) + 1,
      },
    });
  }

  async updateStage(tenantId: string, stageId: string, data: any) {
    const stage = await this.prisma.pipelineStage.findFirst({
      where: { id: stageId, tenantId },
    });

    if (!stage) throw new NotFoundException('Stage not found');

    return this.prisma.pipelineStage.update({
      where: { id: stageId },
      data,
    });
  }

  async removeStage(tenantId: string, stageId: string) {
    const stage = await this.prisma.pipelineStage.findFirst({
      where: { id: stageId, tenantId },
      include: { _count: { select: { opportunities: true } } },
    });

    if (!stage) throw new NotFoundException('Stage not found');
    if (stage._count.opportunities > 0) {
      throw new BadRequestException('Cannot delete stage with opportunities');
    }

    return this.prisma.pipelineStage.delete({ where: { id: stageId } });
  }
}
