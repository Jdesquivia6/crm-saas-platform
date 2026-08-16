import { IsString, IsOptional, IsNumber, IsArray, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DetectDuplicatesDto {
  @ApiPropertyOptional({ example: 'uuid-of-contact' })
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional({ example: 0.7 })
  @IsOptional()
  @IsNumber()
  minConfidence?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  includeDismissed?: boolean;
}

export class ReviewMatchDto {
  @ApiProperty({ example: 'MERGED' })
  @IsString()
  @MaxLength(20)
  status: string;

  @ApiPropertyOptional({ example: 'Merged into primary contact' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  dismissReason?: string;
}

export class MergeContactsDto {
  @ApiProperty({ example: 'uuid-of-source-contact' })
  @IsString()
  sourceContactId: string;

  @ApiProperty({ example: 'uuid-of-target-contact' })
  @IsString()
  targetContactId: string;

  @ApiPropertyOptional({ example: 'KEEP_TARGET' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  mergeStrategy?: string;

  @ApiPropertyOptional({ example: { firstName: 'source', email: 'target' } })
  @IsOptional()
  fieldOverrides?: Record<string, string>;
}

export class RevertMergeDto {
  @ApiProperty({ example: 'uuid-of-merge-history' })
  @IsString()
  mergeHistoryId: string;

  @ApiProperty({ example: 'Data was incorrect' })
  @IsString()
  @MaxLength(500)
  reason: string;
}

export class SearchMatchesDto {
  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @IsString()
  skip?: string;

  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsString()
  take?: string;

  @ApiPropertyOptional({ example: 'PENDING' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'EXACT' })
  @IsOptional()
  @IsString()
  matchType?: string;
}
