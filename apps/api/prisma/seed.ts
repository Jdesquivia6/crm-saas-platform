import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const tenant = await prisma.tenant.upsert({
    where: { code: 'demo-corp' },
    update: {},
    create: {
      code: 'demo-corp',
      legalName: 'Demo Corporation S.A.S.',
      tradeName: 'Demo Corp',
      email: 'admin@demo.com',
      phone: '+57 300 123 4567',
      countryCode: 'CO',
      state: 'Bogota D.C.',
      city: 'Bogota',
      currencyCode: 'COP',
      timezone: 'America/Bogota',
      locale: 'es-CO',
      status: 'ACTIVE',
    },
  });

  console.log(`Tenant created: ${tenant.id} (${tenant.code})`);

  await prisma.branch.upsert({
    where: { tenantId_code: { tenantId: tenant.id, code: 'HQ' } },
    update: {},
    create: {
      tenantId: tenant.id,
      code: 'HQ',
      name: 'Oficina Principal',
      address: 'Calle 100 #15-20',
      city: 'Bogota',
      state: 'Bogota D.C.',
      countryCode: 'CO',
    },
  });

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
