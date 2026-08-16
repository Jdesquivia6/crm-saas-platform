import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './core/prisma/prisma.module';
import { HealthModule } from './core/health/health.module';
import { PlatformModule } from './platform/platform.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { IamModule } from './iam/iam.module';
import { SaasModule } from './saas/saas.module';
import { CrmModule } from './crm/crm.module';
import { JwtAuthGuard } from './iam/guards/jwt-auth.guard';
import { RolesGuard } from './iam/guards/roles.guard';
import { PermissionsGuard } from './iam/guards/permissions.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    PlatformModule,
    AuditModule,
    AuthModule,
    IamModule,
    SaasModule,
    CrmModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
