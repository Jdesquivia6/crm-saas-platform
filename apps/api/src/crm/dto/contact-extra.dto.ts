import { IsString, IsOptional, IsBoolean, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactIdentifierDto {
  @ApiProperty({ example: 'EMAIL' })
  @IsString()
  @MaxLength(30)
  identifierType: string;

  @ApiProperty({ example: 'juan@company.com' })
  @IsString()
  @MaxLength(250)
  value: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class CreateContactAddressDto {
  @ApiProperty({ example: 'WORK' })
  @IsString()
  @MaxLength(30)
  addressType: string;

  @ApiPropertyOptional({ example: 'Calle 123 #45-67' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  street?: string;

  @ApiPropertyOptional({ example: 'Bogota' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'CO' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  countryCode?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class AssignContactDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsString()
  userId: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class LinkCompanyDto {
  @ApiProperty({ example: 'uuid-of-company' })
  @IsString()
  companyId: string;

  @ApiPropertyOptional({ example: 'EMPLOYEE' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class SearchContactsDto {
  @ApiPropertyOptional({ example: 'juan' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 'LEAD' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'uuid-of-owner' })
  @IsOptional()
  @IsString()
  ownerUserId?: string;

  @ApiPropertyOptional({ example: 'vip' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsString()
  skip?: string;

  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsString()
  take?: string;
}
