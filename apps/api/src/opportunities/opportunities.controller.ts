import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto, UpdateOpportunityDto, OpportunityQueryDto } from './opportunities.dto';

@ApiTags('Opportunities')
@ApiBearerAuth('access-token')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'List opportunities' })
  async findAll(@Headers('x-tenant-id') tenantId: string, @Query() query: OpportunityQueryDto) {
    return this.opportunitiesService.findAll(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get opportunity statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string, @Query('pipelineId') pipelineId?: string) {
    return this.opportunitiesService.getStats(tenantId, pipelineId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.opportunitiesService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create opportunity' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateOpportunityDto) {
    return this.opportunitiesService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update opportunity' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateOpportunityDto) {
    return this.opportunitiesService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete opportunity' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.opportunitiesService.remove(tenantId, id);
  }
}
