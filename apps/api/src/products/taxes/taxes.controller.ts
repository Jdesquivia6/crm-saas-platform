import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TaxesService } from './taxes.service';
import { CreateTaxDto, UpdateTaxDto } from './taxes.dto';

@ApiTags('Taxes')
@ApiBearerAuth('access-token')
@Controller('products/taxes')
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Get()
  @ApiOperation({ summary: 'List taxes' })
  async findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.taxesService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tax by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.taxesService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create tax' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateTaxDto) {
    return this.taxesService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update tax' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateTaxDto) {
    return this.taxesService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tax' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.taxesService.remove(tenantId, id);
  }
}
