import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentIntentDto, UpdatePaymentIntentDto, ConfirmPaymentDto, CreateRefundDto } from './payments.dto';

@ApiTags('Payments')
@ApiBearerAuth('access-token')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('intents')
  @ApiOperation({ summary: 'List payment intents' })
  async findAllIntents(@Headers('x-tenant-id') tenantId: string, @Query() query: any) {
    return this.paymentsService.findAllIntents(tenantId, query);
  }

  @Get('intents/stats')
  @ApiOperation({ summary: 'Get payment statistics' })
  async getStats(@Headers('x-tenant-id') tenantId: string) {
    return this.paymentsService.getStats(tenantId);
  }

  @Get('intents/:id')
  @ApiOperation({ summary: 'Get payment intent by ID' })
  async findOneIntent(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.paymentsService.findOneIntent(tenantId, id);
  }

  @Post('intents')
  @ApiOperation({ summary: 'Create payment intent' })
  async createIntent(@Headers('x-tenant-id') tenantId: string, @Body() data: CreatePaymentIntentDto) {
    return this.paymentsService.createIntent(tenantId, data);
  }

  @Post('intents/:id/confirm')
  @ApiOperation({ summary: 'Confirm and process payment intent' })
  async confirmIntent(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: ConfirmPaymentDto,
  ) {
    return this.paymentsService.confirmIntent(tenantId, id, data);
  }

  @Post('intents/:id/cancel')
  @ApiOperation({ summary: 'Cancel payment intent' })
  async cancelIntent(@Headers('x-tenant-id') tenantId: string, @Param('id') id: string) {
    return this.paymentsService.cancelIntent(tenantId, id);
  }

  @Post('intents/:id/refunds')
  @ApiOperation({ summary: 'Create refund for payment intent' })
  async createRefund(
    @Headers('x-tenant-id') tenantId: string,
    @Param('id') id: string,
    @Body() data: CreateRefundDto,
  ) {
    return this.paymentsService.createRefund(tenantId, id, data);
  }
}
