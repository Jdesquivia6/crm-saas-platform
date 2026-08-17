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
import { Client360Module } from './client360/client360.module';
import { IdentityModule } from './identity/identity.module';
import { OmnichannelModule } from './omnichannel/omnichannel.module';
import { IntegrationModule } from './integration/integration.module';
import { TicketingModule } from './ticketing/ticketing.module';
import { LeadsModule } from './leads/leads.module';
import { PipelinesModule } from './pipelines/pipelines.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';
import { ProductsModule } from './products/products.module';
import { QuotesModule } from './quotes/quotes.module';
import { OrdersModule } from './orders/orders.module';
import { SalesModule } from './sales/sales.module';
import { InvoicesModule } from './invoices/invoices.module';
import { PaymentsModule } from './payments/payments.module';
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
    Client360Module,
    IdentityModule,
    OmnichannelModule,
    IntegrationModule,
    TicketingModule,
    LeadsModule,
    PipelinesModule,
    OpportunitiesModule,
    ProductsModule,
    QuotesModule,
    OrdersModule,
    SalesModule,
    InvoicesModule,
    PaymentsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
