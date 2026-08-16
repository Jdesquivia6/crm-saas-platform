import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PlatformService } from './platform.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { CreateSettingDto } from './dto/setting.dto';

@ApiTags('platform')
@Controller('tenants')
export class TenantController {
  constructor(private readonly platformService: PlatformService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant' })
  create(@Body() dto: CreateTenantDto) {
    return this.platformService.createTenant(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tenants' })
  findAll() {
    return this.platformService.findTenants();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.platformService.findTenantById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiParam({ name: 'id', type: 'string' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTenantDto) {
    return this.platformService.updateTenant(id, dto);
  }

  // ─── SETTINGS ─────────────────────────────────────────

  @Get(':id/settings')
  @ApiOperation({ summary: 'Get tenant settings' })
  @ApiParam({ name: 'id', type: 'string' })
  getSettings(@Param('id', ParseUUIDPipe) id: string) {
    return this.platformService.findTenantSettings(id);
  }

  @Post(':id/settings')
  @ApiOperation({ summary: 'Create or update a tenant setting' })
  @ApiParam({ name: 'id', type: 'string' })
  upsertSetting(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateSettingDto,
  ) {
    return this.platformService.upsertSetting(id, dto);
  }

  // ─── BRANCHES ─────────────────────────────────────────

  @Post(':id/branches')
  @ApiOperation({ summary: 'Create a branch for a tenant' })
  @ApiParam({ name: 'id', type: 'string' })
  createBranch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateBranchDto,
  ) {
    return this.platformService.createBranch(id, dto);
  }

  @Get(':id/branches')
  @ApiOperation({ summary: 'List branches for a tenant' })
  @ApiParam({ name: 'id', type: 'string' })
  getBranches(@Param('id', ParseUUIDPipe) id: string) {
    return this.platformService.findBranches(id);
  }

  @Patch(':id/branches/:branchId')
  @ApiOperation({ summary: 'Update a branch' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiParam({ name: 'branchId', type: 'string' })
  updateBranch(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('branchId', ParseUUIDPipe) branchId: string,
    @Body() dto: UpdateBranchDto,
  ) {
    return this.platformService.updateBranch(id, branchId, dto);
  }
}
