import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PriceListsService } from './price-lists.service';
import { CreatePriceListDto, UpdatePriceListDto, AddPriceListItemDto, UpdatePriceListItemDto } from './price-lists.dto';

@ApiTags('Price Lists')
@ApiBearerAuth('access-token')
@Controller('products/price-lists')
export class PriceListsController {
  constructor(private readonly priceListsService: PriceListsService) {}

  @Get()
  @ApiOperation({ summary: 'List price lists' })
  async findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.priceListsService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get price list by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.priceListsService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create price list' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreatePriceListDto) {
    return this.priceListsService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update price list' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdatePriceListDto) {
    return this.priceListsService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete price list' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.priceListsService.remove(tenantId, id);
  }

  @Post(':id/items')
  @ApiOperation({ summary: 'Add item to price list' })
  async addItem(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: AddPriceListItemDto,
  ) {
    return this.priceListsService.addItem(tenantId, id, data);
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update price list item' })
  async updateItem(
    @Headers('x-tenant-id') tenantId: string,
    @Param('itemId') itemId: string,
    @Body() data: UpdatePriceListItemDto,
  ) {
    return this.priceListsService.updateItem(tenantId, itemId, data);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Delete price list item' })
  async removeItem(@Headers('x-tenant-id') tenantId: string, @Param('itemId') itemId: string) {
    return this.priceListsService.removeItem(tenantId, itemId);
  }
}
