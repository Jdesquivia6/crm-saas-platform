import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PipelinesService } from './pipelines.service';
import { CreatePipelineDto, CreatePipelineStageDto, UpdatePipelineDto, UpdatePipelineStageDto } from './pipelines.dto';

@ApiTags('Pipelines')
@ApiBearerAuth('access-token')
@Controller('pipelines')
export class PipelinesController {
  constructor(private readonly pipelinesService: PipelinesService) {}

  @Get()
  @ApiOperation({ summary: 'List pipelines' })
  async findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.pipelinesService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pipeline by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.pipelinesService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create pipeline' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreatePipelineDto) {
    return this.pipelinesService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update pipeline' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdatePipelineDto) {
    return this.pipelinesService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete pipeline' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.pipelinesService.remove(tenantId, id);
  }

  @Post(':id/stages')
  @ApiOperation({ summary: 'Add stage to pipeline' })
  async addStage(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: CreatePipelineStageDto,
  ) {
    return this.pipelinesService.addStage(tenantId, id, data);
  }

  @Put('stages/:stageId')
  @ApiOperation({ summary: 'Update pipeline stage' })
  async updateStage(
    @Headers('x-tenant-id') tenantId: string,
    @Param('stageId') stageId: string,
    @Body() data: UpdatePipelineStageDto,
  ) {
    return this.pipelinesService.updateStage(tenantId, stageId, data);
  }

  @Delete('stages/:stageId')
  @ApiOperation({ summary: 'Delete pipeline stage' })
  async removeStage(@Headers('x-tenant-id') tenantId: string, @Param('stageId') stageId: string) {
    return this.pipelinesService.removeStage(tenantId, stageId);
  }
}
