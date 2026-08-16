import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettingDto {
  @ApiProperty({ example: 'theme' })
  @IsString()
  settingKey: string;

  @ApiPropertyOptional({ example: { primaryColor: '#1976d2' } })
  @IsOptional()
  settingValue?: Record<string, unknown>;
}

export class UpdateSettingDto {
  @ApiProperty({ example: { primaryColor: '#1976d2' } })
  settingValue: Record<string, unknown>;
}
