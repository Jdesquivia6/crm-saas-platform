import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('SaaS (e2e)', () => {
  let app: INestApplication;
  let tenantId: string;
  let planId: string;
  let featureId: string;
  let subscriptionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  }, 30000);

  afterAll(async () => { await app.close(); });

  describe('Plans', () => {
    it('POST /api/v1/plans - creates a plan', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/plans')
        .send({ code: 'test-plan', name: 'Test Plan', monthlyPrice: 29.99 })
        .expect(201);
      planId = res.body.id;
      expect(res.body.code).toBe('test-plan');
    });

    it('GET /api/v1/plans - lists plans', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/plans').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/v1/plans/:id - gets plan', async () => {
      const res = await request(app.getHttpServer()).get(`/api/v1/plans/${planId}`).expect(200);
      expect(res.body.id).toBe(planId);
    });
  });

  describe('Features', () => {
    it('POST /api/v1/features - creates a feature', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/features')
        .send({ code: 'test_feature', name: 'Test Feature', module: 'platform', type: 'BOOLEAN' })
        .expect(201);
      featureId = res.body.id;
      expect(res.body.code).toBe('test_feature');
    });

    it('GET /api/v1/features - lists features', async () => {
      const res = await request(app.getHttpServer()).get('/api/v1/features').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Plan Features', () => {
    it('POST /api/v1/plans/:planId/features/:featureId - assigns feature', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/plans/${planId}/features/${featureId}`)
        .send({ isEnabled: true, limitValue: { max: 5 } })
        .expect(201);
      expect(res.body.isEnabled).toBe(true);
    });
  });

  describe('Subscriptions', () => {
    beforeAll(async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/tenants')
        .send({ code: 'saas-test', legalName: 'SaaS Test Corp' });
      tenantId = res.body.id;
    });

    it('POST /api/v1/tenants/:tenantId/subscriptions - creates subscription', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/tenants/${tenantId}/subscriptions`)
        .send({ planId })
        .expect(201);
      subscriptionId = res.body.id;
      expect(res.body.status).toBe('ACTIVE');
    });

    it('GET /api/v1/tenants/:tenantId/subscriptions - lists subscriptions', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${tenantId}/subscriptions`)
        .expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });

  describe('Entitlements', () => {
    it('GET /api/v1/tenants/:tenantId/entitlements - returns entitlements', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${tenantId}/entitlements`)
        .expect(200);
      expect(typeof res.body).toBe('object');
    });

    it('GET /api/v1/tenants/:tenantId/entitlements/test_feature - checks specific', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/tenants/${tenantId}/entitlements/test_feature`)
        .expect(200);
      expect(res.body).toHaveProperty('enabled');
      expect(res.body).toHaveProperty('hasAccess');
    });
  });

  describe('Usage', () => {
    it('POST /api/v1/tenants/:tenantId/usage - tracks usage', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/tenants/${tenantId}/usage`)
        .send({ featureCode: 'test_feature', quantity: 1 })
        .expect(201);
    });
  });
});
