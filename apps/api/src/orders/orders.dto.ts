import { IsString, IsOptional, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsOptional()
  quoteId?: string;

  @IsString()
  @IsOptional()
  opportunityId?: string;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsString()
  @IsOptional()
  currencyCode?: string;

  @IsArray()
  @IsOptional()
  items?: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateOrderItemDto {
  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  variantId?: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsNumber()
  @IsOptional()
  discount?: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  cancelReason?: string;
}
