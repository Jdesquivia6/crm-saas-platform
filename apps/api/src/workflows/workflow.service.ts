import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import {
  CreateWorkflowDto,
  UpdateWorkflowDto,
  CreateWorkflowNodeDto,
  CreateWorkflowEdgeDto,
  PublishWorkflowDto,
  ExecuteWorkflowDto,
} from './dto';

@Injectable()
export class WorkflowService {
  private readonly logger = new Logger(WorkflowService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── WORKFLOWS ──────────────────────────────────────────────

  async findAll(tenantId: string) {
    return (this.prisma as any).workflow.findMany({
      where: { tenantId },
      include: {
        versions: { where: { isActive: true }, take: 1 },
        _count: { select: { runs: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    return (this.prisma as any).workflow.findFirst({
      where: { tenantId, id },
      include: {
        versions: {
          include: { nodes: true, edges: true },
          orderBy: { version: 'desc' },
          take: 1,
        },
        runs: { orderBy: { startedAt: 'desc' }, take: 10 },
      },
    });
  }

  async create(tenantId: string, dto: CreateWorkflowDto) {
    return (this.prisma as any).workflow.create({
      data: {
        tenantId,
        ...dto,
        versions: {
          create: {
            tenantId,
            version: 1,
            isActive: true,
          },
        },
      },
      include: { versions: true },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateWorkflowDto) {
    return (this.prisma as any).workflow.updateMany({
      where: { tenantId, id },
      data: dto,
    });
  }

  async delete(tenantId: string, id: string) {
    return (this.prisma as any).workflow.deleteMany({
      where: { tenantId, id },
    });
  }

  // ─── NODES ──────────────────────────────────────────────────

  async findNodes(tenantId: string, workflowId: string) {
    const version = await (this.prisma as any).workflowVersion.findFirst({
      where: { workflowId, isActive: true },
    });
    if (!version) return [];

    return (this.prisma as any).workflowNode.findMany({
      where: { tenantId, versionId: version.id },
    });
  }

  async createNode(tenantId: string, workflowId: string, dto: CreateWorkflowNodeDto) {
    let version = await (this.prisma as any).workflowVersion.findFirst({
      where: { workflowId, isActive: true },
    });

    if (!version) {
      version = await (this.prisma as any).workflowVersion.create({
        data: { tenantId, workflowId, version: 1, isActive: true },
      });
    }

    return (this.prisma as any).workflowNode.create({
      data: {
        tenantId,
        versionId: version.id,
        ...dto,
      },
    });
  }

  async deleteNode(tenantId: string, nodeId: string) {
    return (this.prisma as any).workflowNode.deleteMany({
      where: { tenantId, id: nodeId },
    });
  }

  // ─── EDGES ──────────────────────────────────────────────────

  async findEdges(tenantId: string, workflowId: string) {
    const version = await (this.prisma as any).workflowVersion.findFirst({
      where: { workflowId, isActive: true },
    });
    if (!version) return [];

    return (this.prisma as any).workflowEdge.findMany({
      where: { tenantId, versionId: version.id },
    });
  }

  async createEdge(tenantId: string, workflowId: string, dto: CreateWorkflowEdgeDto) {
    let version = await (this.prisma as any).workflowVersion.findFirst({
      where: { workflowId, isActive: true },
    });

    if (!version) {
      version = await (this.prisma as any).workflowVersion.create({
        data: { tenantId, workflowId, version: 1, isActive: true },
      });
    }

    return (this.prisma as any).workflowEdge.create({
      data: {
        tenantId,
        versionId: version.id,
        ...dto,
      },
    });
  }

  async deleteEdge(tenantId: string, edgeId: string) {
    return (this.prisma as any).workflowEdge.deleteMany({
      where: { tenantId, id: edgeId },
    });
  }

  // ─── PUBLISH ────────────────────────────────────────────────

  async publish(tenantId: string, workflowId: string, dto: PublishWorkflowDto) {
    const currentVersion = await (this.prisma as any).workflowVersion.findFirst({
      where: { workflowId, isActive: true },
    });

    if (currentVersion) {
      await (this.prisma as any).workflowVersion.update({
        where: { id: currentVersion.id },
        data: { isActive: false },
      });
    }

    const newVersionNumber = currentVersion ? currentVersion.version + 1 : 1;

    return (this.prisma as any).workflowVersion.create({
      data: {
        tenantId,
        workflowId,
        version: newVersionNumber,
        isActive: true,
        publishedAt: new Date(),
        metadata: dto.metadata,
      },
    });
  }

  // ─── EXECUTE ────────────────────────────────────────────────

  async execute(tenantId: string, workflowId: string, dto: ExecuteWorkflowDto) {
    const workflow = await (this.prisma as any).workflow.findFirst({
      where: { tenantId, id: workflowId, isActive: true },
      include: {
        versions: {
          where: { isActive: true },
          include: { nodes: true, edges: true },
          take: 1,
        },
      },
    });

    if (!workflow) {
      throw new Error('Workflow not found or inactive');
    }

    const version = workflow.versions[0];
    if (!version) {
      throw new Error('No active version found');
    }

    const run = await (this.prisma as any).workflowRun.create({
      data: {
        tenantId,
        workflowId,
        versionId: version.id,
        status: 'RUNNING',
        triggerData: dto.triggerData,
      },
    });

    const runNodes = await Promise.all(
      version.nodes.map((node: any) =>
        (this.prisma as any).workflowRunNode.create({
          data: {
            tenantId,
            runId: run.id,
            nodeId: node.id,
            status: 'PENDING',
          },
        })
      )
    );

    setTimeout(async () => {
      try {
        for (const runNode of runNodes) {
          await (this.prisma as any).workflowRunNode.update({
            where: { id: runNode.id },
            data: { status: 'COMPLETED', completedAt: new Date(), durationMs: 100 },
          });
        }

        await (this.prisma as any).workflowRun.update({
          where: { id: run.id },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
            durationMs: runNodes.length * 100,
            result: { nodesExecuted: runNodes.length },
          },
        });
      } catch (error) {
        await (this.prisma as any).workflowRun.update({
          where: { id: run.id },
          data: {
            status: 'FAILED',
            completedAt: new Date(),
            errorMessage: error.message,
          },
        });
      }
    }, 100);

    return { runId: run.id, status: 'RUNNING' };
  }

  // ─── RUNS ───────────────────────────────────────────────────

  async findRuns(tenantId: string, workflowId: string) {
    return (this.prisma as any).workflowRun.findMany({
      where: { tenantId, workflowId },
      include: { runNodes: true },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
  }

  async findOneRun(tenantId: string, runId: string) {
    return (this.prisma as any).workflowRun.findFirst({
      where: { tenantId, id: runId },
      include: {
        runNodes: { include: {} },
        workflow: true,
      },
    });
  }

  // ─── STATS ──────────────────────────────────────────────────

  async getStats(tenantId: string) {
    const [totalWorkflows, activeWorkflows, totalRuns, recentRuns] = await Promise.all([
      (this.prisma as any).workflow.count({ where: { tenantId } }),
      (this.prisma as any).workflow.count({ where: { tenantId, isActive: true } }),
      (this.prisma as any).workflowRun.count({ where: { tenantId } }),
      (this.prisma as any).workflowRun.findMany({
        where: { tenantId },
        orderBy: { startedAt: 'desc' },
        take: 10,
        include: { workflow: true },
      }),
    ]);

    return { totalWorkflows, activeWorkflows, totalRuns, recentRuns };
  }
}
