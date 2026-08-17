import { IsString, IsOptional, IsNumber, IsDateString, IsObject, IsArray } from 'class-validator';

export class CreateBillingInvoiceDto {
  @IsString()
  subscriptionId: string;

  @IsString()
  @IsOptional()
  currencyCode?: string;

  @IsArray()
  items?: CreateBillingInvoiceItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  dueDate: string;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;
}

export class CreateBillingInvoiceItemDto {
  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateBillingInvoiceDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class CreateBillingPaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class SubscriptionLifecycleDto {
  @IsString()
  @IsOptional()
  newPlanId?: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
