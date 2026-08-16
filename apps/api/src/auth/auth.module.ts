import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../iam/strategies/jwt.strategy';
import { KeycloakService } from '../iam/keycloak.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';
import { RolesGuard } from '../iam/guards/roles.guard';
import { PermissionsGuard } from '../iam/guards/permissions.guard';
import { TenantGuard } from '../iam/guards/tenant.guard';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    IamModule,
  ],
  providers: [
    JwtStrategy,
    KeycloakService,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    TenantGuard,
  ],
  exports: [
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    TenantGuard,
    KeycloakService,
  ],
})
export class AuthModule {}
