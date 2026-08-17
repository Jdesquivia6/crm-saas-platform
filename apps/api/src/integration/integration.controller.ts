import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IntegrationService } from './integration.service';
import {
  CreateConnectionDto,
  UpdateConnectionDto,
  CreateTemplateDto,
  UpdateTemplateDto,
  SendWhatsAppMessageDto,
  ProcessWebhookDto,
} from './dto/integration.dto';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';

@ApiTags('integration')
@ApiBearerAuth('access-token')
@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  // ─── CONNECTIONS ────────────────────────────────────

  @Post('connections')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Create integration connection' })
  createConnection(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateConnectionDto,
  ) {
    return this.integrationService.createConnection(tenantId, dto);
  }

  @Get('connections')
  @RequirePermissions('admin.settings.view')
  @ApiOperation({ summary: 'List integration connections' })
  findConnections(@Query('tenantId') tenantId: string) {
    return this.integrationService.findConnections(tenantId);
  }

  @Get('connections/:id')
  @RequirePermissions('admin.settings.view')
  @ApiOperation({ summary: 'Get connection by ID' })
  findConnection(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.integrationService.findConnectionById(tenantId, id);
  }

  @Patch('connections/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Update connection' })
  updateConnection(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateConnectionDto,
  ) {
    return this.integrationService.updateConnection(tenantId, id, dto);
  }

  @Delete('connections/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Delete connection' })
  deleteConnection(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.integrationService.deleteConnection(tenantId, id);
  }

  // ─── WEBHOOKS ───────────────────────────────────────

  @Post('webhooks/inbound')
  @ApiOperation({ summary: 'Process inbound webhook (no auth - called by providers)' })
  processInboundWebhook(@Body() dto: ProcessWebhookDto) {
    return this.integrationService.processInboundWebhook('default', dto);
  }

  @Post('outbox/process')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Process outbound queue' })
  processOutbound(@Query('tenantId') tenantId: string) {
    return this.integrationService.processOutboundQueue(tenantId);
  }

  // ─── TEMPLATES ──────────────────────────────────────

  @Post('templates')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Create message template' })
  createTemplate(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateTemplateDto,
  ) {
    return this.integrationService.createTemplate(tenantId, dto);
  }

  @Get('templates')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List message templates' })
  findTemplates(
    @Query('tenantId') tenantId: string,
    @Query('category') category?: string,
  ) {
    return this.integrationService.findTemplates(tenantId, category);
  }

  @Get('templates/:id')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get template by ID' })
  findTemplate(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.integrationService.findTemplateById(tenantId, id);
  }

  @Patch('templates/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Update template' })
  updateTemplate(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.integrationService.updateTemplate(tenantId, id, dto);
  }

  @Delete('templates/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Delete template' })
  deleteTemplate(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.integrationService.deleteTemplate(tenantId, id);
  }

  // ─── WHATSAPP ───────────────────────────────────────

  @Post('whatsapp/send')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Send WhatsApp message' })
  sendWhatsApp(
    @Query('tenantId') tenantId: string,
    @Body() dto: SendWhatsAppMessageDto,
  ) {
    return this.integrationService.sendWhatsAppMessage(tenantId, dto);
  }

  // ─── SYNC JOBS ──────────────────────────────────────

  @Post('sync-jobs')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Create sync job' })
  createSyncJob(
    @Query('tenantId') tenantId: string,
    @Body('channelType') channelType: string,
    @Body('connectionId') connectionId?: string,
    @Body('syncType') syncType?: string,
  ) {
    return this.integrationService.createSyncJob(tenantId, channelType, connectionId, syncType);
  }

  @Get('sync-jobs')
  @RequirePermissions('admin.settings.view')
  @ApiOperation({ summary: 'List sync jobs' })
  findSyncJobs(
    @Query('tenantId') tenantId: string,
    @Query('channelType') channelType?: string,
  ) {
    return this.integrationService.findSyncJobs(tenantId, channelType);
  }

  @Get('sync-jobs/:id')
  @RequirePermissions('admin.settings.view')
  @ApiOperation({ summary: 'Get sync job by ID' })
  findSyncJob(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.integrationService.findSyncJobById(tenantId, id);
  }

  @Patch('sync-jobs/:id/start')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Start sync job' })
  startSyncJob(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.integrationService.startSyncJob(tenantId, id);
  }

  @Patch('sync-jobs/:id/complete')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Complete sync job' })
  completeSyncJob(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('processedCount') processedCount: number,
    @Body('errorCount') errorCount?: number,
  ) {
    return this.integrationService.completeSyncJob(tenantId, id, processedCount, errorCount);
  }

  // ─── CHANNEL WEBHOOKS ───────────────────────────────

  @Post('webhooks/instagram')
  @ApiOperation({ summary: 'Process Instagram webhook' })
  processInstagramWebhook(@Body() payload: any) {
    return this.integrationService.processChannelInbound('default', 'INSTAGRAM', payload);
  }

  @Post('webhooks/facebook')
  @ApiOperation({ summary: 'Process Facebook Messenger webhook' })
  processFacebookWebhook(@Body() payload: any) {
    return this.integrationService.processChannelInbound('default', 'FACEBOOK', payload);
  }

  @Post('webhooks/email')
  @ApiOperation({ summary: 'Process Email webhook' })
  processEmailWebhook(@Body() payload: any) {
    return this.integrationService.processChannelInbound('default', 'EMAIL', payload);
  }

  // ─── STATS ──────────────────────────────────────────

  @Get('stats')
  @RequirePermissions('analytics.dashboard.view')
  @ApiOperation({ summary: 'Get integration stats' })
  getStats(@Query('tenantId') tenantId: string) {
    return this.integrationService.getIntegrationStats(tenantId);
  }
}
