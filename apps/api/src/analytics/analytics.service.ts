import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { TrackEventDto, GetMetricsDto, GetDashboardDto } from './dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async trackEvent(tenantId: string, dto: TrackEventDto) {
    const event = await (this.prisma as any).analyticsEvent.create({
      data: {
        tenantId,
        eventType: dto.eventType,
        entityType: dto.entityType,
        entityId: dto.entityId,
        userId: dto.userId,
        metadata: dto.metadata ?? {},
        ipAddress: dto.ipAddress,
        userAgent: dto.userAgent,
      },
    });

    return event;
  }

  async getEvents(tenantId: string, dto: GetMetricsDto) {
    const events = await (this.prisma as any).analyticsEvent.findMany({
      where: {
        tenantId,
        createdAt: {
          gte: new Date(dto.dateFrom),
          lte: new Date(dto.dateTo),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return events;
  }

  async getDashboard(tenantId: string, dto: GetDashboardDto) {
    const dateFrom = dto.dateFrom ? new Date(dto.dateFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dateTo = dto.dateTo ? new Date(dto.dateTo) : new Date();

    const [tenantMetrics, contactMetrics, channelMetrics, campaignMetrics, agentMetrics, productMetrics, recentEvents] =
      await Promise.all([
        (this.prisma as any).tenantMetricsDaily.findMany({
          where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
          orderBy: { date: 'asc' },
        }),
        (this.prisma as any).contactMetricsDaily.findMany({
          where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
          orderBy: { date: 'asc' },
        }),
        (this.prisma as any).channelMetricsDaily.findMany({
          where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
          orderBy: { date: 'asc' },
        }),
        (this.prisma as any).campaignMetricsDaily.findMany({
          where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
          orderBy: { date: 'asc' },
        }),
        (this.prisma as any).agentMetricsDaily.findMany({
          where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
          orderBy: { date: 'asc' },
        }),
        (this.prisma as any).productMetricsDaily.findMany({
          where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
          orderBy: { date: 'asc' },
        }),
        (this.prisma as any).analyticsEvent.findMany({
          where: { tenantId, createdAt: { gte: dateFrom, lte: dateTo } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        }),
      ]);

    return {
      tenant: tenantMetrics,
      contacts: contactMetrics,
      channels: channelMetrics,
      campaigns: campaignMetrics,
      agents: agentMetrics,
      products: productMetrics,
      recentEvents,
    };
  }

  async getMetrics(tenantId: string, dto: GetMetricsDto) {
    const dateFrom = new Date(dto.dateFrom);
    const dateTo = new Date(dto.dateTo);

    const [tenantMetrics, contactMetrics, channelMetrics, campaignMetrics] = await Promise.all([
      (this.prisma as any).tenantMetricsDaily.findMany({
        where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
        orderBy: { date: 'asc' },
      }),
      (this.prisma as any).contactMetricsDaily.findMany({
        where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
        orderBy: { date: 'asc' },
      }),
      (this.prisma as any).channelMetricsDaily.findMany({
        where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
        orderBy: { date: 'asc' },
      }),
      (this.prisma as any).campaignMetricsDaily.findMany({
        where: { tenantId, date: { gte: dateFrom, lte: dateTo } },
        orderBy: { date: 'asc' },
      }),
    ]);

    return { tenant: tenantMetrics, contacts: contactMetrics, channels: channelMetrics, campaigns: campaignMetrics };
  }

  async getContactMetrics(tenantId: string, dto: GetMetricsDto) {
    return (this.prisma as any).contactMetricsDaily.findMany({
      where: {
        tenantId,
        date: { gte: new Date(dto.dateFrom), lte: new Date(dto.dateTo) },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getProductMetrics(tenantId: string, dto: GetMetricsDto) {
    return (this.prisma as any).productMetricsDaily.findMany({
      where: {
        tenantId,
        date: { gte: new Date(dto.dateFrom), lte: new Date(dto.dateTo) },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getAgentMetrics(tenantId: string, dto: GetMetricsDto) {
    return (this.prisma as any).agentMetricsDaily.findMany({
      where: {
        tenantId,
        date: { gte: new Date(dto.dateFrom), lte: new Date(dto.dateTo) },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getChannelMetrics(tenantId: string, dto: GetMetricsDto) {
    return (this.prisma as any).channelMetricsDaily.findMany({
      where: {
        tenantId,
        date: { gte: new Date(dto.dateFrom), lte: new Date(dto.dateTo) },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getCampaignMetrics(tenantId: string, dto: GetMetricsDto) {
    return (this.prisma as any).campaignMetricsDaily.findMany({
      where: {
        tenantId,
        date: { gte: new Date(dto.dateFrom), lte: new Date(dto.dateTo) },
      },
      orderBy: { date: 'asc' },
    });
  }

  async getTenantMetrics(tenantId: string, dto: GetMetricsDto) {
    return (this.prisma as any).tenantMetricsDaily.findMany({
      where: {
        tenantId,
        date: { gte: new Date(dto.dateFrom), lte: new Date(dto.dateTo) },
      },
      orderBy: { date: 'asc' },
    });
  }
}
