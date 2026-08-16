import * as jwt from 'jsonwebtoken';

const JWT_SECRET = 'dev-secret-change-in-production';

const payload = {
  sub: '00000000-0000-0000-0000-000000000001',
  email: 'admin@demo.com',
  given_name: 'Admin',
  family_name: 'User',
  tenant_id: null,
  tenant_user_id: null,
  realm_access: { roles: ['admin'] },
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
console.log('\n=== JWT Token (copia y pega en Swagger) ===\n');
console.log(token);
console.log('\n============================================\n');
