import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApiKeyDto {
  @ApiProperty({ example: 'Production API Key' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: ['crm.contacts.read', 'sales.opportunities.read'] })
  @IsOptional()
  @IsString({ each: true })
  scopes?: string[];
}
