import { IsString, IsOptional, IsBoolean, IsObject, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFeatureDto {
  @ApiProperty({ example: 'max_users' })
  @IsString()
  @MaxLength(100)
  code: string;

  @ApiProperty({ example: 'Máximo de usuarios' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Número máximo de usuarios permitidos' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'platform' })
  @IsString()
  @MaxLength(50)
  module: string;

  @ApiPropertyOptional({ example: 'LIMIT', description: 'BOOLEAN, LIMIT, o QUOTA' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  type?: string;

  @ApiPropertyOptional({ example: { max: 5 } })
  @IsOptional()
  @IsObject()
  defaultValue?: Record<string, unknown>;
}

export class AssignFeatureToPlanDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isEnabled: boolean;

  @ApiPropertyOptional({ example: { max: 5 } })
  @IsOptional()
  @IsObject()
  limitValue?: Record<string, unknown>;
}

export class OverrideFeatureDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  isEnabled: boolean;

  @ApiPropertyOptional({ example: { max: 10 } })
  @IsOptional()
  @IsObject()
  limitValue?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'Upgrade manual' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  reason?: string;
}
