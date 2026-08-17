import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto, LeadQueryDto } from './leads.dto';

@ApiTags('Leads')
@ApiBearerAuth('access-token')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  @ApiOperation({ summary: 'List leads' })
  async findAll(@Headers('x-tenant-id') tenantId: string, @Query() query: LeadQueryDto) {
    return this.leadsService.findAll(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get lead statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.leadsService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.leadsService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create lead' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateLeadDto) {
    return this.leadsService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lead' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateLeadDto) {
    return this.leadsService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.leadsService.remove(tenantId, id);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Convert lead to opportunity' })
  async convert(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() body: { pipelineId: string; stageId: string },
  ) {
    return this.leadsService.convertToOpportunity(tenantId, id, body.pipelineId, body.stageId);
  }
}
