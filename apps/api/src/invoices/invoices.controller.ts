import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoices.dto';

@ApiTags('Invoices')
@ApiBearerAuth('access-token')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({ summary: 'List invoices' })
  async findAll(@Headers('x-tenant-id') tenantId: string, @Query() query: any) {
    return this.invoicesService.findAll(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get invoice statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.invoicesService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.invoicesService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create invoice' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateInvoiceDto) {
    return this.invoicesService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update invoice' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateInvoiceDto) {
    return this.invoicesService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.invoicesService.remove(tenantId, id);
  }
}
