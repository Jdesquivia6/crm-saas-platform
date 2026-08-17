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

  // ─── STATS ──────────────────────────────────────────

  @Get('stats')
  @RequirePermissions('analytics.dashboard.view')
  @ApiOperation({ summary: 'Get integration stats' })
  getStats(@Query('tenantId') tenantId: string) {
    return this.integrationService.getIntegrationStats(tenantId);
  }
}
