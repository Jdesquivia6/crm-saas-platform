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
import { Client360Service } from './client360.service';
import {
  CreateCustomFieldDto,
  UpdateCustomFieldDto,
  SetCustomFieldValueDto,
  CreateActivityDto,
  UpdateActivityDto,
  CreateConsentDto,
  GetTimelineDto,
} from './dto/client360.dto';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';

@ApiTags('client360')
@ApiBearerAuth('access-token')
@Controller('client360')
export class Client360Controller {
  constructor(private readonly client360Service: Client360Service) {}

  // ─── TIMELINE ───────────────────────────────────────

  @Get('contacts/:contactId/timeline')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get contact timeline' })
  getTimeline(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Query() params: GetTimelineDto,
  ) {
    return this.client360Service.getTimeline(tenantId, contactId, params);
  }

  // ─── CONTACT SUMMARY ────────────────────────────────

  @Get('contacts/:contactId/summary')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get contact 360° summary' })
  getContactSummary(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    return this.client360Service.getContactSummary(tenantId, contactId);
  }

  // ─── CUSTOM FIELDS ──────────────────────────────────

  @Post('custom-fields')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Create custom field' })
  createCustomField(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateCustomFieldDto,
  ) {
    return this.client360Service.createCustomField(tenantId, dto);
  }

  @Get('custom-fields')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List custom fields' })
  findCustomFields(
    @Query('tenantId') tenantId: string,
    @Query('entityType') entityType?: string,
  ) {
    return this.client360Service.findCustomFields(tenantId, entityType);
  }

  @Get('custom-fields/:id')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get custom field by ID' })
  findCustomField(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.client360Service.findCustomFieldById(tenantId, id);
  }

  @Patch('custom-fields/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Update custom field' })
  updateCustomField(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomFieldDto,
  ) {
    return this.client360Service.updateCustomField(tenantId, id, dto);
  }

  @Delete('custom-fields/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Delete custom field' })
  deleteCustomField(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.client360Service.deleteCustomField(tenantId, id);
  }

  // ─── CUSTOM FIELD VALUES ────────────────────────────

  @Post('contacts/:contactId/custom-values')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Set custom field value for contact' })
  setCustomFieldValue(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: SetCustomFieldValueDto,
  ) {
    return this.client360Service.setCustomFieldValue(tenantId, contactId, dto);
  }

  @Get('contacts/:contactId/custom-values')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get custom field values for contact' })
  getCustomFieldValues(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    return this.client360Service.getCustomFieldValues(tenantId, contactId);
  }

  @Delete('custom-values/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Delete custom field value' })
  deleteCustomFieldValue(@Param('id', ParseUUIDPipe) id: string) {
    return this.client360Service.deleteCustomFieldValue(id);
  }

  // ─── ACTIVITIES ─────────────────────────────────────

  @Post('activities')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Create activity' })
  createActivity(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateActivityDto,
  ) {
    return this.client360Service.createActivity(tenantId, undefined, dto);
  }

  @Get('activities')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List activities' })
  findActivities(
    @Query('tenantId') tenantId: string,
    @Query('contactId') contactId?: string,
    @Query('status') status?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.client360Service.findActivities(tenantId, {
      contactId,
      status,
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('activities/:id')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get activity by ID' })
  findActivity(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.client360Service.findActivityById(tenantId, id);
  }

  @Patch('activities/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Update activity' })
  updateActivity(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.client360Service.updateActivity(tenantId, id, dto);
  }

  @Patch('activities/:id/complete')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Mark activity as completed' })
  completeActivity(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.client360Service.completeActivity(tenantId, id);
  }

  @Delete('activities/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Delete activity' })
  deleteActivity(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.client360Service.deleteActivity(tenantId, id);
  }

  // ─── CONSENTS ───────────────────────────────────────

  @Post('contacts/:contactId/consents')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Upsert consent for contact' })
  upsertConsent(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: CreateConsentDto,
  ) {
    return this.client360Service.upsertConsent(tenantId, contactId, dto);
  }

  @Get('contacts/:contactId/consents')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List consents for contact' })
  findConsents(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    return this.client360Service.findConsents(tenantId, contactId);
  }

  @Delete('contacts/:contactId/consents/:channel')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Delete consent' })
  deleteConsent(
    @Query('tenantId') tenantId: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Param('channel') channel: string,
  ) {
    return this.client360Service.deleteConsent(tenantId, contactId, channel);
  }
}
