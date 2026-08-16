import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { TenantContextService } from '../tenant-context.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly tenantContext: TenantContextService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'] as string;

    if (!tenantId) {
      throw new BadRequestException('Se requiere el header X-Tenant-Id');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(tenantId)) {
      throw new BadRequestException('X-Tenant-Id debe ser un UUID válido');
    }

    this.tenantContext.setTenantId(tenantId);
    request.tenantId = tenantId;

    return true;
  }
}
