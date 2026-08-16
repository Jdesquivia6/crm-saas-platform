import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { CreateFeatureDto, AssignFeatureToPlanDto, OverrideFeatureDto } from './dto/feature.dto';
import { CreateSubscriptionDto, UpdateSubscriptionDto, SubscriptionStatus } from './dto/subscription.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SaasService {
  private readonly logger = new Logger(SaasService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── PLANS ──────────────────────────────────────────

  async createPlan(dto: CreatePlanDto) {
    const existing = await this.prisma.plan.findUnique({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Plan '${dto.code}' ya existe`);
    }

    return this.prisma.plan.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        monthlyPrice: dto.monthlyPrice,
        annualPrice: dto.annualPrice,
        currencyCode: dto.currencyCode || 'COP',
      },
    });
  }

  async findPlans() {
    return this.prisma.plan.findMany({
      include: {
        planFeatures: {
          include: { feature: true },
        },
        _count: { select: { subscriptions: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findPlanById(id: string) {
    const plan = await this.prisma.plan.findFirst({
      where: { id },
      include: {
        planFeatures: {
          include: { feature: true },
        },
      },
    });
    if (!plan) {
      throw new NotFoundException(`Plan ${id} no encontrado`);
    }
    return plan;
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    await this.findPlanById(id);
    return this.prisma.plan.update({ where: { id }, data: dto });
  }

  // ─── FEATURES ───────────────────────────────────────

  async createFeature(dto: CreateFeatureDto) {
    const existing = await this.prisma.feature.findUnique({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Feature '${dto.code}' ya existe`);
    }

    return this.prisma.feature.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        module: dto.module,
        type: dto.type || 'BOOLEAN',
        defaultValue: dto.defaultValue as Prisma.InputJsonValue,
      },
    });
  }

  async findFeatures() {
    return this.prisma.feature.findMany({
      orderBy: [{ module: 'asc' }, { code: 'asc' }],
    });
  }

  async findFeaturesByModule(module: string) {
    return this.prisma.feature.findMany({
      where: { module },
      orderBy: { code: 'asc' },
    });
  }

  async findFeatureById(id: string) {
    const feature = await this.prisma.feature.findFirst({ where: { id } });
    if (!feature) {
      throw new NotFoundException(`Feature ${id} no encontrada`);
    }
    return feature;
  }

  // ─── PLAN FEATURES ──────────────────────────────────

  async assignFeatureToPlan(planId: string, featureId: string, dto: AssignFeatureToPlanDto) {
    await this.findPlanById(planId);
    await this.findFeatureById(featureId);

    return this.prisma.planFeature.upsert({
      where: { planId_featureId: { planId, featureId } },
      create: {
        planId,
        featureId,
        isEnabled: dto.isEnabled,
        limitValue: dto.limitValue as Prisma.InputJsonValue,
      },
      update: {
        isEnabled: dto.isEnabled,
        limitValue: dto.limitValue as Prisma.InputJsonValue,
      },
      include: { feature: true },
    });
  }

  async removeFeatureFromPlan(planId: string, featureId: string) {
    const pf = await this.prisma.planFeature.findUnique({
      where: { planId_featureId: { planId, featureId } },
    });
    if (!pf) {
      throw new NotFoundException('Feature no asignada a este plan');
    }
    return this.prisma.planFeature.delete({ where: { id: pf.id } });
  }

  // ─── SUBSCRIPTIONS ──────────────────────────────────

  async createSubscription(tenantId: string, dto: CreateSubscriptionDto) {
    const existing = await this.prisma.subscription.findFirst({
      where: { tenantId, status: { in: ['ACTIVE', 'TRIAL'] } },
    });
    if (existing) {
      throw new ConflictException('El tenant ya tiene una suscripción activa');
    }

    const plan = await this.findPlanById(dto.planId);
    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    return this.prisma.subscription.create({
      data: {
        tenantId,
        planId: dto.planId,
        billingCycle: dto.billingCycle || 'MONTHLY',
        startDate: now,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        trialEndsAt: dto.trialEndsAt ? new Date(dto.trialEndsAt) : null,
      },
      include: { plan: true },
    });
  }

  async findSubscriptions(tenantId: string) {
    return this.prisma.subscription.findMany({
      where: { tenantId },
      include: { plan: true, history: { orderBy: { createdAt: 'desc' }, take: 5 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findSubscriptionById(id: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { id },
      include: { plan: true, history: { orderBy: { createdAt: 'desc' } } },
    });
    if (!sub) {
      throw new NotFoundException(`Suscripción ${id} no encontrada`);
    }
    return sub;
  }

  async updateSubscription(id: string, dto: UpdateSubscriptionDto) {
    const sub = await this.findSubscriptionById(id);

    if (dto.planId && dto.planId !== sub.planId) {
      await this.findPlanById(dto.planId);
    }

    const updated = await this.prisma.subscription.update({
      where: { id },
      data: {
        planId: dto.planId,
        billingCycle: dto.billingCycle,
        status: dto.status,
      },
      include: { plan: true },
    });

    await this.prisma.subscriptionHistory.create({
      data: {
        subscriptionId: id,
        action: 'UPDATED',
        previousPlanId: sub.planId,
        newPlanId: updated.planId,
        previousStatus: sub.status,
        newStatus: updated.status,
      },
    });

    return updated;
  }

  async cancelSubscription(id: string) {
    return this.updateSubscription(id, { status: SubscriptionStatus.CANCELLED });
  }

  // ─── ENTITLEMENTS ───────────────────────────────────

  async checkEntitlement(tenantId: string, featureCode: string): Promise<{
    enabled: boolean;
    limit: number | null;
    currentUsage: number;
    hasAccess: boolean;
  }> {
    const feature = await this.prisma.feature.findFirst({ where: { code: featureCode } });
    if (!feature) {
      return { enabled: false, limit: null, currentUsage: 0, hasAccess: false };
    }

    const override = await this.prisma.tenantFeatureOverride.findUnique({
      where: { tenantId_featureId: { tenantId, featureId: feature.id } },
    });

    if (override) {
      const limit = (override.limitValue as { max?: number })?.max ?? null;
      const usage = await this.getCurrentUsage(tenantId, featureCode);
      return {
        enabled: override.isEnabled,
        limit,
        currentUsage: usage,
        hasAccess: override.isEnabled && (limit === null || usage < limit),
      };
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: { tenantId, status: { in: ['ACTIVE', 'TRIAL'] } },
      include: {
        plan: {
          include: {
            planFeatures: {
              where: { featureId: feature.id },
              include: { feature: true },
            },
          },
        },
      },
    });

    if (!subscription) {
      return { enabled: false, limit: null, currentUsage: 0, hasAccess: false };
    }

    const planFeature = subscription.plan.planFeatures[0];
    if (!planFeature || !planFeature.isEnabled) {
      return { enabled: false, limit: null, currentUsage: 0, hasAccess: false };
    }

    const limit = (planFeature.limitValue as { max?: number })?.max ?? null;
    const usage = await this.getCurrentUsage(tenantId, featureCode);

    return {
      enabled: true,
      limit,
      currentUsage: usage,
      hasAccess: limit === null || usage < limit,
    };
  }

  async getTenantEntitlements(tenantId: string) {
    const features = await this.prisma.feature.findMany();
    const results: Record<string, Awaited<ReturnType<typeof this.checkEntitlement>>> = {};

    for (const feature of features) {
      results[feature.code] = await this.checkEntitlement(tenantId, feature.code);
    }

    return results;
  }

  // ─── USAGE ──────────────────────────────────────────

  async trackUsage(tenantId: string, featureCode: string, quantity: number = 1) {
    const period = new Date().toISOString().substring(0, 7); // YYYY-MM

    await this.prisma.usageEvent.create({
      data: { tenantId, featureCode, quantity },
    });

    const counter = await this.prisma.usageCounter.findUnique({
      where: { tenantId_featureCode_period: { tenantId, featureCode, period } },
    });

    if (counter) {
      await this.prisma.usageCounter.update({
        where: { id: counter.id },
        data: { currentUsage: { increment: quantity } },
      });
    } else {
      await this.prisma.usageCounter.create({
        data: { tenantId, featureCode, period, currentUsage: quantity },
      });
    }
  }

  private async getCurrentUsage(tenantId: string, featureCode: string): Promise<number> {
    const period = new Date().toISOString().substring(0, 7);
    const counter = await this.prisma.usageCounter.findUnique({
      where: { tenantId_featureCode_period: { tenantId, featureCode, period } },
    });
    return counter?.currentUsage || 0;
  }

  // ─── FEATURE OVERRIDES ──────────────────────────────

  async overrideFeature(tenantId: string, featureId: string, dto: OverrideFeatureDto) {
    await this.findFeatureById(featureId);

    return this.prisma.tenantFeatureOverride.upsert({
      where: { tenantId_featureId: { tenantId, featureId } },
      create: {
        tenantId,
        featureId,
        isEnabled: dto.isEnabled,
        limitValue: dto.limitValue as Prisma.InputJsonValue,
        reason: dto.reason,
      },
      update: {
        isEnabled: dto.isEnabled,
        limitValue: dto.limitValue as Prisma.InputJsonValue,
        reason: dto.reason,
      },
      include: { feature: true },
    });
  }

  async findOverrides(tenantId: string) {
    return this.prisma.tenantFeatureOverride.findMany({
      where: { tenantId },
      include: { feature: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeOverride(id: string) {
    const override = await this.prisma.tenantFeatureOverride.findUnique({ where: { id } });
    if (!override) {
      throw new NotFoundException('Override no encontrado');
    }
    return this.prisma.tenantFeatureOverride.delete({ where: { id } });
  }
}
