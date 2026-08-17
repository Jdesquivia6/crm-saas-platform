import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  // ─── BILLING INVOICES ──────────────────────────────────────

  async findAllInvoices(tenantId: string, query: any = {}) {
    const { search, status, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;

    const [invoices, total] = await Promise.all([
      this.prisma.billingInvoice.findMany({
        where,
        include: {
          subscription: { include: { plan: true } },
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.billingInvoice.count({ where }),
    ]);

    return { invoices, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOneInvoice(tenantId: string, id: string) {
    const invoice = await this.prisma.billingInvoice.findFirst({
      where: { id, tenantId },
      include: {
        subscription: { include: { plan: true, tenant: true } },
        items: true,
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!invoice) throw new NotFoundException('Billing invoice not found');
    return invoice;
  }

  async createInvoice(tenantId: string, data: any) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: data.subscriptionId, tenantId },
      include: { plan: true },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    const lastInvoice = await this.prisma.billingInvoice.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    const nextNumber = lastInvoice
      ? `BOL-${String(parseInt(lastInvoice.number.replace('BOL-', '')) + 1).padStart(6, '0')}`
      : 'BOL-000001';

    const items = data.items || [{
      description: `${subscription.plan.name} - ${data.periodStart} a ${data.periodEnd}`,
      quantity: 1,
      unitPrice: subscription.billingCycle === 'ANNUAL' ? Number(subscription.plan.annualPrice) : Number(subscription.plan.monthlyPrice),
    }];

    const subtotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0);

    const invoice = await this.prisma.billingInvoice.create({
      data: {
        tenantId,
        subscriptionId: data.subscriptionId,
        number: nextNumber,
        currencyCode: data.currencyCode || 'COP',
        subtotal,
        totalAmount: subtotal,
        dueDate: data.dueDate,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        notes: data.notes,
      },
    });

    await this.prisma.billingInvoiceItem.createMany({
      data: items.map((item: any) => ({
        tenantId,
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.quantity * item.unitPrice,
        metadata: item.metadata,
      })),
    });

    return this.findOneInvoice(tenantId, invoice.id);
  }

  async updateInvoice(tenantId: string, id: string, data: any) {
    const invoice = await this.prisma.billingInvoice.findFirst({
      where: { id, tenantId },
    });

    if (!invoice) throw new NotFoundException('Billing invoice not found');

    if (data.status === 'SENT') data.sentAt = new Date();
    if (data.status === 'PAID') data.paidAt = new Date();
    if (data.status === 'CANCELLED') data.cancelledAt = new Date();

    return this.prisma.billingInvoice.update({
      where: { id },
      data,
    });
  }

  async payInvoice(tenantId: string, id: string, data: any) {
    const invoice = await this.prisma.billingInvoice.findFirst({
      where: { id, tenantId },
    });

    if (!invoice) throw new NotFoundException('Billing invoice not found');
    if (invoice.status === 'PAID') throw new BadRequestException('Invoice already paid');

    const lastPayment = await this.prisma.billingPayment.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    });

    const nextNumber = lastPayment
      ? `BP-${String(parseInt(lastPayment.number.replace('BP-', '')) + 1).padStart(6, '0')}`
      : 'BP-000001';

    const payment = await this.prisma.billingPayment.create({
      data: {
        tenantId,
        invoiceId: id,
        number: nextNumber,
        amount: data.amount || invoice.totalAmount,
        currencyCode: invoice.currencyCode,
        paymentMethod: data.paymentMethod,
        status: 'SUCCEEDED',
        processedAt: new Date(),
      },
    });

    const newPaidAmount = Number(invoice.paidAmount) + Number(payment.amount);

    await this.prisma.billingInvoice.update({
      where: { id },
      data: {
        paidAmount: newPaidAmount,
        status: newPaidAmount >= Number(invoice.totalAmount) ? 'PAID' : invoice.status,
        paidAt: newPaidAmount >= Number(invoice.totalAmount) ? new Date() : null,
      },
    });

    return { payment, invoice: await this.findOneInvoice(tenantId, id) };
  }

  // ─── SUBSCRIPTION LIFECYCLE ─────────────────────────────────

  async renewSubscription(tenantId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
      include: { plan: true },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    const newPeriodStart = subscription.currentPeriodEnd || new Date();
    const newPeriodEnd = new Date(newPeriodStart);
    newPeriodEnd.setMonth(newPeriodEnd.getMonth() + (subscription.billingCycle === 'ANNUAL' ? 12 : 1));

    const invoice = await this.createInvoice(tenantId, {
      subscriptionId,
      dueDate: newPeriodStart.toISOString(),
      periodStart: newPeriodStart.toISOString(),
      periodEnd: newPeriodEnd.toISOString(),
    });

    await this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        currentPeriodStart: newPeriodStart,
        currentPeriodEnd: newPeriodEnd,
      },
    });

    await this.prisma.subscriptionHistory.create({
      data: {
        subscriptionId,
        action: 'RENEWED',
      },
    });

    return { subscription: await this.prisma.subscription.findUnique({ where: { id: subscriptionId }, include: { plan: true } }), invoice };
  }

  async upgradeSubscription(tenantId: string, subscriptionId: string, newPlanId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
      include: { plan: true },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    const newPlan = await this.prisma.plan.findUnique({ where: { id: newPlanId } });
    if (!newPlan) throw new NotFoundException('New plan not found');

    await this.prisma.subscriptionHistory.create({
      data: {
        subscriptionId,
        action: 'UPGRADED',
        previousPlanId: subscription.planId,
        newPlanId,
      },
    });

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { planId: newPlanId },
      include: { plan: true },
    });
  }

  async downgradeSubscription(tenantId: string, subscriptionId: string, newPlanId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
      include: { plan: true },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    const newPlan = await this.prisma.plan.findUnique({ where: { id: newPlanId } });
    if (!newPlan) throw new NotFoundException('New plan not found');

    await this.prisma.subscriptionHistory.create({
      data: {
        subscriptionId,
        action: 'DOWNGRADED',
        previousPlanId: subscription.planId,
        newPlanId,
      },
    });

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { planId: newPlanId },
      include: { plan: true },
    });
  }

  async suspendSubscription(tenantId: string, subscriptionId: string, reason?: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    await this.prisma.subscriptionHistory.create({
      data: {
        subscriptionId,
        action: 'SUSPENDED',
        reason,
      },
    });

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'SUSPENDED' },
      include: { plan: true },
    });
  }

  async reactivateSubscription(tenantId: string, subscriptionId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    await this.prisma.subscriptionHistory.create({
      data: {
        subscriptionId,
        action: 'REACTIVATED',
      },
    });

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'ACTIVE' },
      include: { plan: true },
    });
  }

  async cancelSubscription(tenantId: string, subscriptionId: string, reason?: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { id: subscriptionId, tenantId },
    });

    if (!subscription) throw new NotFoundException('Subscription not found');

    await this.prisma.subscriptionHistory.create({
      data: {
        subscriptionId,
        action: 'CANCELED',
        reason,
      },
    });

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELLED', canceledAt: new Date() },
      include: { plan: true },
    });
  }

  async getStats(tenantId: string) {
    const [totalInvoices, byStatus, totalAmount, paidAmount] = await Promise.all([
      this.prisma.billingInvoice.count({ where: { tenantId } }),
      this.prisma.billingInvoice.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: true,
        _sum: { totalAmount: true, paidAmount: true },
      }),
      this.prisma.billingInvoice.aggregate({
        where: { tenantId },
        _sum: { totalAmount: true },
      }),
      this.prisma.billingInvoice.aggregate({
        where: { tenantId, status: 'PAID' },
        _sum: { paidAmount: true },
      }),
    ]);

    return {
      totalInvoices,
      byStatus,
      totalAmount: totalAmount._sum.totalAmount || 0,
      paidAmount: paidAmount._sum.paidAmount || 0,
    };
  }
}
