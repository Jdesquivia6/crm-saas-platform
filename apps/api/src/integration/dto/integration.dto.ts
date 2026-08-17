import { IsString, IsOptional, IsObject, IsNumber, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConnectionDto {
  @ApiProperty({ example: 'WHATSAPP_BUSINESS' })
  @IsString()
  @MaxLength(30)
  provider: string;

  @ApiProperty({ example: 'WhatsApp Business API' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: { accessToken: 'xxx', phoneNumberId: '123', businessAccountId: '456' } })
  @IsObject()
  config: Record<string, any>;
}

export class UpdateConnectionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}

export class CreateTemplateDto {
  @ApiProperty({ example: 'appointment_reminder' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'UTILITY' })
  @IsString()
  @MaxLength(50)
  category: string;

  @ApiPropertyOptional({ example: 'es' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  language?: string;

  @ApiProperty({ example: 'Hola {{name}}, te recordamos tu cita para el {{date}}.' })
  @IsString()
  body: string;

  @ApiPropertyOptional({ example: ['name', 'date'] })
  @IsOptional()
  @IsArray()
  variables?: string[];
}

export class UpdateTemplateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  variables?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  status?: string;
}

export class SendWhatsAppMessageDto {
  @ApiProperty({ example: '+573001234567' })
  @IsString()
  to: string;

  @ApiProperty({ example: 'Hello!' })
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'uuid-of-template' })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({ example: { name: 'Juan', date: '2026-08-20' } })
  @IsOptional()
  @IsObject()
  templateVariables?: Record<string, string>;
}

export class ProcessWebhookDto {
  @ApiProperty({ example: 'WHATSAPP_BUSINESS' })
  @IsString()
  provider: string;

  @ApiProperty()
  payload: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;
}
