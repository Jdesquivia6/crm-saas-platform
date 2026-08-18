import { IsString, IsOptional, IsObject, IsEnum, IsInt, IsDecimal } from 'class-validator';

export class TrackEventDto {
  @IsString()
  eventType: string;

  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class GetMetricsDto {
  @IsString()
  dateFrom: string;

  @IsString()
  dateTo: string;

  @IsOptional()
  @IsString()
  granularity?: 'day' | 'week' | 'month';
}

export class GetDashboardDto {
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;
}
