import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomFieldDto {
  @ApiProperty({ example: 'CONTACT' })
  @IsString()
  @MaxLength(30)
  entityType: string;

  @ApiProperty({ example: 'company_size' })
  @IsString()
  @MaxLength(100)
  fieldName: string;

  @ApiProperty({ example: 'SELECT' })
  @IsString()
  @MaxLength(30)
  fieldType: string;

  @ApiProperty({ example: 'Company Size' })
  @IsString()
  @MaxLength(200)
  label: string;

  @ApiPropertyOptional({ example: 'Size of the company' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ example: ['1-10', '11-50', '51-200'] })
  @IsOptional()
  @IsArray()
  options?: { value: string; label: string; color?: string }[];
}

export class UpdateCustomFieldDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  label?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class SetCustomFieldValueDto {
  @ApiProperty({ example: 'uuid-of-custom-field' })
  @IsString()
  customFieldId: string;

  @ApiProperty({ example: '51-200' })
  value: any;
}

export class CreateActivityDto {
  @ApiPropertyOptional({ example: 'uuid-of-contact' })
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-company' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ example: 'CALL' })
  @IsString()
  @MaxLength(30)
  activityType: string;

  @ApiPropertyOptional({ example: 'OUTBOUND' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  direction?: string;

  @ApiPropertyOptional({ example: 'Follow up on proposal' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  subject?: string;

  @ApiPropertyOptional({ example: 'Discussed pricing options' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'CONNECTED' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  outcome?: string;

  @ApiPropertyOptional()
  @IsOptional()
  scheduledAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  completedAt?: string;

  @ApiPropertyOptional({ example: 300 })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiPropertyOptional({ example: 'MEDIUM' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  priority?: string;

  @ApiPropertyOptional({ example: 'OPEN' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}

export class UpdateActivityDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(250)
  subject?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  outcome?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(10)
  priority?: string;

  @ApiPropertyOptional()
  @IsOptional()
  completedAt?: string;
}

export class CreateConsentDto {
  @ApiProperty({ example: 'EMAIL' })
  @IsString()
  @MaxLength(30)
  channel: string;

  @ApiPropertyOptional({ example: 'GRANTED' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;

  @ApiPropertyOptional({ example: 'WEB_FORM' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  source?: string;

  @ApiPropertyOptional({ example: 'Marketing communications' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  purpose?: string;

  @ApiPropertyOptional({ example: 'CONSENT' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  legalBasis?: string;
}

export class GetTimelineDto {
  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @IsString()
  skip?: string;

  @ApiPropertyOptional({ example: '50' })
  @IsOptional()
  @IsString()
  take?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'CALL,EMAIL,MEETING' })
  @IsOptional()
  @IsString()
  types?: string;
}
