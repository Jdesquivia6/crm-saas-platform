import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class PriceListsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.priceList.findMany({
      where: { tenantId },
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const priceList = await this.prisma.priceList.findFirst({
      where: { id, tenantId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!priceList) throw new NotFoundException('Price list not found');
    return priceList;
  }

  async create(tenantId: string, data: any) {
    if (data.isDefault) {
      await this.prisma.priceList.updateMany({
        where: { tenantId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.priceList.create({
      data: { tenantId, ...data },
    });
  }

  async update(tenantId: string, id: string, data: any) {
    const priceList = await this.prisma.priceList.findFirst({
      where: { id, tenantId },
    });

    if (!priceList) throw new NotFoundException('Price list not found');

    if (data.isDefault) {
      await this.prisma.priceList.updateMany({
        where: { tenantId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.priceList.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const priceList = await this.prisma.priceList.findFirst({
      where: { id, tenantId },
      include: { _count: { select: { items: true } } },
    });

    if (!priceList) throw new NotFoundException('Price list not found');
    if (priceList.isDefault) {
      throw new BadRequestException('Cannot delete default price list');
    }

    return this.prisma.priceList.delete({ where: { id } });
  }

  async addItem(tenantId: string, priceListId: string, data: any) {
    const priceList = await this.prisma.priceList.findFirst({
      where: { id: priceListId, tenantId },
    });

    if (!priceList) throw new NotFoundException('Price list not found');

    const existing = await this.prisma.priceListItem.findFirst({
      where: {
        priceListId,
        productId: data.productId,
        variantId: data.variantId || null,
      },
    });

    if (existing) {
      throw new BadRequestException('Product already exists in this price list');
    }

    return this.prisma.priceListItem.create({
      data: {
        tenantId,
        priceListId,
        ...data,
      },
      include: { product: true },
    });
  }

  async updateItem(tenantId: string, itemId: string, data: any) {
    const item = await this.prisma.priceListItem.findFirst({
      where: { id: itemId, tenantId },
    });

    if (!item) throw new NotFoundException('Price list item not found');

    return this.prisma.priceListItem.update({
      where: { id: itemId },
      data,
      include: { product: true },
    });
  }

  async removeItem(tenantId: string, itemId: string) {
    const item = await this.prisma.priceListItem.findFirst({
      where: { id: itemId, tenantId },
    });

    if (!item) throw new NotFoundException('Price list item not found');

    return this.prisma.priceListItem.delete({ where: { id: itemId } });
  }
}
