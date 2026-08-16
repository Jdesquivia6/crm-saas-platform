import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  }, 30000);

  afterAll(async () => {
    await app.close();
  });

  describe('Health', () => {
    it('/api/v1/health (GET)', () => {
      return request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.service).toBe('crm-api');
        });
    });
  });

  describe('Tenants', () => {
    let tenantId: string;

    it('POST /api/v1/tenants — creates a tenant', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/tenants')
        .send({
          code: 'test-tenant',
          legalName: 'Test Company S.A.S.',
          email: 'test@test.com',
        })
        .expect(201);

      tenantId = res.body.id;
      expect(res.body.code).toBe('test-tenant');
      expect(res.body.legalName).toBe('Test Company S.A.S.');
      expect(res.body.status).toBe('TRIAL');
    });

    it('POST /api/v1/tenants — rejects duplicate code', () => {
      return request(app.getHttpServer())
        .post('/api/v1/tenants')
        .send({
          code: 'test-tenant',
          legalName: 'Another Company',
        })
        .expect(409);
    });

    it('GET /api/v1/tenants — lists tenants', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/tenants')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/v1/tenants/:id — gets tenant by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${tenantId}`)
        .expect(200);

      expect(res.body.id).toBe(tenantId);
      expect(res.body.code).toBe('test-tenant');
    });

    it('GET /api/v1/tenants/:id — returns 404 for non-existent', () => {
      return request(app.getHttpServer())
        .get('/api/v1/tenants/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('PATCH /api/v1/tenants/:id — updates tenant', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/tenants/${tenantId}`)
        .send({ legalName: 'Updated Company S.A.S.' })
        .expect(200);

      expect(res.body.legalName).toBe('Updated Company S.A.S.');
    });

    it('POST /api/v1/tenants/:id/settings — upserts setting', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/tenants/${tenantId}/settings`)
        .send({
          settingKey: 'theme',
          settingValue: { primaryColor: '#1976d2' },
        })
        .expect(201);

      expect(res.body.settingKey).toBe('theme');
    });

    it('GET /api/v1/tenants/:id/settings — lists settings', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${tenantId}/settings`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/v1/tenants/:id/branches — creates branch', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/tenants/${tenantId}/branches`)
        .send({
          code: 'BR-001',
          name: 'Sede Principal',
        })
        .expect(201);

      expect(res.body.code).toBe('BR-001');
      expect(res.body.name).toBe('Sede Principal');
    });

    it('GET /api/v1/tenants/:id/branches — lists branches', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${tenantId}/branches`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it('POST /api/v1/tenants/:id/branches — rejects duplicate code', () => {
      return request(app.getHttpServer())
        .post(`/api/v1/tenants/${tenantId}/branches`)
        .send({
          code: 'BR-001',
          name: 'Otra Sede',
        })
        .expect(409);
    });
  });

  describe('Audit', () => {
    it('GET /api/v1/audit/logs — returns audit logs', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/audit/logs')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
