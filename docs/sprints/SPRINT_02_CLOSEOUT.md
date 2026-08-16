# Sprint 2 — IAM: Usuarios, Roles y Permisos

## Objetivo

Implementar el sistema de gestión de identidades, roles y permisos con integración Keycloak.

## Funcionalidades implementadas

- Gestión de usuarios (CRUD)
- Asociación usuario-tenant (tenant_users)
- Roles por tenant con permisos
- Sistema de permisos basado en módulo.entidad.accion
- Invitaciones a tenants con token y expiración
- API Keys con hash SHA-256
- Autenticación JWT con Passport
- Integración Keycloak preparada (configurable)
- Guards: JwtAuthGuard, RolesGuard, PermissionsGuard, TenantGuard
- Tenant context por request (header X-Tenant-Id)
- Decoradores: @CurrentUser, @RequirePermissions, @RequireRoles, @Public

## Tablas creadas

| Tabla | Descripción |
|-------|-------------|
| `iam.users` | Usuarios globales del sistema |
| `iam.tenant_users` | Asociación usuario-tenant |
| `iam.user_invitations` | Invitaciones pendientes |
| `iam.roles` | Roles por tenant |
| `iam.permissions` | Permisos del sistema (45 permisos) |
| `iam.role_permissions` | Asociación rol-permiso |
| `iam.user_roles` | Asociación tenant_user-rol |
| `iam.user_branches` | Asociación usuario-sucursal |
| `iam.api_keys` | API Keys para acceso programático |

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/v1/iam/users` | Listar usuarios |
| GET | `/api/v1/iam/users/:id` | Obtener usuario |
| PATCH | `/api/v1/iam/users/:id` | Actualizar usuario |
| POST | `/api/v1/iam/tenants/:tenantId/users/:userId` | Agregar usuario a tenant |
| GET | `/api/v1/iam/tenants/:tenantId/users` | Listar usuarios del tenant |
| DELETE | `/api/v1/iam/tenants/:tenantId/users/:userId` | Remover usuario del tenant |
| POST | `/api/v1/iam/tenants/:tenantId/roles` | Crear rol |
| GET | `/api/v1/iam/tenants/:tenantId/roles` | Listar roles |
| GET | `/api/v1/iam/roles/:id` | Obtener rol |
| PATCH | `/api/v1/iam/roles/:id` | Actualizar rol |
| DELETE | `/api/v1/iam/roles/:id` | Eliminar rol |
| POST | `/api/v1/iam/roles/:roleId/permissions` | Asignar permisos a rol |
| POST | `/api/v1/iam/tenant-users/:tenantUserId/roles/:roleId` | Asignar rol a usuario |
| DELETE | `/api/v1/iam/tenant-users/:tenantUserId/roles/:roleId` | Remover rol de usuario |
| GET | `/api/v1/iam/permissions` | Listar todos los permisos |
| GET | `/api/v1/iam/permissions/module/:module` | Permisos por módulo |
| POST | `/api/v1/iam/tenants/:tenantId/invitations` | Crear invitación |
| GET | `/api/v1/iam/tenants/:tenantId/invitations` | Listar invitaciones |
| POST | `/api/v1/iam/invitations/:token/accept` | Aceptar invitación |
| DELETE | `/api/v1/iam/invitations/:id` | Cancelar invitación |
| POST | `/api/v1/iam/tenants/:tenantId/users/:userId/api-keys` | Crear API key |
| GET | `/api/v1/iam/tenants/:tenantId/api-keys` | Listar API keys |
| DELETE | `/api/v1/iam/api-keys/:id` | Revocar API key |

## Pruebas

- Tests e2e para CRUD de usuarios
- Tests e2e para roles y permisos
- Tests e2e para invitaciones (crear, aceptar)
- Tests e2e para API keys (crear, listar)
- Seed con 45 permisos predefinidos

## Decisiones técnicas

1. **Passport + JWT** para autenticación
2. **Keycloak configurable** — funciona sin servidor Keycloak en desarrollo
3. **Guards globales** — JwtAuthGuard, RolesGuard, PermissionsGuard registrados en APP_GUARD
4. **Tenant context** — header X-Tenant-Id obligatorio para operaciones multi-tenant
5. **API Keys** — hash SHA-256, nunca se almacena la clave en texto plano
6. **Invitaciones** — token UUID con expiración de 7 días
7. **45 permisos** predefinidos cubriendo CRM, Sales, Support, Marketing, Messaging, SaaS, IAM, Platform, Analytics, Automation

## Deuda técnica

- Keycloak no está conectado (pendiente configurar servidor)
- Login endpoint no expuesto (pendiente integración Keycloak completa)
- MFA preparado a nivel de schema pero no implementado

## Pendientes no bloqueantes

- Integrar servidor Keycloak real
- Implementar login flow completo
- Agregar refresh tokens
- Rate limiting en endpoints de autenticación

## Criterios de aceptación

| Criterio | Estado |
|----------|--------|
| Tablas IAM creadas | ✅ |
| CRUD de usuarios funciona | ✅ |
| Roles y permisos funcionan | ✅ |
| Invitaciones funcionan | ✅ |
| API Keys funcionan | ✅ |
| Guards protegen endpoints | ✅ |
| Tenant isolation funciona | ✅ |
| Auditoría registra operaciones | ✅ |
| Pruebas automatizadas | ✅ |
| Documentación Swagger | ✅ |

## Estado final

**COMPLETED**

---

Sprint 2 completado. Esperar instrucción humana para iniciar Sprint 3.
