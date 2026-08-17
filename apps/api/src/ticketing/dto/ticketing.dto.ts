import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketCategoryDto {
  @ApiProperty({ example: 'Technical Support' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'For technical issues' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: '#FF5733' })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  @ApiPropertyOptional({ example: 'settings' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;
}

export class UpdateTicketCategoryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateSlaPolicyDto {
  @ApiProperty({ example: 'Standard SLA' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'HIGH' })
  @IsString()
  @MaxLength(10)
  priority: string;

  @ApiProperty({ example: 30 })
  @IsNumber()
  responseTime: number;

  @ApiProperty({ example: 240 })
  @IsNumber()
  resolutionTime: number;
}

export class CreateTicketDto {
  @ApiPropertyOptional({ example: 'uuid-of-contact' })
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-company' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: 'Cannot access dashboard' })
  @IsString()
  @MaxLength(250)
  subject: string;

  @ApiPropertyOptional({ example: 'When I try to login, I get a 500 error' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'HIGH' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  priority?: string;

  @ApiPropertyOptional({ example: 'WHATSAPP' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  channel?: string;
}

export class UpdateTicketDto {
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
  categoryId?: string;
}

export class CreateTicketCommentDto {
  @ApiProperty({ example: 'We are looking into this issue' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isInternal?: boolean;
}

export class AssignTicketDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreateSatisfactionSurveyDto {
  @ApiProperty({ example: 5 })
  @IsNumber()
  rating: number;

  @ApiPropertyOptional({ example: 'Great service!' })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiPropertyOptional({ example: 9 })
  @IsOptional()
  @IsNumber()
  nps?: number;
}

export class SearchTicketsDto {
  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @IsString()
  skip?: string;

  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsString()
  take?: string;

  @ApiPropertyOptional({ example: 'OPEN' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'HIGH' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'uuid-of-category' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-contact' })
  @IsOptional()
  @IsString()
  contactId?: string;
}
