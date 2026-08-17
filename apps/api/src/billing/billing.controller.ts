import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CreateBillingInvoiceDto, UpdateBillingInvoiceDto, CreateBillingPaymentDto, SubscriptionLifecycleDto } from './billing.dto';

@ApiTags('Billing')
@ApiBearerAuth('access-token')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('invoices')
  @ApiOperation({ summary: 'List billing invoices' })
  async findAllInvoices(@Headers('x-tenant-id') tenantId: string, @Query() query: any) {
    return this.billingService.findAllInvoices(tenantId, query);
  }

  @Get('invoices/stats')
  @ApiOperation({ summary: 'Get billing statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.billingService.getStats(tenantId);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get billing invoice by ID' })
  async findOneInvoice(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.billingService.findOneInvoice(tenantId, id);
  }

  @Post('invoices')
  @ApiOperation({ summary: 'Create billing invoice' })
  async createInvoice(@Headers('x-tenant-id') tenantId: string, @Body() data: CreateBillingInvoiceDto) {
    return this.billingService.createInvoice(tenantId, data);
  }

  @Put('invoices/:id')
  @ApiOperation({ summary: 'Update billing invoice' })
  async updateInvoice(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: UpdateBillingInvoiceDto) {
    return this.billingService.updateInvoice(tenantId, id, data);
  }

  @Post('invoices/:id/pay')
  @ApiOperation({ summary: 'Pay billing invoice' })
  async payInvoice(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string, @Body() data: CreateBillingPaymentDto) {
    return this.billingService.payInvoice(tenantId, id, data);
  }

  @Post('subscriptions/:id/renew')
  @ApiOperation({ summary: 'Renew subscription' })
  async renewSubscription(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.billingService.renewSubscription(tenantId, id);
  }

  @Post('subscriptions/:id/upgrade')
  @ApiOperation({ summary: 'Upgrade subscription plan' })
  async upgradeSubscription(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: SubscriptionLifecycleDto,
  ) {
    if (!data.newPlanId) throw new Error('newPlanId is required');
    return this.billingService.upgradeSubscription(tenantId, id, data.newPlanId);
  }

  @Post('subscriptions/:id/downgrade')
  @ApiOperation({ summary: 'Downgrade subscription plan' })
  async downgradeSubscription(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: SubscriptionLifecycleDto,
  ) {
    if (!data.newPlanId) throw new Error('newPlanId is required');
    return this.billingService.downgradeSubscription(tenantId, id, data.newPlanId);
  }

  @Post('subscriptions/:id/suspend')
  @ApiOperation({ summary: 'Suspend subscription' })
  async suspendSubscription(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: SubscriptionLifecycleDto,
  ) {
    return this.billingService.suspendSubscription(tenantId, id, data.reason);
  }

  @Post('subscriptions/:id/reactivate')
  @ApiOperation({ summary: 'Reactivate subscription' })
  async reactivateSubscription(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.billingService.reactivateSubscription(tenantId, id);
  }

  @Post('subscriptions/:id/cancel')
  @ApiOperation({ summary: 'Cancel subscription' })
  async cancelSubscription(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: SubscriptionLifecycleDto,
  ) {
    return this.billingService.cancelSubscription(tenantId, id, data.reason);
  }
}
