import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSegmentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsOptional()
  rules?: CreateSegmentRuleDto[];
}

export class CreateSegmentRuleDto {
  @IsString()
  field: string;

  @IsString()
  operator: string;

  @IsString()
  value: string;
}

export class UpdateSegmentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateCampaignDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  segmentId?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsOptional()
  content?: any;

  @IsArray()
  @IsOptional()
  channels?: string[];

  @IsString()
  @IsOptional()
  scheduledAt?: string;
}

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsOptional()
  content?: any;

  @IsString()
  @IsOptional()
  scheduledAt?: string;
}
