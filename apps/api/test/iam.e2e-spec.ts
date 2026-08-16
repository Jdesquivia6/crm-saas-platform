import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('IAM (e2e)', () => {
  let app: INestApplication;
  let tenantId: string;
  let userId: string;
  let roleId: string;
  let tenantUserId: string;

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

  describe('Setup: Create tenant and user', () => {
    it('creates a tenant', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/tenants')
        .send({ code: 'iam-test', legalName: 'IAM Test Corp' })
        .expect(201);

      tenantId = res.body.id;
    });

    it('creates a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/iam/users')
        .send({ email: 'test@iam.com', firstName: 'Test', lastName: 'User' })
        .expect(201);

      userId = res.body.id;
    });

    it('adds user to tenant', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/iam/tenants/${tenantId}/users/${userId}`)
        .expect(201);

      tenantUserId = res.body.id;
    });
  });

  describe('Permissions', () => {
    it('GET /api/v1/iam/permissions - lists all permissions', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/iam/permissions')
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('code');
      expect(res.body[0]).toHaveProperty('module');
    });
  });

  describe('Roles', () => {
    it('POST /api/v1/iam/tenants/:tenantId/roles - creates a role', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/iam/tenants/${tenantId}/roles`)
        .send({ code: 'test_role', name: 'Test Role', description: 'Test' })
        .expect(201);

      roleId = res.body.id;
      expect(res.body.code).toBe('test_role');
    });

    it('GET /api/v1/iam/tenants/:tenantId/roles - lists roles', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/iam/tenants/${tenantId}/roles`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('POST /api/v1/iam/roles/:roleId/permissions - assigns permissions', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/iam/roles/${roleId}/permissions`)
        .send({ permissionCodes: ['crm.contacts.view', 'crm.contacts.create'] })
        .expect(201);

      expect(res.body.rolePermissions).toHaveLength(2);
    });
  });

  describe('User Roles', () => {
    it('POST /api/v1/iam/tenant-users/:tenantUserId/roles/:roleId - assigns role', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/iam/tenant-users/${tenantUserId}/roles/${roleId}`)
        .expect(201);

      expect(res.body.role.code).toBe('test_role');
    });

    it('GET /api/v1/iam/tenants/:tenantId/users - lists tenant users with roles', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/iam/tenants/${tenantId}/users`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].userRoles).toHaveLength(1);
    });
  });

  describe('Invitations', () => {
    let invitationToken: string;

    it('POST /api/v1/iam/tenants/:tenantId/invitations - creates invitation', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/iam/tenants/${tenantId}/invitations`)
        .send({ email: 'invite@iam.com', roleCode: 'test_role' })
        .expect(201);

      invitationToken = res.body.token;
      expect(res.body.status).toBe('PENDING');
    });

    it('GET /api/v1/iam/tenants/:tenantId/invitations - lists invitations', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/iam/tenants/${tenantId}/invitations`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it('POST /api/v1/iam/invitations/:token/accept - accepts invitation', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/iam/invitations/${invitationToken}/accept`)
        .expect(201);

      expect(res.body.tenantId).toBe(tenantId);
      expect(res.body.email).toBe('invite@iam.com');
    });
  });

  describe('API Keys', () => {
    it('POST /api/v1/iam/tenants/:tenantId/users/:userId/api-keys - creates key', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/iam/tenants/${tenantId}/users/${userId}/api-keys`)
        .send({ name: 'Test Key', scopes: ['crm.contacts.view'] })
        .expect(201);

      expect(res.body.rawKey).toBeDefined();
      expect(res.body.keyPrefix).toBeDefined();
    });

    it('GET /api/v1/iam/tenants/:tenantId/api-keys - lists keys', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/v1/iam/tenants/${tenantId}/api-keys`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty('keyPrefix');
      expect(res.body[0]).not.toHaveProperty('keyHash');
    });
  });
});
