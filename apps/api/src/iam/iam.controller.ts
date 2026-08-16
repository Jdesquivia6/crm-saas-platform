import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { IamService } from './iam.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './dto/role.dto';
import { InviteUserDto } from './dto/invitation.dto';
import { CreateApiKeyDto } from './dto/api-key.dto';
import { RequirePermissions } from './decorators/require-permissions.decorator';
import { RequireRoles } from './decorators/require-roles.decorator';

@ApiTags('iam')
@ApiBearerAuth('access-token')
@Controller('iam')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  // ─── USERS ──────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  findUsers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return this.iamService.findUsers({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.iamService.findUserById(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', type: 'string' })
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.iamService.updateUser(id, dto);
  }

  // ─── TENANT USERS ───────────────────────────────────

  @Post('tenants/:tenantId/users/:userId')
  @ApiOperation({ summary: 'Add user to tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  @ApiParam({ name: 'userId', type: 'string' })
  addUserToTenant(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.iamService.addUserToTenant(tenantId, userId);
  }

  @Get('tenants/:tenantId/users')
  @ApiOperation({ summary: 'List tenant users' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  findTenantUsers(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.iamService.findTenantUsers(tenantId);
  }

  @Delete('tenants/:tenantId/users/:userId')
  @ApiOperation({ summary: 'Remove user from tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  @ApiParam({ name: 'userId', type: 'string' })
  removeUserFromTenant(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.iamService.removeUserFromTenant(tenantId, userId);
  }

  // ─── ROLES ──────────────────────────────────────────

  @Post('tenants/:tenantId/roles')
  @ApiOperation({ summary: 'Create a role' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  createRole(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Body() dto: CreateRoleDto,
  ) {
    return this.iamService.createRole(tenantId, dto);
  }

  @Get('tenants/:tenantId/roles')
  @ApiOperation({ summary: 'List roles for tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  findRoles(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.iamService.findRoles(tenantId);
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.iamService.findRoleById(id);
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: 'Update role' })
  @ApiParam({ name: 'id', type: 'string' })
  updateRole(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRoleDto) {
    return this.iamService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'Delete role' })
  @ApiParam({ name: 'id', type: 'string' })
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.iamService.deleteRole(id);
  }

  @Post('roles/:roleId/permissions')
  @ApiOperation({ summary: 'Assign permissions to role' })
  @ApiParam({ name: 'roleId', type: 'string' })
  assignPermissions(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.iamService.assignPermissions(roleId, dto);
  }

  // ─── USER ROLES ─────────────────────────────────────

  @Post('tenant-users/:tenantUserId/roles/:roleId')
  @ApiOperation({ summary: 'Assign role to user in tenant' })
  @ApiParam({ name: 'tenantUserId', type: 'string' })
  @ApiParam({ name: 'roleId', type: 'string' })
  assignRoleToUser(
    @Param('tenantUserId', ParseUUIDPipe) tenantUserId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ) {
    return this.iamService.assignRoleToUser(tenantUserId, roleId);
  }

  @Delete('tenant-users/:tenantUserId/roles/:roleId')
  @ApiOperation({ summary: 'Remove role from user in tenant' })
  @ApiParam({ name: 'tenantUserId', type: 'string' })
  @ApiParam({ name: 'roleId', type: 'string' })
  removeRoleFromUser(
    @Param('tenantUserId', ParseUUIDPipe) tenantUserId: string,
    @Param('roleId', ParseUUIDPipe) roleId: string,
  ) {
    return this.iamService.removeRoleFromUser(tenantUserId, roleId);
  }

  // ─── PERMISSIONS ────────────────────────────────────

  @Get('permissions')
  @ApiOperation({ summary: 'List all permissions' })
  findPermissions() {
    return this.iamService.findPermissions();
  }

  @Get('permissions/module/:module')
  @ApiOperation({ summary: 'List permissions by module' })
  @ApiParam({ name: 'module', type: 'string' })
  findPermissionsByModule(@Param('module') module: string) {
    return this.iamService.findPermissionsByModule(module);
  }

  // ─── INVITATIONS ────────────────────────────────────

  @Post('tenants/:tenantId/invitations')
  @ApiOperation({ summary: 'Invite user to tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  inviteUser(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Body() dto: InviteUserDto,
  ) {
    return this.iamService.inviteUser(tenantId, dto);
  }

  @Get('tenants/:tenantId/invitations')
  @ApiOperation({ summary: 'List invitations for tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  findInvitations(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.iamService.findInvitations(tenantId);
  }

  @Post('invitations/:token/accept')
  @ApiOperation({ summary: 'Accept invitation' })
  @ApiParam({ name: 'token', type: 'string' })
  acceptInvitation(@Param('token') token: string) {
    return this.iamService.acceptInvitation(token);
  }

  @Delete('invitations/:id')
  @ApiOperation({ summary: 'Cancel invitation' })
  @ApiParam({ name: 'id', type: 'string' })
  cancelInvitation(@Param('id', ParseUUIDPipe) id: string) {
    return this.iamService.cancelInvitation(id);
  }

  // ─── API KEYS ───────────────────────────────────────

  @Post('tenants/:tenantId/users/:userId/api-keys')
  @ApiOperation({ summary: 'Create API key' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  @ApiParam({ name: 'userId', type: 'string' })
  createApiKey(
    @Param('tenantId', ParseUUIDPipe) tenantId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateApiKeyDto,
  ) {
    return this.iamService.createApiKey(tenantId, userId, dto);
  }

  @Get('tenants/:tenantId/api-keys')
  @ApiOperation({ summary: 'List API keys for tenant' })
  @ApiParam({ name: 'tenantId', type: 'string' })
  findApiKeys(@Param('tenantId', ParseUUIDPipe) tenantId: string) {
    return this.iamService.findApiKeys(tenantId);
  }

  @Delete('api-keys/:id')
  @ApiOperation({ summary: 'Revoke API key' })
  @ApiParam({ name: 'id', type: 'string' })
  revokeApiKey(@Param('id', ParseUUIDPipe) id: string) {
    return this.iamService.revokeApiKey(id);
  }
}
