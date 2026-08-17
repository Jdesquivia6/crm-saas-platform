import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto, UpdateSaleDto } from './sales.dto';

@ApiTags('Sales')
@ApiBearerAuth('access-token')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  @ApiOperation({ summary: 'List sales' })
  async findAll(@Headers('x-tenant-id') tenantId: string, @Query() query: any) {
    return this.salesService.findAll(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get sale statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.salesService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.salesService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create sale' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateSaleDto) {
    return this.salesService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update sale' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateSaleDto) {
    return this.salesService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete sale' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.salesService.remove(tenantId, id);
  }
}
