import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'sales_manager' })
  @IsString()
  @MaxLength(50)
  code: string;

  @ApiProperty({ example: 'Gerente de Ventas' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Gestiona el equipo de ventas' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;
}

export class UpdateRoleDto {
  @ApiPropertyOptional({ example: 'Gerente de Ventas' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: 'Gestiona el equipo de ventas' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  description?: string;
}

export class AssignPermissionsDto {
  @ApiProperty({ example: ['crm.contacts.view', 'crm.contacts.create'] })
  @IsString({ each: true })
  permissionCodes: string[];
}
