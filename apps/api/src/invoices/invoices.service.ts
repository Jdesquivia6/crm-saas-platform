import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class InvoicesService {
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

    const [invoices, total] = await Promise.all([
      this.prisma.invoice.findMany({
        where,
        include: {
          sale: true,
          contact: true,
          company: true,
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.invoice.count({ where }),
    ]);

    return { invoices, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(tenantId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        sale: true,
        contact: true,
        company: true,
        items: { include: { product: true }, orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async create(tenantId: string, data: any) {
    const lastInvoice = await this.prisma.invoice.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    const nextNumber = lastInvoice
      ? `FAC-${String(parseInt(lastInvoice.number.replace('FAC-', '')) + 1).padStart(6, '0')}`
      : 'FAC-000001';

    const { items, ...invoiceData } = data;

    const subtotal = items?.reduce((sum: number, item: any) => {
      return sum + item.quantity * item.unitPrice;
    }, 0) || 0;

    const invoice = await this.prisma.invoice.create({
      data: {
        tenantId,
        number: nextNumber,
        ...invoiceData,
        subtotal,
        totalAmount: subtotal,
      },
    });

    if (items && items.length > 0) {
      await this.prisma.invoiceItem.createMany({
        data: items.map((item: any, index: number) => ({
          tenantId,
          invoiceId: invoice.id,
          ...item,
          totalAmount: item.quantity * item.unitPrice,
          sortOrder: index,
        })),
      });
    }

    return this.findOne(tenantId, invoice.id);
  }

  async update(tenantId: string, id: string, data: any) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    if (data.status && data.status !== invoice.status) {
      if (data.status === 'SENT') data.sentAt = new Date();
      if (data.status === 'PAID') data.paidAt = new Date();
      if (data.status === 'CANCELLED') data.cancelledAt = new Date();
    }

    return this.prisma.invoice.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, tenantId, deletedAt: null },
    });

    if (!invoice) throw new NotFoundException('Invoice not found');

    return this.prisma.invoice.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getStats(tenantId: string) {
    const [total, byStatus, totalAmount, paidAmount] = await Promise.all([
      this.prisma.invoice.count({ where: { tenantId, deletedAt: null } }),
      this.prisma.invoice.groupBy({
        by: ['status'],
        where: { tenantId, deletedAt: null },
        _count: true,
        _sum: { totalAmount: true, paidAmount: true },
      }),
      this.prisma.invoice.aggregate({
        where: { tenantId, deletedAt: null },
        _sum: { totalAmount: true },
      }),
      this.prisma.invoice.aggregate({
        where: { tenantId, deletedAt: null, status: 'PAID' },
        _sum: { paidAmount: true },
      }),
    ]);

    return {
      total,
      byStatus,
      totalAmount: totalAmount._sum.totalAmount || 0,
      paidAmount: paidAmount._sum.paidAmount || 0,
    };
  }
}
