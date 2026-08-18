import { Controller, Post, Get, Body, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto, GetMetricsDto, GetDashboardDto } from './dto';

@ApiTags('Analytics')
@ApiBearerAuth('access-token')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @ApiOperation({ summary: 'Track an analytics event' })
  async trackEvent(@Headers('x-tenant-id') tenantId: string, @Body() dto: TrackEventDto) {
    return this.analyticsService.trackEvent(tenantId, dto);
  }

  @Get('events')
  @ApiOperation({ summary: 'Get analytics events' })
  async getEvents(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetMetricsDto) {
    return this.analyticsService.getEvents(tenantId, dto);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard data' })
  async getDashboard(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetDashboardDto) {
    return this.analyticsService.getDashboard(tenantId, dto);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get all metrics' })
  async getMetrics(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetMetricsDto) {
    return this.analyticsService.getMetrics(tenantId, dto);
  }

  @Get('metrics/contacts')
  @ApiOperation({ summary: 'Get contact metrics' })
  async getContactMetrics(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetMetricsDto) {
    return this.analyticsService.getContactMetrics(tenantId, dto);
  }

  @Get('metrics/products')
  @ApiOperation({ summary: 'Get product metrics' })
  async getProductMetrics(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetMetricsDto) {
    return this.analyticsService.getProductMetrics(tenantId, dto);
  }

  @Get('metrics/agents')
  @ApiOperation({ summary: 'Get agent metrics' })
  async getAgentMetrics(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetMetricsDto) {
    return this.analyticsService.getAgentMetrics(tenantId, dto);
  }

  @Get('metrics/channels')
  @ApiOperation({ summary: 'Get channel metrics' })
  async getChannelMetrics(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetMetricsDto) {
    return this.analyticsService.getChannelMetrics(tenantId, dto);
  }

  @Get('metrics/campaigns')
  @ApiOperation({ summary: 'Get campaign metrics' })
  async getCampaignMetrics(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetMetricsDto) {
    return this.analyticsService.getCampaignMetrics(tenantId, dto);
  }

  @Get('metrics/tenant')
  @ApiOperation({ summary: 'Get tenant metrics' })
  async getTenantMetrics(@Headers('x-tenant-id') tenantId: string, @Query() dto: GetMetricsDto) {
    return this.analyticsService.getTenantMetrics(tenantId, dto);
  }
}
