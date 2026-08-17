import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './products.dto';

@ApiTags('Products')
@ApiBearerAuth('access-token')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List products' })
  async findAll(@Headers('x-tenant-id') tenantId: string, @Query() query: ProductQueryDto) {
    return this.productsService.findAll(tenantId, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get product statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.productsService.getStats(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.productsService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create product' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateProductDto) {
    return this.productsService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productsService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.productsService.remove(tenantId, id);
  }

  @Post(':id/variants')
  @ApiOperation({ summary: 'Add product variant' })
  async addVariant(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.productsService.addVariant(tenantId, id, data);
  }

  @Put('variants/:variantId')
  @ApiOperation({ summary: 'Update product variant' })
  async updateVariant(
    @Headers('x-tenant-id') tenantId: string,
    @Param('variantId') variantId: string,
    @Body() data: any,
  ) {
    return this.productsService.updateVariant(tenantId, variantId, data);
  }

  @Delete('variants/:variantId')
  @ApiOperation({ summary: 'Delete product variant' })
  async removeVariant(@Headers('x-tenant-id') tenantId: string, @Param('variantId') variantId: string) {
    return this.productsService.removeVariant(tenantId, variantId);
  }
}
