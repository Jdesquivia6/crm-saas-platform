import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/tenant.dto';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { CreateSettingDto, UpdateSettingDto } from './dto/setting.dto';
import { Prisma, Tenant } from '@prisma/client';

@Injectable()
export class PlatformService {
  private readonly logger = new Logger(PlatformService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── TENANTS ──────────────────────────────────────────

  async createTenant(dto: CreateTenantDto): Promise<Tenant> {
    const existing = await this.prisma.tenant.findUnique({ where: { code: dto.code } });
    if (existing) {
      throw new ConflictException(`Tenant code '${dto.code}' already exists`);
    }

    const tenant = await this.prisma.tenant.create({
      data: {
        code: dto.code,
        legalName: dto.legalName,
        tradeName: dto.tradeName,
        taxId: dto.taxId,
        email: dto.email,
        phone: dto.phone,
        countryCode: dto.countryCode,
        state: dto.state,
        city: dto.city,
        address: dto.address,
        postalCode: dto.postalCode,
        currencyCode: dto.currencyCode || 'COP',
        timezone: dto.timezone || 'America/Bogota',
        locale: dto.locale || 'es-CO',
      },
    });

    this.logger.log(`Tenant created: ${tenant.id} (${tenant.code})`);
    return tenant;
  }

  async findTenants(params?: {
    skip?: number;
    take?: number;
    where?: Prisma.TenantWhereInput;
  }): Promise<Tenant[]> {
    const { skip = 0, take = 50, where = {} } = params || {};
    return this.prisma.tenant.findMany({
      skip,
      take,
      where: { deletedAt: null, ...where },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findTenantById(id: string): Promise<Tenant> {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, deletedAt: null },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant ${id} not found`);
    }
    return tenant;
  }

  async updateTenant(id: string, dto: UpdateTenantDto): Promise<Tenant> {
    await this.findTenantById(id);

    return this.prisma.tenant.update({
      where: { id },
      data: {
        legalName: dto.legalName,
        tradeName: dto.tradeName,
        taxId: dto.taxId,
        email: dto.email,
        phone: dto.phone,
        countryCode: dto.countryCode,
        state: dto.state,
        city: dto.city,
        address: dto.address,
        postalCode: dto.postalCode,
        currencyCode: dto.currencyCode,
        timezone: dto.timezone,
        locale: dto.locale,
        status: dto.status,
      },
    });
  }

  async softDeleteTenant(id: string): Promise<void> {
    await this.findTenantById(id);
    await this.prisma.tenant.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    this.logger.log(`Tenant soft-deleted: ${id}`);
  }

  // ─── SETTINGS ─────────────────────────────────────────

  async findTenantSettings(tenantId: string) {
    await this.findTenantById(tenantId);
    return this.prisma.tenantSetting.findMany({
      where: { tenantId },
      orderBy: { settingKey: 'asc' },
    });
  }

  async upsertSetting(tenantId: string, dto: CreateSettingDto) {
    await this.findTenantById(tenantId);

    return this.prisma.tenantSetting.upsert({
      where: {
        tenantId_settingKey: {
          tenantId,
          settingKey: dto.settingKey,
        },
      },
      create: {
        tenantId,
        settingKey: dto.settingKey,
        settingValue: dto.settingValue as Prisma.InputJsonValue,
      },
      update: {
        settingValue: dto.settingValue as Prisma.InputJsonValue,
      },
    });
  }

  // ─── BRANCHES ─────────────────────────────────────────

  async createBranch(tenantId: string, dto: CreateBranchDto) {
    await this.findTenantById(tenantId);

    const existing = await this.prisma.branch.findFirst({
      where: { tenantId, code: dto.code, deletedAt: null },
    });
    if (existing) {
      throw new ConflictException(`Branch code '${dto.code}' already exists for this tenant`);
    }

    return this.prisma.branch.create({
      data: {
        tenantId,
        code: dto.code,
        name: dto.name,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        countryCode: dto.countryCode,
        phone: dto.phone,
        email: dto.email,
      },
    });
  }

  async findBranches(tenantId: string) {
    await this.findTenantById(tenantId);
    return this.prisma.branch.findMany({
      where: { tenantId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBranchById(tenantId: string, branchId: string) {
    const branch = await this.prisma.branch.findFirst({
      where: { id: branchId, tenantId, deletedAt: null },
    });
    if (!branch) {
      throw new NotFoundException(`Branch ${branchId} not found for tenant ${tenantId}`);
    }
    return branch;
  }

  async updateBranch(tenantId: string, branchId: string, dto: UpdateBranchDto) {
    await this.findBranchById(tenantId, branchId);

    return this.prisma.branch.update({
      where: { id: branchId },
      data: {
        name: dto.name,
        address: dto.address,
        city: dto.city,
        state: dto.state,
        countryCode: dto.countryCode,
        phone: dto.phone,
        email: dto.email,
        isActive: dto.isActive,
      },
    });
  }
}
