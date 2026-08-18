import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import {
  CreateWorkflowDto,
  UpdateWorkflowDto,
  CreateWorkflowNodeDto,
  CreateWorkflowEdgeDto,
  PublishWorkflowDto,
  ExecuteWorkflowDto,
} from './dto';

@ApiTags('Workflows')
@ApiBearerAuth('access-token')
@Controller('workflows')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  // ─── WORKFLOWS ──────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'List workflows' })
  async findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.workflowService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workflow by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.workflowService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create workflow' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateWorkflowDto) {
    return this.workflowService.create(tenantId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update workflow' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() dto: UpdateWorkflowDto) {
    return this.workflowService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workflow' })
  async delete(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.workflowService.delete(tenantId, id);
  }

  // ─── NODES ──────────────────────────────────────────────────

  @Get(':id/nodes')
  @ApiOperation({ summary: 'List workflow nodes' })
  async findNodes(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.workflowService.findNodes(tenantId, id);
  }

  @Post(':id/nodes')
  @ApiOperation({ summary: 'Create workflow node' })
  async createNode(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CreateWorkflowNodeDto,
  ) {
    return this.workflowService.createNode(tenantId, id, dto);
  }

  @Delete(':id/nodes/:nodeId')
  @ApiOperation({ summary: 'Delete workflow node' })
  async deleteNode(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Param('nodeId') nodeId: string,
  ) {
    return this.workflowService.deleteNode(tenantId, nodeId);
  }

  // ─── EDGES ──────────────────────────────────────────────────

  @Get(':id/edges')
  @ApiOperation({ summary: 'List workflow edges' })
  async findEdges(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.workflowService.findEdges(tenantId, id);
  }

  @Post(':id/edges')
  @ApiOperation({ summary: 'Create workflow edge' })
  async createEdge(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: CreateWorkflowEdgeDto,
  ) {
    return this.workflowService.createEdge(tenantId, id, dto);
  }

  @Delete(':id/edges/:edgeId')
  @ApiOperation({ summary: 'Delete workflow edge' })
  async deleteEdge(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Param('edgeId') edgeId: string,
  ) {
    return this.workflowService.deleteEdge(tenantId, edgeId);
  }

  // ─── PUBLISH & EXECUTE ──────────────────────────────────────

  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish workflow' })
  async publish(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: PublishWorkflowDto,
  ) {
    return this.workflowService.publish(tenantId, id, dto);
  }

  @Post(':id/execute')
  @ApiOperation({ summary: 'Execute workflow' })
  async execute(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: ExecuteWorkflowDto,
  ) {
    return this.workflowService.execute(tenantId, id, dto);
  }

  // ─── RUNS ───────────────────────────────────────────────────

  @Get(':id/runs')
  @ApiOperation({ summary: 'List workflow runs' })
  async findRuns(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.workflowService.findRuns(tenantId, id);
  }

  @Get('runs/:runId')
  @ApiOperation({ summary: 'Get workflow run' })
  async findOneRun(@Headers('x-tenant-id') tenantId: string, @Param('runId') runId: string) {
    return this.workflowService.findOneRun(tenantId, runId);
  }

  // ─── STATS ──────────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get workflow stats' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.workflowService.getStats(tenantId);
  }
}
