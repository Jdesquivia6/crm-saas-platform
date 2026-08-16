import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private tenantId: string | null = null;

  setTenantId(tenantId: string) {
    this.tenantId = tenantId;
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  requireTenantId(): string {
    if (!this.tenantId) {
      throw new Error('Tenant context no establecido');
    }
    return this.tenantId;
  }
}
