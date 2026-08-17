import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class OrdersService {
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

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          quote: true,
          contact: true,
          company: true,
          assignee: true,
          items: true,
          _count: { select: { items: true, history: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(tenantId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        quote: true,
        contact: true,
        company: true,
        assignee: true,
        items: { include: { product: true }, orderBy: { sortOrder: 'asc' } },
        history: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(tenantId: string, data: any) {
    const lastOrder = await this.prisma.order.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    const nextNumber = lastOrder
      ? `PED-${String(parseInt(lastOrder.number.replace('PED-', '')) + 1).padStart(6, '0')}`
      : 'PED-000001';

    const { items, ...orderData } = data;

    const subtotal = items?.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unitPrice;
    }, 0) || 0;

    const order = await this.prisma.order.create({
      data: {
        tenantId,
        number: nextNumber,
        ...orderData,
        subtotal,
        totalAmount: subtotal,
      },
    });

    if (items && items.length > 0) {
      await this.prisma.orderItem.createMany({
        data: items.map((item: any, index: number) => ({
          tenantId,
          orderId: order.id,
          ...item,
          totalAmount: item.quantity * item.unitPrice,
          sortOrder: index,
        })),
      });
    }

    return this.findOne(tenantId, order.id);
  }

  async update(tenantId: string, id: string, data: any) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (data.status && data.status !== order.status) {
      await this.prisma.orderStatusHistory.create({
        data: {
          tenantId,
          orderId: id,
          fromStatus: order.status,
          toStatus: data.status,
        },
      });

      if (data.status === 'CONFIRMED') data.confirmedAt = new Date();
      if (data.status === 'SHIPPED') data.shippedAt = new Date();
      if (data.status === 'DELIVERED') data.deliveredAt = new Date();
      if (data.status === 'CANCELLED') {
        data.cancelledAt = new Date();
        if (!data.cancelReason) throw new BadRequestException('Cancel reason is required');
      }
    }

    return this.prisma.order.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!order) throw new NotFoundException('Order not found');

    return this.prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats(tenantId: string) {
    const [total, byStatus, totalAmount] = await Promise.all([
      this.prisma.order.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.order.groupBy({
        by: ['status'],
        where: { tenantId, deletedAt: null },
        _count: true,
        _sum: { totalAmount: true },
      }),
      this.prisma.order.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { totalAmount: true },
      }),
    ]);

    return { total, byStatus, totalAmount: totalAmount._sum.totalAmount || 0 };
  }
}
