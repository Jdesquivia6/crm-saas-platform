import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAllIntents(tenantId: string, query: any = {}) {
    const { search, status, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { providerRef: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;

    const [intents, total] = await Promise.all([
      this.prisma.paymentIntent.findMany({
        where,
        include: {
          contact: true,
          invoice: true,
          providerAccount: true,
          transactions: true,
          refunds: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.paymentIntent.count({ where }),
    ]);

    return { intents, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneIntent(tenantId: string, id: string) {
    const intent = await this.prisma.paymentIntent.findFirst({
      where: { id, tenantId },
      include: {
        contact: true,
        invoice: true,
        providerAccount: true,
        transactions: { orderBy: { createdAt: 'desc' } },
        refunds: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!intent) throw new NotFoundException('Payment intent not found');
    return intent;
  }

  async createIntent(tenantId: string, data: any) {
    const lastIntent = await this.prisma.paymentIntent.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    const nextNumber = lastIntent
      ? `PAY-${String(parseInt(lastIntent.number.replace('PAY-', '')) + 1).padStart(6, '0')}`
      : 'PAY-000001';

    return this.prisma.paymentIntent.create({
      data: {
        tenantId,
        number: nextNumber,
        ...data,
      },
      include: {
        contact: true,
        invoice: true,
        providerAccount: true,
      },
    });
  }

  async confirmIntent(tenantId: string, id: string, data: any) {
    const intent = await this.prisma.paymentIntent.findFirst({
      where: { id, tenantId },
    });

    if (!intent) throw new NotFoundException('Payment intent not found');
    if (intent.status !== 'PENDING') {
      throw new BadRequestException('Intent is not in PENDING status');
    }

    const updated = await this.prisma.paymentIntent.update({
      where: { id },
      data: {
        status: 'PROCESSING',
        paymentMethod: data.paymentMethod || intent.paymentMethod,
      },
    });

    // Simulate provider processing (in production, integrate with real provider)
    const success = Math.random() > 0.1; // 90% success rate for simulation

    if (success) {
      await this.prisma.paymentIntent.update({
        where: { id },
        data: {
          status: 'SUCCEEDED',
          amountReceived: intent.amount,
          succeededAt: new Date(),
        },
      });

      await this.prisma.paymentTransaction.create({
        data: {
          tenantId,
          intentId: id,
          type: 'CAPTURE',
          status: 'SUCCEEDED',
          amount: intent.amount,
          currencyCode: intent.currencyCode,
        },
      });

      // Update invoice if linked
      if (intent.invoiceId) {
        const invoice = await this.prisma.invoice.findUnique({
          where: { id: intent.invoiceId },
        });

        if (invoice) {
          const newPaidAmount = Number(invoice.paidAmount) + Number(intent.amount);
          await this.prisma.invoice.update({
            where: { id: intent.invoiceId },
            data: {
              paidAmount: newPaidAmount,
              status: newPaidAmount >= Number(invoice.totalAmount) ? 'PAID' : invoice.status,
              paidAt: newPaidAmount >= Number(invoice.totalAmount) ? new Date() : null,
            },
          });
        }
      }

      return this.findOneIntent(tenantId, id);
    } else {
      await this.prisma.paymentIntent.update({
        where: { id },
        data: {
          status: 'FAILED',
          failureReason: 'Provider declined the transaction',
        },
      });

      await this.prisma.paymentTransaction.create({
        data: {
          tenantId,
          intentId: id,
          type: 'CAPTURE',
          status: 'FAILED',
          amount: intent.amount,
          currencyCode: intent.currencyCode,
        },
      });

      return this.findOneIntent(tenantId, id);
    }
  }

  async cancelIntent(tenantId: string, id: string) {
    const intent = await this.prisma.paymentIntent.findFirst({
      where: { id, tenantId },
    });

    if (!intent) throw new NotFoundException('Payment intent not found');
    if (intent.status !== 'PENDING' && intent.status !== 'PROCESSING') {
      throw new BadRequestException('Intent cannot be cancelled in current status');
    }

    return this.prisma.paymentIntent.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  async createRefund(tenantId: string, intentId: string, data: any) {
    const intent = await this.prisma.paymentIntent.findFirst({
      where: { id: intentId, tenantId },
    });

    if (!intent) throw new NotFoundException('Payment intent not found');
    if (intent.status !== 'SUCCEEDED') {
      throw new BadRequestException('Can only refund successful payments');
    }

    const availableAmount = Number(intent.amountReceived) - Number(intent.amountRefunded);
    if (data.amount > availableAmount) {
      throw new BadRequestException(`Refund amount exceeds available amount: ${availableAmount}`);
    }

    const lastRefund = await this.prisma.refund.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    const nextNumber = lastRefund
      ? `REF-${String(parseInt(lastRefund.number.replace('REF-', '')) + 1).padStart(6, '0')}`
      : 'REF-000001';

    const refund = await this.prisma.refund.create({
      data: {
        tenantId,
        intentId,
        number: nextNumber,
        amount: data.amount,
        currencyCode: intent.currencyCode,
        reason: data.reason,
        status: 'SUCCEEDED',
        processedAt: new Date(),
      },
    });

    await this.prisma.paymentIntent.update({
      where: { id: intentId },
      data: {
        amountRefunded: { increment: data.amount },
      },
    });

    await this.prisma.paymentTransaction.create({
      data: {
        tenantId,
        intentId,
        type: 'TRANSFER',
        status: 'SUCCEEDED',
        amount: -data.amount,
        currencyCode: intent.currencyCode,
      },
    });

    return refund;
  }

  async getStats(tenantId: string) {
    const [totalIntents, byStatus, totalAmount, totalRefunded] = await Promise.all([
      this.prisma.paymentIntent.count({ where: { tenantId } }),
      this.prisma.paymentIntent.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: true,
        _sum: { amount: true, amountReceived: true },
      }),
      this.prisma.paymentIntent.aggregate({
        where: { tenantId, status: 'SUCCEEDED' },
        _sum: { amount: true, amountReceived: true },
      }),
      this.prisma.refund.aggregate({
        where: { tenantId, status: 'SUCCEEDED' },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalIntents,
      byStatus,
      totalAmount: totalAmount._sum.amount || 0,
      totalReceived: totalAmount._sum.amountReceived || 0,
      totalRefunded: totalRefunded._sum.amount || 0,
    };
  }
}
