import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PLANS = [
  { code: 'starter', name: 'Starter', description: 'Ideal para pequeñas empresas', monthlyPrice: 49.99, annualPrice: 499.99, sortOrder: 1 },
  { code: 'pro', name: 'Pro', description: 'Para empresas en crecimiento', monthlyPrice: 99.99, annualPrice: 999.99, sortOrder: 2 },
  { code: 'business', name: 'Business', description: 'Para empresas establecidas', monthlyPrice: 249.99, annualPrice: 2499.99, sortOrder: 3 },
  { code: 'enterprise', name: 'Enterprise', description: 'Solución empresarial completa', monthlyPrice: null, annualPrice: null, sortOrder: 4 },
];

const FEATURES = [
  // Platform
  { code: 'max_users', name: 'Máximo de usuarios', module: 'platform', type: 'LIMIT' },
  { code: 'max_contacts', name: 'Máximo de contactos', module: 'platform', type: 'LIMIT' },
  { code: 'storage_gb', name: 'Almacenamiento (GB)', module: 'platform', type: 'LIMIT' },
  { code: 'branches', name: 'Sucursales', module: 'platform', type: 'BOOLEAN' },
  { code: 'api_access', name: 'Acceso API', module: 'platform', type: 'BOOLEAN' },

  // Messaging
  { code: 'channels', name: 'Canales de comunicación', module: 'messaging', type: 'LIMIT' },
  { code: 'whatsapp', name: 'WhatsApp Business', module: 'messaging', type: 'BOOLEAN' },
  { code: 'instagram', name: 'Instagram', module: 'messaging', type: 'BOOLEAN' },
  { code: 'facebook', name: 'Facebook Messenger', module: 'messaging', type: 'BOOLEAN' },
  { code: 'email_channel', name: 'Email', module: 'messaging', type: 'BOOLEAN' },

  // Sales
  { code: 'pipelines', name: 'Pipelines de venta', module: 'sales', type: 'LIMIT' },
  { code: 'products', name: 'Productos', module: 'sales', type: 'BOOLEAN' },
  { code: 'quotes', name: 'Cotizaciones', module: 'sales', type: 'BOOLEAN' },
  { code: 'orders', name: 'Pedidos', module: 'sales', type: 'BOOLEAN' },

  // Marketing
  { code: 'campaigns', name: 'Campañas', module: 'marketing', type: 'LIMIT' },
  { code: 'segments', name: 'Segmentos', module: 'marketing', type: 'BOOLEAN' },
  { code: 'automations', name: 'Automatizaciones', module: 'marketing', type: 'LIMIT' },

  // Support
  { code: 'tickets', name: 'Tickets de soporte', module: 'support', type: 'BOOLEAN' },
  { code: 'sla', name: 'Políticas SLA', module: 'support', type: 'BOOLEAN' },

  // AI
  { code: 'ai_assistant', name: 'Asistente IA', module: 'ai', type: 'BOOLEAN' },
  { code: 'ai_insights', name: 'Insights IA', module: 'ai', type: 'BOOLEAN' },

  // Analytics
  { code: 'reports', name: 'Reportes avanzados', module: 'analytics', type: 'BOOLEAN' },
  { code: 'export_reports', name: 'Exportar reportes', module: 'analytics', type: 'BOOLEAN' },
];

const PLAN_FEATURES: Record<string, Record<string, { enabled: boolean; limit?: number }>> = {
  starter: {
    max_users: { enabled: true, limit: 3 },
    max_contacts: { enabled: true, limit: 500 },
    storage_gb: { enabled: true, limit: 1 },
    branches: { enabled: false },
    api_access: { enabled: false },
    channels: { enabled: true, limit: 1 },
    whatsapp: { enabled: false },
    instagram: { enabled: false },
    facebook: { enabled: false },
    email_channel: { enabled: true },
    pipelines: { enabled: true, limit: 1 },
    products: { enabled: false },
    quotes: { enabled: false },
    orders: { enabled: false },
    campaigns: { enabled: true, limit: 1 },
    segments: { enabled: false },
    automations: { enabled: false },
    tickets: { enabled: true },
    sla: { enabled: false },
    ai_assistant: { enabled: false },
    ai_insights: { enabled: false },
    reports: { enabled: true },
    export_reports: { enabled: false },
  },
  pro: {
    max_users: { enabled: true, limit: 10 },
    max_contacts: { enabled: true, limit: 5000 },
    storage_gb: { enabled: true, limit: 10 },
    branches: { enabled: true },
    api_access: { enabled: true },
    channels: { enabled: true, limit: 3 },
    whatsapp: { enabled: true },
    instagram: { enabled: true },
    facebook: { enabled: true },
    email_channel: { enabled: true },
    pipelines: { enabled: true, limit: 3 },
    products: { enabled: true },
    quotes: { enabled: true },
    orders: { enabled: true },
    campaigns: { enabled: true, limit: 5 },
    segments: { enabled: true },
    automations: { enabled: true, limit: 5 },
    tickets: { enabled: true },
    sla: { enabled: true },
    ai_assistant: { enabled: false },
    ai_insights: { enabled: false },
    reports: { enabled: true },
    export_reports: { enabled: true },
  },
  business: {
    max_users: { enabled: true, limit: 50 },
    max_contacts: { enabled: true, limit: 50000 },
    storage_gb: { enabled: true, limit: 100 },
    branches: { enabled: true },
    api_access: { enabled: true },
    channels: { enabled: true, limit: 10 },
    whatsapp: { enabled: true },
    instagram: { enabled: true },
    facebook: { enabled: true },
    email_channel: { enabled: true },
    pipelines: { enabled: true, limit: 10 },
    products: { enabled: true },
    quotes: { enabled: true },
    orders: { enabled: true },
    campaigns: { enabled: true, limit: 20 },
    segments: { enabled: true },
    automations: { enabled: true, limit: 20 },
    tickets: { enabled: true },
    sla: { enabled: true },
    ai_assistant: { enabled: true },
    ai_insights: { enabled: true },
    reports: { enabled: true },
    export_reports: { enabled: true },
  },
  enterprise: {
    max_users: { enabled: true }, // unlimited
    max_contacts: { enabled: true },
    storage_gb: { enabled: true },
    branches: { enabled: true },
    api_access: { enabled: true },
    channels: { enabled: true },
    whatsapp: { enabled: true },
    instagram: { enabled: true },
    facebook: { enabled: true },
    email_channel: { enabled: true },
    pipelines: { enabled: true },
    products: { enabled: true },
    quotes: { enabled: true },
    orders: { enabled: true },
    campaigns: { enabled: true },
    segments: { enabled: true },
    automations: { enabled: true },
    tickets: { enabled: true },
    sla: { enabled: true },
    ai_assistant: { enabled: true },
    ai_insights: { enabled: true },
    reports: { enabled: true },
    export_reports: { enabled: true },
  },
};

async function main() {
  console.log('Seeding plans and features...');

  // Create features
  for (const f of FEATURES) {
    await prisma.feature.upsert({
      where: { code: f.code },
      update: {},
      create: f,
    });
  }
  console.log(`Seeded ${FEATURES.length} features`);

  // Create plans
  for (const p of PLANS) {
    await prisma.plan.upsert({
      where: { code: p.code },
      update: {},
      create: p as any,
    });
  }
  console.log(`Seeded ${PLANS.length} plans`);

  // Assign features to plans
  for (const [planCode, features] of Object.entries(PLAN_FEATURES)) {
    const plan = await prisma.plan.findUnique({ where: { code: planCode } });
    if (!plan) continue;

    for (const [featureCode, config] of Object.entries(features)) {
      const feature = await prisma.feature.findUnique({ where: { code: featureCode } });
      if (!feature) continue;

      await prisma.planFeature.upsert({
        where: { planId_featureId: { planId: plan.id, featureId: feature.id } },
        update: {},
        create: {
          planId: plan.id,
          featureId: feature.id,
          isEnabled: config.enabled,
          limitValue: config.limit ? { max: config.limit } : undefined,
        },
      });
    }
  }
  console.log('Assigned features to plans');

  // Create subscription for demo tenant
  const demoTenant = await prisma.tenant.findUnique({ where: { code: 'demo-corp' } });
  if (demoTenant) {
    const starterPlan = await prisma.plan.findUnique({ where: { code: 'starter' } });
    if (starterPlan) {
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await prisma.subscription.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
          id: '00000000-0000-0000-0000-000000000001',
          tenantId: demoTenant.id,
          planId: starterPlan.id,
          status: 'ACTIVE',
          billingCycle: 'MONTHLY',
          startDate: now,
          currentPeriodStart: now,
          currentPeriodEnd: periodEnd,
        },
      });
      console.log('Created subscription for demo-corp');
    }
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
