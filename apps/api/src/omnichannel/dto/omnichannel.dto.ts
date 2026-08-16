import { IsString, IsOptional, IsBoolean, IsNumber, IsObject, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChannelAccountDto {
  @ApiProperty({ example: 'WHATSAPP' })
  @IsString()
  @MaxLength(30)
  channelType: string;

  @ApiProperty({ example: 'WhatsApp Business' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ example: { phoneNumber: '+573001234567', apiKey: 'xxx' } })
  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}

export class UpdateChannelAccountDto {
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

export class CreateConversationDto {
  @ApiPropertyOptional({ example: 'uuid-of-contact' })
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiProperty({ example: 'WHATSAPP' })
  @IsString()
  @MaxLength(30)
  channelType: string;

  @ApiPropertyOptional({ example: 'uuid-of-channel-account' })
  @IsOptional()
  @IsString()
  channelAccountId?: string;

  @ApiPropertyOptional({ example: 'external-id-from-provider' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  externalId?: string;

  @ApiPropertyOptional({ example: 'Support inquiry' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  subject?: string;
}

export class UpdateConversationDto {
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
}

export class SendMessageDto {
  @ApiProperty({ example: 'Hello, how can I help you?' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'TEXT' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contentType?: string;

  @ApiPropertyOptional({ example: 'USER' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  senderType?: string;

  @ApiPropertyOptional({ example: 'uuid-of-sender' })
  @IsOptional()
  @IsString()
  senderId?: string;
}

export class CreateCannedResponseDto {
  @ApiProperty({ example: '/greeting' })
  @IsString()
  @MaxLength(50)
  shortcut: string;

  @ApiProperty({ example: 'Greeting Response' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Hello! Thank you for contacting us. How can I help you today?' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 'support' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}

export class UpdateCannedResponseDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  shortcut?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SearchConversationsDto {
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

  @ApiPropertyOptional({ example: 'WHATSAPP' })
  @IsOptional()
  @IsString()
  channelType?: string;

  @ApiPropertyOptional({ example: 'uuid-of-contact' })
  @IsOptional()
  @IsString()
  contactId?: string;
}
