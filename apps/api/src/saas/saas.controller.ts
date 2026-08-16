import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SaasService } from './saas.service';
import { CreatePlanDto, UpdatePlanDto } from './dto/plan.dto';
import { CreateFeatureDto, AssignFeatureToPlanDto, OverrideFeatureDto } from './dto/feature.dto';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto/subscription.dto';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';

@ApiTags('saas')
@ApiBearerAuth('access-token')
@Controller()
export class SaasController {
  constructor(private readonly saasService: SaasService) {}

  // ─── PLANS ──────────────────────────────────────────

  @Post('plans')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Create a plan' })
  createPlan(@Body() dto: CreatePlanDto) {
    return this.saasService.createPlan(dto);
  }

  @Get('plans')
  @ApiOperation({ summary: 'List all plans' })
  findPlans() {
    return this.saasService.findPlans();
  }

  @Get('plans/:id')
  @ApiOperation({ summary: 'Get plan by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findPlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.saasService.findPlanById(id);
  }

  @Patch('plans/:id')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Update plan' })
  @ApiParam({ name: 'id', type: 'string' })
  updatePlan(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdatePlanDto) {
    return this.saasService.updatePlan(id, dto);
  }

  // ─── FEATURES ───────────────────────────────────────

  @Post('features')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Create a feature' })
  createFeature(@Body() dto: CreateFeatureDto) {
    return this.saasService.createFeature(dto);
  }

  @Get('features')
  @ApiOperation({ summary: 'List all features' })
  findFeatures(@Query('module') module?: string) {
    if (module) {
      return this.saasService.findFeaturesByModule(module);
    }
    return this.saasService.findFeatures();
  }

  @Get('features/:id')
  @ApiOperation({ summary: 'Get feature by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findFeature(@Param('id', ParseUUIDPipe) id: string) {
    return this.saasService.findFeatureById(id);
  }

  // ─── PLAN FEATURES ──────────────────────────────────

  @Post('plans/:planId/features/:featureId')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Assign feature to plan' })
  @ApiParam({ name: 'planId', type: 'string' })
  @ApiParam({ name: 'featureId', type: 'string' })
  assignFeatureToPlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Param('featureId', ParseUUIDPipe) featureId: string,
    @Body() dto: AssignFeatureToPlanDto,
  ) {
    return this.saasService.assignFeatureToPlan(planId, featureId, dto);
  }

  @Delete('plans/:planId/features/:featureId')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Remove feature from plan' })
  @ApiParam({ name: 'planId', type: 'string' })
  @ApiParam({ name: 'featureId', type: 'string' })
  removeFeatureFromPlan(
    @Param('planId', ParseUUIDPipe) planId: string,
    @Param('featureId', ParseUUIDPipe) featureId: string,
  ) {
    return this.saasService.removeFeatureFromPlan(planId, featureId);
  }

  // ─── SUBSCRIPTIONS ──────────────────────────────────

  @Post('tenants/:tenantId/subscriptions')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Create subscription for tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  createSubscription(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.saasService.createSubscription(tenantId, dto);
  }

  @Get('tenants/:tenantId/subscriptions')
  @ApiOperation({ summary: 'List subscriptions for tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  findSubscriptions(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.saasService.findSubscriptions(tenantId);
  }

  @Get('subscriptions/:id')
  @ApiOperation({ summary: 'Get subscription by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findSubscription(@Param('id', ParseUUIDPipe) id: string) {
    return this.saasService.findSubscriptionById(id);
  }

  @Patch('subscriptions/:id')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Update subscription' })
  @ApiParam({ name: 'id', type: 'string' })
  updateSubscription(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.saasService.updateSubscription(id, dto);
  }

  @Delete('subscriptions/:id')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiParam({ name: 'id', type: 'string' })
  cancelSubscription(@Param('id', ParseUUIDPipe) id: string) {
    return this.saasService.cancelSubscription(id);
  }

  // ─── ENTITLEMENTS ───────────────────────────────────

  @Get('tenants/:tenantId/entitlements')
  @ApiOperation({ summary: 'Get all entitlements for tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  getEntitlements(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.saasService.getTenantEntitlements(tenantId);
  }

  @Get('tenants/:tenantId/entitlements/:featureCode')
  @ApiOperation({ summary: 'Check specific entitlement' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  @ApiParam({ name: 'featureCode', type: 'string' })
  checkEntitlement(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('featureCode') featureCode: string,
  ) {
    return this.saasService.checkEntitlement(tenantId, featureCode);
  }

  // ─── USAGE ──────────────────────────────────────────

  @Post('tenants/:tenantId/usage')
  @ApiOperation({ summary: 'Track usage event' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  trackUsage(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Body('featureCode') featureCode: string,
    @Body('quantity') quantity?: number,
  ) {
    return this.saasService.trackUsage(tenantId, featureCode, quantity || 1);
  }

  // ─── FEATURE OVERRIDES ──────────────────────────────

  @Post('tenants/:tenantId/overrides/:featureId')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Override feature for tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  @ApiParam({ name: 'featureId', type: 'string' })
  overrideFeature(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('featureId', ParseUUIDPipe) featureId: string,
    @Body() dto: OverrideFeatureDto,
  ) {
    return this.saasService.overrideFeature(tenantId, featureId, dto);
  }

  @Get('tenants/:tenantId/overrides')
  @ApiOperation({ summary: 'List overrides for tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  findOverrides(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.saasService.findOverrides(tenantId);
  }

  @Delete('overrides/:id')
  @RequirePermissions('saas.subscription.manage')
  @ApiOperation({ summary: 'Remove override' })
  @ApiParam({ name: 'id', type: 'string' })
  removeOverride(@Param('id', ParseUUIDPipe) id: string) {
    return this.saasService.removeOverride(id);
  }
}
