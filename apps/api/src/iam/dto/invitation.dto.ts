import { IsEmail, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InviteUserDto {
  @ApiProperty({ example: 'newuser@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'sales_manager' })
  @IsString()
  @MaxLength(50)
  roleCode: string;

  @ApiPropertyOptional({ example: 'BR-001' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  branchCode?: string;
}
