# Database Changelog

## Sprint 1

### Added

- `platform.tenants` — Empresas clientas del CRM
- `platform.tenant_settings` — Configuraciones clave-valor por tenant
- `platform.branches` — Sucursales por tenant
- `audit.audit_logs` — Registro de auditoría del sistema

## Sprint 2

### Added

- `iam.users` — Usuarios globales del sistema
- `iam.tenant_users` — Asociación usuario-tenant
- `iam.user_invitations` — Invitaciones pendientes a tenants
- `iam.roles` — Roles por tenant
- `iam.permissions` — Permisos del sistema (45 permisos)
- `iam.role_permissions` — Asociación rol-permiso
- `iam.user_roles` — Asociación tenant_user-rol
- `iam.user_branches` — Asociación usuario-sucursal
- `iam.api_keys` — API Keys para acceso programático
