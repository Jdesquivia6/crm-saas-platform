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
import { TicketingService } from './ticketing.service';
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
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';

@ApiTags('ticketing')
@ApiBearerAuth('access-token')
@Controller('ticketing')
export class TicketingController {
  constructor(private readonly ticketingService: TicketingService) {}

  // ─── CATEGORIES ─────────────────────────────────────

  @Post('categories')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Create ticket category' })
  createCategory(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateTicketCategoryDto,
  ) {
    return this.ticketingService.createCategory(tenantId, dto);
  }

  @Get('categories')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List ticket categories' })
  findCategories(@Query('tenantId') tenantId: string) {
    return this.ticketingService.findCategories(tenantId);
  }

  @Patch('categories/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Update category' })
  updateCategory(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTicketCategoryDto,
  ) {
    return this.ticketingService.updateCategory(tenantId, id, dto);
  }

  @Delete('categories/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Delete category' })
  deleteCategory(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ticketingService.deleteCategory(tenantId, id);
  }

  // ─── SLA POLICIES ───────────────────────────────────

  @Post('sla-policies')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Create SLA policy' })
  createSlaPolicy(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateSlaPolicyDto,
  ) {
    return this.ticketingService.createSlaPolicy(tenantId, dto);
  }

  @Get('sla-policies')
  @RequirePermissions('admin.settings.view')
  @ApiOperation({ summary: 'List SLA policies' })
  findSlaPolicies(@Query('tenantId') tenantId: string) {
    return this.ticketingService.findSlaPolicies(tenantId);
  }

  // ─── TICKETS ────────────────────────────────────────

  @Post('tickets')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Create ticket' })
  createTicket(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateTicketDto,
  ) {
    return this.ticketingService.createTicket(tenantId, dto);
  }

  @Get('tickets')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List tickets' })
  findTickets(
    @Query('tenantId') tenantId: string,
    @Query() params: SearchTicketsDto,
  ) {
    return this.ticketingService.findTickets(tenantId, params);
  }

  @Get('tickets/:id')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get ticket by ID' })
  findTicket(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ticketingService.findTicketById(tenantId, id);
  }

  @Patch('tickets/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Update ticket' })
  updateTicket(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTicketDto,
  ) {
    return this.ticketingService.updateTicket(tenantId, id, dto);
  }

  // ─── TICKET COMMENTS ────────────────────────────────

  @Post('tickets/:ticketId/comments')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Add comment to ticket' })
  addComment(
    @Query('tenantId') tenantId: string,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @Body() dto: CreateTicketCommentDto,
  ) {
    return this.ticketingService.addComment(tenantId, ticketId, undefined, dto);
  }

  @Get('tickets/:ticketId/comments')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List comments' })
  findComments(
    @Query('tenantId') tenantId: string,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
  ) {
    return this.ticketingService.findComments(tenantId, ticketId);
  }

  @Delete('comments/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Delete comment' })
  deleteComment(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ticketingService.deleteComment('', id);
  }

  // ─── TICKET ASSIGNMENTS ─────────────────────────────

  @Post('tickets/:ticketId/assignments')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Assign ticket' })
  assignTicket(
    @Query('tenantId') tenantId: string,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @Body() dto: AssignTicketDto,
  ) {
    return this.ticketingService.assignTicket(tenantId, ticketId, dto);
  }

  @Delete('tickets/:ticketId/assignments/:userId')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Unassign ticket' })
  unassignTicket(
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.ticketingService.unassignTicket(ticketId, userId);
  }

  // ─── SATISFACTION SURVEYS ───────────────────────────

  @Post('tickets/:ticketId/survey')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Create satisfaction survey' })
  createSurvey(
    @Query('tenantId') tenantId: string,
    @Param('ticketId', ParseUUIDPipe) ticketId: string,
    @Body() dto: CreateSatisfactionSurveyDto,
  ) {
    return this.ticketingService.createSatisfactionSurvey(tenantId, ticketId, dto);
  }

  @Get('surveys')
  @RequirePermissions('analytics.dashboard.view')
  @ApiOperation({ summary: 'List satisfaction surveys' })
  findSurveys(@Query('tenantId') tenantId: string) {
    return this.ticketingService.findSurveys(tenantId);
  }

  // ─── STATS ──────────────────────────────────────────

  @Get('stats')
  @RequirePermissions('analytics.dashboard.view')
  @ApiOperation({ summary: 'Get ticket stats' })
  getStats(@Query('tenantId') tenantId: string) {
    return this.ticketingService.getTicketStats(tenantId);
  }
}
