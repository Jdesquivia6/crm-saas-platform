import { IsString, IsOptional, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateInvoiceDto {
  @IsString()
  @IsOptional()
  saleId?: string;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  currencyCode?: string;

  @IsArray()
  @IsOptional()
  items?: CreateInvoiceItemDto[];

  @IsString()
  @IsOptional()
  notes?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}

export class CreateInvoiceItemDto {
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

export class UpdateInvoiceDto {
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
