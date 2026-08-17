import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateTaxDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rate: number;

  @IsString()
  @IsOptional()
  type?: string;
}

export class UpdateTaxDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  rate?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
