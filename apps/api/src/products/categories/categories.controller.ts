import { Controller, Get, Post, Put, Delete, Body, Param, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

@ApiTags('Product Categories')
@ApiBearerAuth('access-token')
@Controller('products/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List product categories' })
  async findAll(@Headers('x-tenant-id') tenantId: string) {
    return this.categoriesService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  async findOne(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.categoriesService.findOne(tenantId, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create category' })
  async create(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateCategoryDto) {
    return this.categoriesService.create(tenantId, data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category' })
  async update(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoriesService.update(tenantId, id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  async remove(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.categoriesService.remove(tenantId, id);
  }
}
