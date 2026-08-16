import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { CreateRoleDto, UpdateRoleDto, AssignPermissionsDto } from './dto/role.dto';
import { InviteUserDto } from './dto/invitation.dto';
import { CreateApiKeyDto } from './dto/api-key.dto';
import { User, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as crypto from 'crypto';

@Injectable()
export class IamService {
  private readonly logger = new Logger(IamService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── USERS ──────────────────────────────────────────

  async findOrCreateUser(data: {
    email: string;
    keycloakId?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    let user = await this.prisma.user.findFirst({
      where: { email: data.email, deletedAt: null },
    });

    if (user) {
      if (data.keycloakId && !user.keycloakId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { keycloakId: data.keycloakId },
        });
      }
      return user;
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        keycloakId: data.keycloakId,
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });
  }

  async findUsers(params?: { skip?: number; take?: number }) {
    return this.prisma.user.findMany({
      where: { deletedAt: null },
      skip: params?.skip || 0,
      take: params?.take || 50,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException(`Usuario ${id} no encontrado`);
    }
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async softDeleteUser(id: string) {
    await this.findUserById(id);
    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ─── TENANT USERS ───────────────────────────────────

  async addUserToTenant(tenantId: string, userId: string) {
    const existing = await this.prisma.tenantUser.findUnique({
      where: { tenantId_userId: { tenantId, userId } },
    });

    if (existing) {
      throw new ConflictException('El usuario ya pertenece a este tenant');
    }

    return this.prisma.tenantUser.create({
      data: { tenantId, userId },
    });
  }

  async findTenantUsers(tenantId: string) {
    return this.prisma.tenantUser.findMany({
      where: { tenantId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true },
        },
        userRoles: {
          include: { role: { select: { id: true, code: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async removeUserFromTenant(tenantId: string, userId: string) {
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: { tenantId_userId: { tenantId, userId } },
    });

    if (!tenantUser) {
      throw new NotFoundException('Usuario no encontrado en este tenant');
    }

    return this.prisma.tenantUser.delete({
      where: { id: tenantUser.id },
    });
  }

  // ─── ROLES ──────────────────────────────────────────

  async createRole(tenantId: string, dto: CreateRoleDto) {
    const existing = await this.prisma.role.findFirst({
      where: { tenantId, code: dto.code },
    });

    if (existing) {
      throw new ConflictException(`El rol '${dto.code}' ya existe en este tenant`);
    }

    return this.prisma.role.create({
      data: {
        tenantId,
        code: dto.code,
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async findRoles(tenantId: string) {
    return this.prisma.role.findMany({
      where: { tenantId },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
        _count: { select: { userRoles: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRoleById(id: string) {
    const role = await this.prisma.role.findFirst({
      where: { id },
      include: {
        rolePermissions: {
          include: { permission: true },
        },
      },
    });
    if (!role) {
      throw new NotFoundException(`Rol ${id} no encontrado`);
    }
    return role;
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    await this.findRoleById(id);
    return this.prisma.role.update({
      where: { id },
      data: dto,
    });
  }

  async deleteRole(id: string) {
    const role = await this.findRoleById(id);
    if (role.isSystem) {
      throw new BadRequestException('No se puede eliminar un rol del sistema');
    }
    const userCount = await this.prisma.userRole.count({ where: { roleId: id } });
    if (userCount > 0) {
      throw new BadRequestException('No se puede eliminar un rol asignado a usuarios');
    }
    return this.prisma.role.delete({ where: { id } });
  }

  async assignPermissions(roleId: string, dto: AssignPermissionsDto) {
    await this.findRoleById(roleId);

    const permissions = await this.prisma.permission.findMany({
      where: { code: { in: dto.permissionCodes } },
    });

    if (permissions.length !== dto.permissionCodes.length) {
      throw new BadRequestException('Algunos códigos de permiso no son válidos');
    }

    await this.prisma.rolePermission.deleteMany({ where: { roleId } });

    await this.prisma.rolePermission.createMany({
      data: permissions.map((p) => ({
        roleId,
        permissionId: p.id,
      })),
    });

    return this.findRoleById(roleId);
  }

  // ─── USER ROLES ─────────────────────────────────────

  async assignRoleToUser(tenantUserId: string, roleId: string) {
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: { id: tenantUserId },
    });
    if (!tenantUser) {
      throw new NotFoundException('TenantUser no encontrado');
    }

    const role = await this.findRoleById(roleId);

    const existing = await this.prisma.userRole.findUnique({
      where: { tenantUserId_roleId: { tenantUserId, roleId } },
    });

    if (existing) {
      throw new ConflictException('El usuario ya tiene este rol');
    }

    return this.prisma.userRole.create({
      data: { tenantUserId, roleId },
      include: { role: true },
    });
  }

  async removeRoleFromUser(tenantUserId: string, roleId: string) {
    const userRole = await this.prisma.userRole.findUnique({
      where: { tenantUserId_roleId: { tenantUserId, roleId } },
    });

    if (!userRole) {
      throw new NotFoundException('Rol no asignado al usuario');
    }

    return this.prisma.userRole.delete({
      where: { id: userRole.id },
    });
  }

  // ─── PERMISSIONS ────────────────────────────────────

  async findPermissions() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { entity: 'asc' }, { action: 'asc' }],
    });
  }

  async findPermissionsByModule(module: string) {
    return this.prisma.permission.findMany({
      where: { module },
      orderBy: [{ entity: 'asc' }, { action: 'asc' }],
    });
  }

  // ─── INVITATIONS ────────────────────────────────────

  async inviteUser(tenantId: string, dto: InviteUserDto, invitedById?: string) {
    const existingInvitation = await this.prisma.userInvitation.findFirst({
      where: {
        tenantId,
        email: dto.email,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      throw new ConflictException('Ya existe una invitación pendiente para este email');
    }

    const role = await this.prisma.role.findFirst({
      where: { tenantId, code: dto.roleCode },
    });
    if (!role) {
      throw new BadRequestException(`El rol '${dto.roleCode}' no existe en este tenant`);
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.userInvitation.create({
      data: {
        tenantId,
        email: dto.email,
        roleCode: dto.roleCode,
        invitedById,
        token,
        expiresAt,
      },
    });
  }

  async findInvitations(tenantId: string) {
    return this.prisma.userInvitation.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptInvitation(token: string) {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }

    if (invitation.status !== 'PENDING') {
      throw new BadRequestException('La invitación ya fue aceptada o expiró');
    }

    if (new Date() > invitation.expiresAt) {
      throw new BadRequestException('La invitación ha expirado');
    }

    await this.prisma.userInvitation.update({
      where: { id: invitation.id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
    });

    return { tenantId: invitation.tenantId, email: invitation.email, roleCode: invitation.roleCode };
  }

  async cancelInvitation(id: string) {
    const invitation = await this.prisma.userInvitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException('Invitación no encontrada');
    }

    return this.prisma.userInvitation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }

  // ─── API KEYS ───────────────────────────────────────

  async createApiKey(tenantId: string, userId: string, dto: CreateApiKeyDto) {
    const rawKey = `crm_${uuidv4().replace(/-/g, '')}`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
    const keyPrefix = rawKey.substring(0, 10);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        tenantId,
        userId,
        name: dto.name,
        keyHash,
        keyPrefix,
        scopes: dto.scopes || [],
      },
    });

    return { ...apiKey, rawKey };
  }

  async findApiKeys(tenantId: string) {
    return this.prisma.apiKey.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        scopes: true,
        status: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revokeApiKey(id: string) {
    const apiKey = await this.prisma.apiKey.findUnique({ where: { id } });
    if (!apiKey) {
      throw new NotFoundException('API Key no encontrada');
    }

    return this.prisma.apiKey.update({
      where: { id },
      data: { status: 'REVOKED' },
    });
  }

  // ─── USER PERMISSIONS RESOLUTION ────────────────────

  async resolveUserPermissions(tenantId: string, userId: string): Promise<string[]> {
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: { tenantId_userId: { tenantId, userId } },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    if (!tenantUser) {
      return [];
    }

    const permissions = new Set<string>();
    for (const ur of tenantUser.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissions.add(rp.permission.code);
      }
    }

    return Array.from(permissions);
  }

  async resolveUserRoles(tenantId: string, userId: string): Promise<string[]> {
    const tenantUser = await this.prisma.tenantUser.findUnique({
      where: { tenantId_userId: { tenantId, userId } },
      include: {
        userRoles: {
          include: { role: { select: { code: true } } },
        },
      },
    });

    if (!tenantUser) {
      return [];
    }

    return tenantUser.userRoles.map((ur) => ur.role.code);
  }
}
