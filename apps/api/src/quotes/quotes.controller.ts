import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto, UpdateQuoteDto } from './quotes.dto';

@ApiTags('Quotes')
@ApiBearerAuth('access-token')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Get()
  @ApiOperation({ summary: 'List quotes' })
  async findAll(@Headers('x-tenant-id') tenantId: string, @Query() query: any) {
    return this.quotesService.findAll(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get quote statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.quotesService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quote by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.quotesService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create quote' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateQuoteDto) {
    return this.quotesService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update quote' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateQuoteDto) {
    return this.quotesService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete quote' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.quotesService.remove(tenantId, id);
  }
}
