import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import {
  DetectDuplicatesDto,
  ReviewMatchDto,
  MergeContactsDto,
  RevertMergeDto,
  SearchMatchesDto,
} from './dto/identity.dto';
import { RequirePermissions } from '../iam/decorators/require-permissions.decorator';

@ApiTags('identity')
@ApiBearerAuth('access-token')
@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  // ─── DETECT DUPLICATES ──────────────────────────────

  @Post('detect')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Detect duplicate contacts' })
  detectDuplicates(
    @Query('tenantId') tenantId: string,
    @Body() dto: DetectDuplicatesDto,
  ) {
    return this.identityService.detectDuplicates(tenantId, dto);
  }

  // ─── MATCH CANDIDATES ───────────────────────────────

  @Get('matches')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List match candidates' })
  findMatches(
    @Query('tenantId') tenantId: string,
    @Query() params: SearchMatchesDto,
  ) {
    return this.identityService.findMatchCandidates(tenantId, params);
  }

  @Patch('matches/:id/review')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Review a match candidate' })
  reviewMatch(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReviewMatchDto,
  ) {
    return this.identityService.reviewMatch(tenantId, id, dto);
  }

  // ─── MERGE CONTACTS ─────────────────────────────────

  @Post('merge')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Merge two contacts' })
  mergeContacts(
    @Query('tenantId') tenantId: string,
    @Body() dto: MergeContactsDto,
  ) {
    return this.identityService.mergeContacts(tenantId, dto);
  }

  @Get('merge-history')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'List merge history' })
  getMergeHistory(
    @Query('tenantId') tenantId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.identityService.getMergeHistory(tenantId, {
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('merge-history/:id')
  @RequirePermissions('crm.contacts.view')
  @ApiOperation({ summary: 'Get merge history by ID' })
  getMergeHistoryById(
    @Query('tenantId') tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.identityService.getMergeHistoryById(tenantId, id);
  }

  @Patch('merge-history/:id/revert')
  @RequirePermissions('crm.contacts.update')
  @ApiOperation({ summary: 'Revert a merge' })
  revertMerge(
    @Query('tenantId') tenantId: string,
    @Body() dto: RevertMergeDto,
  ) {
    return this.identityService.revertMerge(tenantId, dto);
  }

  // ─── STATS ──────────────────────────────────────────

  @Get('stats')
  @RequirePermissions('analytics.dashboard.view')
  @ApiOperation({ summary: 'Get identity resolution stats' })
  getStats(@Query('tenantId') tenantId: string) {
    return this.identityService.getIdentityStats(tenantId);
  }
}
