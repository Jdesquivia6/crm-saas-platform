import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { AuditLog, Prisma } from '@prisma/client';

export interface CreateAuditLogParams {
  tenantId?: string;
  userId?: string;
  action: string;
  module: string;
  entityType?: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: CreateAuditLogParams): Promise<AuditLog> {
    return this.prisma.auditLog.create({
      data: {
        tenantId: params.tenantId,
        userId: params.userId,
        action: params.action,
        module: params.module,
        entityType: params.entityType,
        entityId: params.entityId,
        oldValues: params.oldValues as Prisma.InputJsonValue,
        newValues: params.newValues as Prisma.InputJsonValue,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        requestId: params.requestId,
      },
    });
  }

  async findLogs(params?: {
    tenantId?: string;
    entityType?: string;
    entityId?: string;
    action?: string;
    skip?: number;
    take?: number;
  }): Promise<AuditLog[]> {
    const where: Prisma.AuditLogWhereInput = {};

    if (params?.tenantId) where.tenantId = params.tenantId;
    if (params?.entityType) where.entityType = params.entityType;
    if (params?.entityId) where.entityId = params.entityId;
    if (params?.action) where.action = params.action;

    return this.prisma.auditLog.findMany({
      where,
      skip: params?.skip || 0,
      take: params?.take || 50,
      orderBy: { occurredAt: 'desc' },
    });
  }
}
