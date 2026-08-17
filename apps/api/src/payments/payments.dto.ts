import { IsString, IsOptional, IsNumber, IsObject, IsDateString } from 'class-validator';

export class CreatePaymentIntentDto {
  @IsString()
  @IsOptional()
  invoiceId?: string;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsString()
  @IsOptional()
  providerAccountId?: string;

  @IsString()
  @IsOptional()
  currencyCode?: string;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}

export class UpdatePaymentIntentDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class CreateRefundDto {
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ConfirmPaymentDto {
  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsObject()
  @IsOptional()
  providerData?: Record<string, any>;
}
