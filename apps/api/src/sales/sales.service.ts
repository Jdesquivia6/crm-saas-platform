import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: any = {}) {
    const { search, status, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId, deletedAt: null };

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;

    const [sales, total] = await Promise.all([
      this.prisma.sale.findMany({
        where,
        include: {
          order: true,
          contact: true,
          company: true,
          assignee: true,
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.sale.count({ where }),
    ]);

    return { sales, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(tenantId: string, id: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        order: true,
        contact: true,
        company: true,
        assignee: true,
        items: { include: { product: true }, orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!sale) throw new NotFoundException('Sale not found');
    return sale;
  }

  async create(tenantId: string, data: any) {
    const lastSale = await this.prisma.sale.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    const nextNumber = lastSale
      ? `VTA-${String(parseInt(lastSale.number.replace('VTA-', '')) + 1).padStart(6, '0')}`
      : 'VTA-000001';

    const { items, ...saleData } = data;

    const subtotal = items?.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unitPrice;
    }, 0) || 0;

    const sale = await this.prisma.sale.create({
      data: {
        tenantId,
        number: nextNumber,
        ...saleData,
        subtotal,
        totalAmount: subtotal,
      },
    });

    if (items && items.length > 0) {
      await this.prisma.saleItem.createMany({
        data: items.map((item: any, index: number) => ({
          tenantId,
          saleId: sale.id,
          ...item,
          totalAmount: item.quantity * item.unitPrice,
          sortOrder: index,
        })),
      });
    }

    return this.findOne(tenantId, sale.id);
  }

  async update(tenantId: string, id: string, data: any) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!sale) throw new NotFoundException('Sale not found');

    if (data.status && data.status !== sale.status) {
      if (data.status === 'COMPLETED') data.completedAt = new Date();
      if (data.status === 'CANCELLED') data.cancelledAt = new Date();
    }

    return this.prisma.sale.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const sale = await this.prisma.sale.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!sale) throw new NotFoundException('Sale not found');

    return this.prisma.sale.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats(tenantId: string) {
    const [total, byStatus, totalAmount] = await Promise.all([
      this.prisma.sale.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.sale.groupBy({
        by: ['status'],
        where: { tenantId, deletedAt: null },
        _count: true,
        _sum: { totalAmount: true },
      }),
      this.prisma.sale.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { totalAmount: true },
      }),
    ]);

    return { total, byStatus, totalAmount: totalAmount._sum.totalAmount || 0 };
  }
}
