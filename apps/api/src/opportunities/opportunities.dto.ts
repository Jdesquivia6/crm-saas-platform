import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsObject, IsArray, Min, Max } from 'class-validator';

export class CreateOpportunityDto {
  @IsString()
  pipelineId: string;

  @IsString()
  stageId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  currencyCode?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  probability?: number;

  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;

  @IsArray()
  @IsOptional()
  contacts?: { contactId: string; role?: string; isPrimary?: boolean }[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class UpdateOpportunityDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  stageId?: string;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  probability?: number;

  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;

  @IsEnum(['OPEN', 'WON', 'LOST', 'ABANDONED'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  lostReason?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class OpportunityQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  pipelineId?: string;

  @IsString()
  @IsOptional()
  stageId?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
