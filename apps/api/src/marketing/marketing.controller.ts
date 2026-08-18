import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MarketingService } from './marketing.service';
import { CreateSegmentDto, UpdateSegmentDto, CreateCampaignDto, UpdateCampaignDto } from './marketing.dto';

@ApiTags('Marketing')
@ApiBearerAuth('access-token')
@Controller('marketing')
export class MarketingController {
  constructor(private readonly marketingService: MarketingService) {}

  // ─── SEGMENTS ───────────────────────────────────────────────

  @Get('segments')
  @ApiOperation({ summary: 'List segments' })
  async findAllSegments(@Headers('x-tenant-id') tenantId: string, @Query() query: any) {
    return this.marketingService.findAllSegments(tenantId, query);
  }

  @Get('segments/:id')
  @ApiOperation({ summary: 'Get segment by ID' })
  async findOneSegment(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.marketingService.findOneSegment(tenantId, id);
  }

  @Post('segments')
  @ApiOperation({ summary: 'Create segment' })
  async createSegment(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateSegmentDto) {
    return this.marketingService.createSegment(tenantId, data);
  }

  @Put('segments/:id')
  @ApiOperation({ summary: 'Update segment' })
  async updateSegment(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateSegmentDto) {
    return this.marketingService.updateSegment(tenantId, id, data);
  }

  @Delete('segments/:id')
  @ApiOperation({ summary: 'Delete segment' })
  async removeSegment(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.marketingService.removeSegment(tenantId, id);
  }

  @Post('segments/:id/members')
  @ApiOperation({ summary: 'Add member to segment' })
  async addMember(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: { contactId: string }) {
    return this.marketingService.addMember(tenantId, id, data.contactId);
  }

  @Delete('segments/:id/members/:contactId')
  @ApiOperation({ summary: 'Remove member from segment' })
  async removeMember(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Param('contactId') contactId: string) {
    return this.marketingService.removeMember(tenantId, id, contactId);
  }

  // ─── CAMPAIGNS ──────────────────────────────────────────────

  @Get('campaigns')
  @ApiOperation({ summary: 'List campaigns' })
  async findAllCampaigns(@Headers('x-tenant-id') tenantId: string, @Query() query: any) {
    return this.marketingService.findAllCampaigns(tenantId, query);
  }

  @Get('campaigns/stats')
  @ApiOperation({ summary: 'Get campaign statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.marketingService.getStats(tenantId);
  }

  @Get('campaigns/:id')
  @ApiOperation({ summary: 'Get campaign by ID' })
  async findOneCampaign(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.marketingService.findOneCampaign(tenantId, id);
  }

  @Post('campaigns')
  @ApiOperation({ summary: 'Create campaign' })
  async createCampaign(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateCampaignDto) {
    return this.marketingService.createCampaign(tenantId, data);
  }

  @Put('campaigns/:id')
  @ApiOperation({ summary: 'Update campaign' })
  async updateCampaign(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateCampaignDto) {
    return this.marketingService.updateCampaign(tenantId, id, data);
  }

  @Post('campaigns/:id/start')
  @ApiOperation({ summary: 'Start campaign' })
  async startCampaign(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.marketingService.startCampaign(tenantId, id);
  }

  @Post('campaigns/:id/pause')
  @ApiOperation({ summary: 'Pause campaign' })
  async pauseCampaign(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.marketingService.pauseCampaign(tenantId, id);
  }

  @Post('campaigns/:id/complete')
  @ApiOperation({ summary: 'Complete campaign' })
  async completeCampaign(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.marketingService.completeCampaign(tenantId, id);
  }
}
