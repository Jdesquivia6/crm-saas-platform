import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PERMISSIONS = [
  // CRM
  { module: 'crm', entity: 'contacts', action: 'view', code: 'crm.contacts.view', description: 'Ver contactos' },
  { module: 'crm', entity: 'contacts', action: 'create', code: 'crm.contacts.create', description: 'Crear contactos' },
  { module: 'crm', entity: 'contacts', action: 'update', code: 'crm.contacts.update', description: 'Actualizar contactos' },
  { module: 'crm', entity: 'contacts', action: 'delete', code: 'crm.contacts.delete', description: 'Eliminar contactos' },
  { module: 'crm', entity: 'companies', action: 'view', code: 'crm.companies.view', description: 'Ver empresas' },
  { module: 'crm', entity: 'companies', action: 'create', code: 'crm.companies.create', description: 'Crear empresas' },
  { module: 'crm', entity: 'companies', action: 'update', code: 'crm.companies.update', description: 'Actualizar empresas' },
  { module: 'crm', entity: 'companies', action: 'delete', code: 'crm.companies.delete', description: 'Eliminar empresas' },

  // SALES
  { module: 'sales', entity: 'leads', action: 'view', code: 'sales.leads.view', description: 'Ver leads' },
  { module: 'sales', entity: 'leads', action: 'create', code: 'sales.leads.create', description: 'Crear leads' },
  { module: 'sales', entity: 'leads', action: 'update', code: 'sales.leads.update', description: 'Actualizar leads' },
  { module: 'sales', entity: 'opportunities', action: 'view', code: 'sales.opportunities.view', description: 'Ver oportunidades' },
  { module: 'sales', entity: 'opportunities', action: 'create', code: 'sales.opportunities.create', description: 'Crear oportunidades' },
  { module: 'sales', entity: 'opportunities', action: 'update', code: 'sales.opportunities.update', description: 'Actualizar oportunidades' },
  { module: 'sales', entity: 'quotes', action: 'view', code: 'sales.quotes.view', description: 'Ver cotizaciones' },
  { module: 'sales', entity: 'quotes', action: 'create', code: 'sales.quotes.create', description: 'Crear cotizaciones' },
  { module: 'sales', entity: 'orders', action: 'view', code: 'sales.orders.view', description: 'Ver pedidos' },
  { module: 'sales', entity: 'orders', action: 'create', code: 'sales.orders.create', description: 'Crear pedidos' },

  // SUPPORT
  { module: 'support', entity: 'tickets', action: 'view', code: 'support.tickets.view', description: 'Ver tickets' },
  { module: 'support', entity: 'tickets', action: 'create', code: 'support.tickets.create', description: 'Crear tickets' },
  { module: 'support', entity: 'tickets', action: 'update', code: 'support.tickets.update', description: 'Actualizar tickets' },

  // MARKETING
  { module: 'marketing', entity: 'campaigns', action: 'view', code: 'marketing.campaigns.view', description: 'Ver campañas' },
  { module: 'marketing', entity: 'campaigns', action: 'create', code: 'marketing.campaigns.create', description: 'Crear campañas' },
  { module: 'marketing', entity: 'segments', action: 'view', code: 'marketing.segments.view', description: 'Ver segmentos' },
  { module: 'marketing', entity: 'segments', action: 'create', code: 'marketing.segments.create', description: 'Crear segmentos' },

  // MESSAGING
  { module: 'messaging', entity: 'conversations', action: 'view', code: 'messaging.conversations.view', description: 'Ver conversaciones' },
  { module: 'messaging', entity: 'conversations', action: 'send', code: 'messaging.conversations.send', description: 'Enviar mensajes' },

  // SaaS
  { module: 'saas', entity: 'subscription', action: 'view', code: 'saas.subscription.view', description: 'Ver suscripción' },
  { module: 'saas', entity: 'subscription', action: 'manage', code: 'saas.subscription.manage', description: 'Gestionar suscripción' },

  // IAM
  { module: 'iam', entity: 'users', action: 'view', code: 'iam.users.view', description: 'Ver usuarios' },
  { module: 'iam', entity: 'users', action: 'create', code: 'iam.users.create', description: 'Crear usuarios' },
  { module: 'iam', entity: 'users', action: 'update', code: 'iam.users.update', description: 'Actualizar usuarios' },
  { module: 'iam', entity: 'users', action: 'delete', code: 'iam.users.delete', description: 'Eliminar usuarios' },
  { module: 'iam', entity: 'roles', action: 'view', code: 'iam.roles.view', description: 'Ver roles' },
  { module: 'iam', entity: 'roles', action: 'create', code: 'iam.roles.create', description: 'Crear roles' },
  { module: 'iam', entity: 'roles', action: 'update', code: 'iam.roles.update', description: 'Actualizar roles' },
  { module: 'iam', entity: 'roles', action: 'delete', code: 'iam.roles.delete', description: 'Eliminar roles' },

  // PLATFORM
  { module: 'platform', entity: 'tenants', action: 'view', code: 'platform.tenants.view', description: 'Ver tenants' },
  { module: 'platform', entity: 'tenants', action: 'create', code: 'platform.tenants.create', description: 'Crear tenants' },
  { module: 'platform', entity: 'tenants', action: 'update', code: 'platform.tenants.update', description: 'Actualizar tenants' },

  // ANALYTICS
  { module: 'analytics', entity: 'dashboard', action: 'view', code: 'analytics.dashboard.view', description: 'Ver dashboard' },
  { module: 'analytics', entity: 'reports', action: 'view', code: 'analytics.reports.view', description: 'Ver reportes' },
  { module: 'analytics', entity: 'reports', action: 'export', code: 'analytics.reports.export', description: 'Exportar reportes' },

  // AUTOMATION
  { module: 'automation', entity: 'workflows', action: 'view', code: 'automation.workflows.view', description: 'Ver workflows' },
  { module: 'automation', entity: 'workflows', action: 'create', code: 'automation.workflows.create', description: 'Crear workflows' },
];

async function main() {
  console.log('Seeding permissions...');

  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }

  console.log(`Seeded ${PERMISSIONS.length} permissions`);

  // Create default system roles for demo tenant
  const demoTenant = await prisma.tenant.findUnique({ where: { code: 'demo-corp' } });

  if (demoTenant) {
    const adminRole = await prisma.role.upsert({
      where: { tenantId_code: { tenantId: demoTenant.id, code: 'admin' } },
      update: {},
      create: {
        tenantId: demoTenant.id,
        code: 'admin',
        name: 'Administrador',
        description: 'Acceso total al sistema',
        isSystem: true,
      },
    });

    const viewerRole = await prisma.role.upsert({
      where: { tenantId_code: { tenantId: demoTenant.id, code: 'viewer' } },
      update: {},
      create: {
        tenantId: demoTenant.id,
        code: 'viewer',
        name: 'Visualizador',
        description: 'Solo lectura',
        isSystem: true,
      },
    });

    // Assign all permissions to admin role
    const allPermissions = await prisma.permission.findMany();
    await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
    await prisma.rolePermission.createMany({
      data: allPermissions.map((p) => ({
        roleId: adminRole.id,
        permissionId: p.id,
      })),
    });

    // Assign view permissions to viewer role
    const viewPermissions = allPermissions.filter((p) => p.action === 'view');
    await prisma.rolePermission.deleteMany({ where: { roleId: viewerRole.id } });
    await prisma.rolePermission.createMany({
      data: viewPermissions.map((p) => ({
        roleId: viewerRole.id,
        permissionId: p.id,
      })),
    });

    console.log(`Created roles for tenant ${demoTenant.code}: admin, viewer`);
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
