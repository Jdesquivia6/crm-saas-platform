import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './orders.dto';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List orders' })
  async findAll(@Headers('x-tenant-id') tenantId: string, @Query() query: any) {
    return this.ordersService.findAll(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.ordersService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.ordersService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create order' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateOrderDto) {
    return this.ordersService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update order' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateOrderDto) {
    return this.ordersService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.ordersService.remove(tenantId, id);
  }
}
