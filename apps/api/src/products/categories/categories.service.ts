import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.productCategory.findMany({
      where: { tenantId, parentId: null },
      include: {
        children: {
          where: { isActive: true },
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const category = await this.prisma.productCategory.findFirst({
      where: { id, tenantId },
      include: {
        parent: true,
        children: {
          include: { _count: { select: { products: true } } },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(tenantId: string, data: any) {
    if (data.parentId) {
      const parent = await this.prisma.productCategory.findFirst({
        where: { id: data.parentId, tenantId },
      });
      if (!parent) throw new BadRequestException('Parent category not found');
    }

    return this.prisma.productCategory.create({
      data: { tenantId, ...data },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    const category = await this.prisma.productCategory.findFirst({
      where: { id, tenantId },
    });

    if (!category) throw new NotFoundException('Category not found');

    if (data.parentId && data.parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    return this.prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const category = await this.prisma.productCategory.findFirst({
      where: { id, tenantId },
      include: {
        _count: { select: { products: true, children: true } },
      },
    });

    if (!category) throw new NotFoundException('Category not found');
    if (category._count.products > 0) {
      throw new BadRequestException('Cannot delete category with products');
    }
    if (category._count.children > 0) {
      throw new BadRequestException('Cannot delete category with subcategories');
    }

    return this.prisma.productCategory.delete({ where: { id } });
  }
}
