import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import {
  CreateModelConfigDto,
  UpdateModelConfigDto,
  CreatePromptDto,
  CreateKnowledgeBaseDto,
  CreateKnowledgeDocumentDto,
  ChatRequestDto,
} from './dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── MODEL CONFIGS ──────────────────────────────────────────

  async findAllModelConfigs(tenantId: string) {
    return (this.prisma as any).modelConfig.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneModelConfig(tenantId: string, id: string) {
    return (this.prisma as any).modelConfig.findFirst({
      where: { tenantId, id },
    });
  }

  async createModelConfig(tenantId: string, dto: CreateModelConfigDto) {
    return (this.prisma as any).modelConfig.create({
      data: {
        tenantId,
        ...dto,
      },
    });
  }

  async updateModelConfig(tenantId: string, id: string, dto: UpdateModelConfigDto) {
    return (this.prisma as any).modelConfig.updateMany({
      where: { tenantId, id },
      data: dto,
    });
  }

  async deleteModelConfig(tenantId: string, id: string) {
    return (this.prisma as any).modelConfig.deleteMany({
      where: { tenantId, id },
    });
  }

  // ─── PROMPTS ────────────────────────────────────────────────

  async findAllPrompts(tenantId: string, query?: { category?: string }) {
    const where: any = { tenantId };
    if (query?.category) where.category = query.category;
    return (this.prisma as any).prompt.findMany({
      where,
      include: { modelConfig: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOnePrompt(tenantId: string, id: string) {
    return (this.prisma as any).prompt.findFirst({
      where: { tenantId, id },
      include: { modelConfig: true },
    });
  }

  async createPrompt(tenantId: string, dto: CreatePromptDto) {
    return (this.prisma as any).prompt.create({
      data: {
        tenantId,
        ...dto,
      },
    });
  }

  async deletePrompt(tenantId: string, id: string) {
    return (this.prisma as any).prompt.deleteMany({
      where: { tenantId, id },
    });
  }

  // ─── KNOWLEDGE BASES ────────────────────────────────────────

  async findAllKnowledgeBases(tenantId: string) {
    return (this.prisma as any).knowledgeBase.findMany({
      where: { tenantId },
      include: { _count: { select: { documents: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneKnowledgeBase(tenantId: string, id: string) {
    return (this.prisma as any).knowledgeBase.findFirst({
      where: { tenantId, id },
      include: { documents: true },
    });
  }

  async createKnowledgeBase(tenantId: string, dto: CreateKnowledgeBaseDto) {
    return (this.prisma as any).knowledgeBase.create({
      data: {
        tenantId,
        ...dto,
      },
    });
  }

  async deleteKnowledgeBase(tenantId: string, id: string) {
    return (this.prisma as any).knowledgeBase.deleteMany({
      where: { tenantId, id },
    });
  }

  // ─── KNOWLEDGE DOCUMENTS ────────────────────────────────────

  async findAllKnowledgeDocuments(tenantId: string, knowledgeBaseId?: string) {
    const where: any = { tenantId };
    if (knowledgeBaseId) where.knowledgeBaseId = knowledgeBaseId;
    return (this.prisma as any).knowledgeDocument.findMany({
      where,
      include: { knowledgeBase: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async searchKnowledgeDocuments(tenantId: string, query: string) {
    return (this.prisma as any).knowledgeDocument.findMany({
      where: {
        tenantId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { knowledgeBase: true },
      take: 10,
    });
  }

  async createKnowledgeDocument(tenantId: string, dto: CreateKnowledgeDocumentDto) {
    return (this.prisma as any).knowledgeDocument.create({
      data: {
        tenantId,
        ...dto,
      },
    });
  }

  async deleteKnowledgeDocument(tenantId: string, id: string) {
    return (this.prisma as any).knowledgeDocument.deleteMany({
      where: { tenantId, id },
    });
  }

  // ─── CHAT / COMPLETION ──────────────────────────────────────

  async chat(tenantId: string, dto: ChatRequestDto) {
    let modelConfig;
    if (dto.modelConfigId) {
      modelConfig = await this.findOneModelConfig(tenantId, dto.modelConfigId);
    } else {
      const configs = await (this.prisma as any).modelConfig.findMany({
        where: { tenantId, isActive: true },
        take: 1,
      });
      modelConfig = configs[0];
    }

    if (!modelConfig) {
      throw new Error('No active model configuration found');
    }

    let systemPrompt = modelConfig.systemPrompt || '';
    if (dto.promptSlug) {
      const prompt = await (this.prisma as any).prompt.findFirst({
        where: { tenantId, slug: dto.promptSlug, isActive: true },
      });
      if (prompt) {
        systemPrompt = prompt.template;
      }
    }

    if (dto.entityType && dto.entityId) {
      const contextDocs = await this.searchKnowledgeDocuments(tenantId, dto.message);
      if (contextDocs.length > 0) {
        systemPrompt += '\n\nContexto relevante:\n' + contextDocs.map((d: any) => `- ${d.title}: ${d.content.substring(0, 200)}`).join('\n');
      }
    }

    const startTime = Date.now();
    const request = await (this.prisma as any).aiRequest.create({
      data: {
        tenantId,
        modelConfigId: modelConfig.id,
        entityType: dto.entityType,
        entityId: dto.entityId,
        input: { message: dto.message, context: dto.context },
        status: 'RUNNING',
      },
    });

    try {
      const output = {
        response: `[Simulado] Respuesta generada por ${modelConfig.provider}/${modelConfig.model} para: "${dto.message}"`,
        model: modelConfig.model,
        provider: modelConfig.provider,
        timestamp: new Date().toISOString(),
      };

      const durationMs = Date.now() - startTime;
      const tokensInput = Math.ceil(dto.message.length / 4);
      const tokensOutput = Math.ceil(JSON.stringify(output).length / 4);

      await (this.prisma as any).aiRequest.update({
        where: { id: request.id },
        data: {
          output,
          status: 'COMPLETED',
          tokensInput,
          tokensOutput,
          durationMs,
          cost: 0,
        },
      });

      await this.updateUsage(tenantId, modelConfig.id, tokensInput + tokensOutput, durationMs, false);

      return {
        requestId: request.id,
        response: output.response,
        model: modelConfig.model,
        provider: modelConfig.provider,
        tokens: { input: tokensInput, output: tokensOutput },
        durationMs,
      };
    } catch (error) {
      await (this.prisma as any).aiRequest.update({
        where: { id: request.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          durationMs: Date.now() - startTime,
        },
      });

      await this.updateUsage(tenantId, modelConfig.id, 0, Date.now() - startTime, true);

      throw error;
    }
  }

  private async updateUsage(tenantId: string, modelConfigId: string, tokens: number, durationMs: number, failed: boolean) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await (this.prisma as any).aiUsage.findFirst({
      where: { tenantId, modelConfigId, date: today },
    });

    if (existing) {
      await (this.prisma as any).aiUsage.update({
        where: { id: existing.id },
        data: {
          totalRequests: { increment: 1 },
          totalTokens: { increment: tokens },
          avgDurationMs: Math.round((existing.avgDurationMs * existing.totalRequests + durationMs) / (existing.totalRequests + 1)),
          failedRequests: failed ? { increment: 1 } : undefined,
        },
      });
    } else {
      await (this.prisma as any).aiUsage.create({
        data: {
          tenantId,
          modelConfigId,
          date: today,
          totalRequests: 1,
          totalTokens: tokens,
          avgDurationMs: durationMs,
          failedRequests: failed ? 1 : 0,
        },
      });
    }
  }

  // ─── INSIGHTS & RECOMMENDATIONS ─────────────────────────────

  async findAllInsights(tenantId: string) {
    return (this.prisma as any).aiInsight.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findAllRecommendations(tenantId: string) {
    return (this.prisma as any).aiRecommendation.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  // ─── USAGE & STATS ──────────────────────────────────────────

  async getUsage(tenantId: string) {
    return (this.prisma as any).aiUsage.findMany({
      where: { tenantId },
      include: { modelConfig: true },
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  async getStats(tenantId: string) {
    const [totalRequests, totalTokens, recentRequests] = await Promise.all([
      (this.prisma as any).aiRequest.aggregate({
        where: { tenantId },
        _count: true,
        _sum: { tokensInput: true, tokensOutput: true },
      }),
      (this.prisma as  any).aiRequest.aggregate({
        where: { tenantId },
        _sum: { tokensInput: true, tokensOutput: true },
      }),
      (this.prisma as any).aiRequest.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { modelConfig: true },
      }),
    ]);

    return {
      totalRequests: totalRequests._count,
      totalTokens: (totalRequests._sum.tokensInput || 0) + (totalRequests._sum.tokensOutput || 0),
      recentRequests,
    };
  }
}
