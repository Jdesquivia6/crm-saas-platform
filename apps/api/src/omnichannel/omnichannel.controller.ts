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
import { OmnichannelService } from './omnichannel.service';
import {
  CreateChannelAccountDto,
  UpdateChannelAccountDto,
  CreateConversationDto,
  UpdateConversationDto,
  SendMessageDto,
  CreateCannedResponseDto,
  UpdateCannedResponseDto,
  SearchConversationsDto,
} from './dto/omnichannel.dto';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';

@ApiTags('omnichannel')
@ApiBearerAuth('access-token')
@Controller('omnichannel')
export class OmnichannelController {
  constructor(private readonly omnichannelService: OmnichannelService) {}

  // ─── CHANNEL ACCOUNTS ───────────────────────────────

  @Post('channel-accounts')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Create channel account' })
  createChannelAccount(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateChannelAccountDto,
  ) {
    return this.omnichannelService.createChannelAccount(tenantId, dto);
  }

  @Get('channel-accounts')
  @RequirePermissions('admin.settings.view')
  @ApiOperation({ summary: 'List channel accounts' })
  findChannelAccounts(@Query('tenantId') tenantId: string) {
    return this.omnichannelService.findChannelAccounts(tenantId);
  }

  @Get('channel-accounts/:id')
  @RequirePermissions('admin.settings.view')
  @ApiOperation({ summary: 'Get channel account by ID' })
  findChannelAccount(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.omnichannelService.findChannelAccountById(tenantId, id);
  }

  @Patch('channel-accounts/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Update channel account' })
  updateChannelAccount(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChannelAccountDto,
  ) {
    return this.omnichannelService.updateChannelAccount(tenantId, id, dto);
  }

  @Delete('channel-accounts/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Delete channel account' })
  deleteChannelAccount(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.omnichannelService.deleteChannelAccount(tenantId, id);
  }

  // ─── CONVERSATIONS ──────────────────────────────────

  @Post('conversations')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Create conversation' })
  createConversation(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateConversationDto,
  ) {
    return this.omnichannelService.createConversation(tenantId, dto);
  }

  @Get('conversations')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List conversations' })
  findConversations(
    @Query('tenantId') tenantId: string,
    @Query() params: SearchConversationsDto,
  ) {
    return this.omnichannelService.findConversations(tenantId, params);
  }

  @Get('conversations/:id')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get conversation by ID' })
  findConversation(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.omnichannelService.findConversationById(tenantId, id);
  }

  @Patch('conversations/:id')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Update conversation' })
  updateConversation(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateConversationDto,
  ) {
    return this.omnichannelService.updateConversation(tenantId, id, dto);
  }

  @Patch('conversations/:id/close')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Close conversation' })
  closeConversation(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.omnichannelService.closeConversation(tenantId, id);
  }

  // ─── MESSAGES ───────────────────────────────────────

  @Post('conversations/:conversationId/messages')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Send message' })
  sendMessage(
    @Query('tenantId') tenantId: string,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.omnichannelService.sendMessage(tenantId, conversationId, dto);
  }

  @Get('conversations/:conversationId/messages')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List messages' })
  findMessages(
    @Query('tenantId') tenantId: string,
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.omnichannelService.findMessages(tenantId, conversationId, {
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  // ─── CONVERSATION ASSIGNMENTS ───────────────────────

  @Post('conversations/:conversationId/assignments/:userId')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Assign conversation' })
  assignConversation(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.omnichannelService.assignConversation('', conversationId, userId);
  }

  @Delete('conversations/:conversationId/assignments/:userId')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Unassign conversation' })
  unassignConversation(
    @Param('conversationId', ParseUUIDPipe) conversationId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.omnichannelService.unassignConversation(conversationId, userId);
  }

  // ─── CANNED RESPONSES ───────────────────────────────

  @Post('canned-responses')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Create canned response' })
  createCannedResponse(
    @Query('tenantId') tenantId: string,
    @Body() dto: CreateCannedResponseDto,
  ) {
    return this.omnichannelService.createCannedResponse(tenantId, dto);
  }

  @Get('canned-responses')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List canned responses' })
  findCannedResponses(
    @Query('tenantId') tenantId: string,
    @Query('category') category?: string,
  ) {
    return this.omnichannelService.findCannedResponses(tenantId, category);
  }

  @Patch('canned-responses/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Update canned response' })
  updateCannedResponse(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCannedResponseDto,
  ) {
    return this.omnichannelService.updateCannedResponse(tenantId, id, dto);
  }

  @Delete('canned-responses/:id')
  @RequirePermissions('admin.settings.manage')
  @ApiOperation({ summary: 'Delete canned response' })
  deleteCannedResponse(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.omnichannelService.deleteCannedResponse(tenantId, id);
  }

  // ─── STATS ──────────────────────────────────────────

  @Get('stats')
  @RequirePermissions('analytics.dashboard.view')
  @ApiOperation({ summary: 'Get omnichannel stats' })
  getStats(@Query('tenantId') tenantId: string) {
    return this.omnichannelService.getOmnichannelStats(tenantId);
  }
}
