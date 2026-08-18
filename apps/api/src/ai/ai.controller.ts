import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import {
  CreateModelConfigDto,
  UpdateModelConfigDto,
  CreatePromptDto,
  CreateKnowledgeBaseDto,
  CreateKnowledgeDocumentDto,
  ChatRequestDto,
} from './dto';

@ApiTags('AI')
@ApiBearerAuth('access-token')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  // ─── MODEL CONFIGS ──────────────────────────────────────────

  @Get('configs')
  @ApiOperation({ summary: 'List model configurations' })
  async findAllModelConfigs(@Headers('x-tenant-id') tenantId: string) {
    return this.aiService.findAllModelConfigs(tenantId);
  }

  @Get('configs/:id')
  @ApiOperation({ summary: 'Get model configuration' })
  async findOneModelConfig(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.aiService.findOneModelConfig(tenantId, id);
  }

  @Post('configs')
  @ApiOperation({ summary: 'Create model configuration' })
  async createModelConfig(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateModelConfigDto) {
    return this.aiService.createModelConfig(tenantId, dto);
  }

  @Put('configs/:id')
  @ApiOperation({ summary: 'Update model configuration' })
  async updateModelConfig(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateModelConfigDto,
  ) {
    return this.aiService.updateModelConfig(tenantId, id, dto);
  }

  @Delete('configs/:id')
  @ApiOperation({ summary: 'Delete model configuration' })
  async deleteModelConfig(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.aiService.deleteModelConfig(tenantId, id);
  }

  // ─── PROMPTS ────────────────────────────────────────────────

  @Get('prompts')
  @ApiOperation({ summary: 'List prompts' })
  async findAllPrompts(@Headers('x-tenant-id') tenantId: string, @Query('category') category?: string) {
    return this.aiService.findAllPrompts(tenantId, { category });
  }

  @Get('prompts/:id')
  @ApiOperation({ summary: 'Get prompt' })
  async findOnePrompt(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.aiService.findOnePrompt(tenantId, id);
  }

  @Post('prompts')
  @ApiOperation({ summary: 'Create prompt' })
  async createPrompt(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreatePromptDto) {
    return this.aiService.createPrompt(tenantId, dto);
  }

  @Delete('prompts/:id')
  @ApiOperation({ summary: 'Delete prompt' })
  async deletePrompt(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.aiService.deletePrompt(tenantId, id);
  }

  // ─── KNOWLEDGE BASES ────────────────────────────────────────

  @Get('knowledge')
  @ApiOperation({ summary: 'List knowledge bases' })
  async findAllKnowledgeBases(@Headers('x-tenant-id') tenantId: string) {
    return this.aiService.findAllKnowledgeBases(tenantId);
  }

  @Get('knowledge/:id')
  @ApiOperation({ summary: 'Get knowledge base' })
  async findOneKnowledgeBase(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.aiService.findOneKnowledgeBase(tenantId, id);
  }

  @Post('knowledge')
  @ApiOperation({ summary: 'Create knowledge base' })
  async createKnowledgeBase(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateKnowledgeBaseDto) {
    return this.aiService.createKnowledgeBase(tenantId, dto);
  }

  @Delete('knowledge/:id')
  @ApiOperation({ summary: 'Delete knowledge base' })
  async deleteKnowledgeBase(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.aiService.deleteKnowledgeBase(tenantId, id);
  }

  // ─── KNOWLEDGE DOCUMENTS ────────────────────────────────────

  @Get('documents')
  @ApiOperation({ summary: 'List knowledge documents' })
  async findAllKnowledgeDocuments(
    @Headers('x-tenant-id') tenantId: string,
    @Query('knowledgeBaseId') knowledgeBaseId?: string,
  ) {
    return this.aiService.findAllKnowledgeDocuments(tenantId, knowledgeBaseId);
  }

  @Get('documents/search')
  @ApiOperation({ summary: 'Search knowledge documents' })
  async searchKnowledgeDocuments(@Headers('x-tenant-id') tenantId: string, @Query('q') query: string) {
    return this.aiService.searchKnowledgeDocuments(tenantId, query);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Create knowledge document' })
  async createKnowledgeDocument(@Headers('x-tenant-id') tenantId: string, @Body() dto: CreateKnowledgeDocumentDto) {
    return this.aiService.createKnowledgeDocument(tenantId, dto);
  }

  @Delete('documents/:id')
  @ApiOperation({ summary: 'Delete knowledge document' })
  async deleteKnowledgeDocument(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.aiService.deleteKnowledgeDocument(tenantId, id);
  }

  // ─── CHAT ───────────────────────────────────────────────────

  @Post('chat')
  @ApiOperation({ summary: 'Send chat message to AI' })
  async chat(@Headers('x-tenant-id') tenantId: string, @Body() dto: ChatRequestDto) {
    return this.aiService.chat(tenantId, dto);
  }

  // ─── INSIGHTS & RECOMMENDATIONS ─────────────────────────────

  @Get('insights')
  @ApiOperation({ summary: 'List AI insights' })
  async findAllInsights(@Headers('x-tenant-id') tenantId: string) {
    return this.aiService.findAllInsights(tenantId);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'List AI recommendations' })
  async findAllRecommendations(@Headers('x-tenant-id') tenantId: string) {
    return this.aiService.findAllRecommendations(tenantId);
  }

  // ─── USAGE & STATS ──────────────────────────────────────────

  @Get('usage')
  @ApiOperation({ summary: 'Get AI usage' })
  async getUsage(@Headers('x-tenant-id') tenantId: string) {
    return this.aiService.getUsage(tenantId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get AI stats' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.aiService.getStats(tenantId);
  }
}
