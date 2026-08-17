import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any) {
    const { search, categoryId, type, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId, isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (type) where.type = type;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          taxes: { include: { tax: true } },
          variants: { where: { isActive: true } },
          priceItems: {
            include: { priceList: true },
            take: 1,
          },
        },
        orderBy: { name: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(tenantId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
      include: {
        category: true,
        taxes: { include: { tax: true } },
        variants: true,
        priceItems: {
          include: { priceList: true },
        },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(tenantId: string, data: any) {
    const { taxIds, ...productData } = data;

    if (productData.sku) {
      const existing = await this.prisma.product.findFirst({
        where: { tenantId, sku: productData.sku },
      });

      if (existing) {
        throw new BadRequestException('A product with this SKU already exists');
      }
    }

    const product = await this.prisma.product.create({
      data: {
        tenantId,
        ...productData,
      },
    });

    if (taxIds && taxIds.length > 0) {
      await this.prisma.productTax.createMany({
        data: taxIds.map((taxId: string) => ({
          tenantId,
          productId: product.id,
          taxId,
        })),
      });
    }

    return this.findOne(tenantId, product.id);
  }

  async update(tenantId: string, id: string, data: any) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!product) throw new NotFoundException('Product not found');

    if (data.sku && data.sku !== product.sku) {
      const existing = await this.prisma.product.findFirst({
        where: { tenantId, sku: data.sku, id: { not: id } },
      });

      if (existing) {
        throw new BadRequestException('A product with this SKU already exists');
      }
    }

    const { taxIds, ...updateData } = data;

    if (taxIds !== undefined) {
      await this.prisma.productTax.deleteMany({
        where: { productId: id },
      });

      if (taxIds.length > 0) {
        await this.prisma.productTax.createMany({
          data: taxIds.map((taxId: string) => ({
            tenantId,
            productId: id,
            taxId,
          })),
        });
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        taxes: { include: { tax: true } },
        variants: true,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
    });

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async addVariant(tenantId: string, productId: string, data: any) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, tenantId },
    });

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.productVariant.create({
      data: {
        tenantId,
        productId,
        ...data,
      },
    });
  }

  async updateVariant(tenantId: string, variantId: string, data: any) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, tenantId },
    });

    if (!variant) throw new NotFoundException('Variant not found');

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data,
    });
  }

  async removeVariant(tenantId: string, variantId: string) {
    const variant = await this.prisma.productVariant.findFirst({
      where: { id: variantId, tenantId },
    });

    if (!variant) throw new NotFoundException('Variant not found');

    return this.prisma.productVariant.update({
      where: { id: variantId },
      data: { isActive: false },
    });
  }

  async getStats(tenantId: string) {
    const [total, byType] = await Promise.all([
      this.prisma.product.count({ where: { tenantId, isActive: true } }),
      this.prisma.product.groupBy({
        by: ['type'],
        where: { tenantId, isActive: true },
        _count: true,
      }),
    ]);

    return { total, byType };
  }
}
