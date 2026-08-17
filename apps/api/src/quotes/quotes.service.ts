import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class QuotesService {
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

    const [quotes, total] = await Promise.all([
      this.prisma.quote.findMany({
        where,
        include: {
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
      this.prisma.quote.count({ where }),
    ]);

    return { quotes, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(tenantId: string, id: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        contact: true,
        company: true,
        assignee: true,
        items: { include: { product: true }, orderBy: { sortOrder: 'asc' } },
        history: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!quote) throw new NotFoundException('Quote not found');
    return quote;
  }

  async create(tenantId: string, data: any) {
    const lastQuote = await this.prisma.quote.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    const nextNumber = lastQuote
      ? `COT-${String(parseInt(lastQuote.number.replace('COT-', '')) + 1).padStart(6, '0')}`
      : 'COT-000001';

    const { items, ...quoteData } = data;

    const subtotal = items?.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unitPrice;
    }, 0) || 0;

    const quote = await this.prisma.quote.create({
      data: {
        tenantId,
        number: nextNumber,
        ...quoteData,
        subtotal,
        totalAmount: subtotal,
      },
    });

    if (items && items.length > 0) {
      await this.prisma.quoteItem.createMany({
        data: items.map((item: any, index: number) => ({
          tenantId,
          quoteId: quote.id,
          ...item,
          totalAmount: item.quantity * item.unitPrice,
          sortOrder: index,
        })),
      });
    }

    return this.findOne(tenantId, quote.id);
  }

  async update(tenantId: string, id: string, data: any) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!quote) throw new NotFoundException('Quote not found');

    if (data.status && data.status !== quote.status) {
      await this.prisma.quoteStatusHistory.create({
        data: {
          tenantId,
          quoteId: id,
          fromStatus: quote.status,
          toStatus: data.status,
        },
      });

      if (data.status === 'SENT') data.sentAt = new Date();
      if (data.status === 'APPROVED') data.approvedAt = new Date();
      if (data.status === 'REJECTED') data.rejectedAt = new Date();
    }

    return this.prisma.quote.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const quote = await this.prisma.quote.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!quote) throw new NotFoundException('Quote not found');

    return this.prisma.quote.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats(tenantId: string) {
    const [total, byStatus, totalAmount] = await Promise.all([
      this.prisma.quote.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.quote.groupBy({
        by: ['status'],
        where: { tenantId, deletedAt: null },
        _count: true,
        _sum: { totalAmount: true },
      }),
      this.prisma.quote.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { totalAmount: true },
      }),
    ]);

    return { total, byStatus, totalAmount: totalAmount._sum.totalAmount || 0 };
  }
}
