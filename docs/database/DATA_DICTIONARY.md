# Diccionario de Datos

## platform.tenants

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | UUID | NO | Identificador único (PK) |
| code | VARCHAR(30) | NO | Código único del tenant |
| legal_name | VARCHAR(200) | NO | Razón social |
| trade_name | VARCHAR(200) | SI | Nombre comercial |
| tax_id | VARCHAR(50) | SI | NIT / identificación tributaria |
| email | VARCHAR(150) | SI | Email principal |
| phone | VARCHAR(50) | SI | Teléfono principal |
| country_code | VARCHAR(3) | SI | Código de país ISO |
| state | VARCHAR(100) | SI | Departamento / estado |
| city | VARCHAR(100) | SI | Ciudad |
| address | VARCHAR(250) | SI | Dirección |
| postal_code | VARCHAR(20) | SI | Código postal |
| currency_code | VARCHAR(3) | NO | Código de moneda ISO (default: COP) |
| timezone | VARCHAR(50) | NO | Zona horaria (default: America/Bogota) |
| locale | VARCHAR(10) | NO | Idioma (default: es-CO) |
| status | VARCHAR(30) | NO | Estado: TRIAL, ACTIVE, SUSPENDED, CANCELLED |
| trial_ends_at | TIMESTAMPTZ | SI | Fecha de fin de prueba |
| created_at | TIMESTAMPTZ | NO | Fecha de creación |
| updated_at | TIMESTAMPTZ | NO | Fecha de última actualización |
| deleted_at | TIMESTAMPTZ | SI | Borrado lógico |

## platform.tenant_settings

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | UUID | NO | Identificador único (PK) |
| tenant_id | UUID | NO | FK → tenants.id |
| setting_key | VARCHAR(100) | NO | Clave de configuración |
| setting_value | JSONB | SI | Valor de configuración |
| created_at | TIMESTAMPTZ | NO | Fecha de creación |
| updated_at | TIMESTAMPTZ | NO | Fecha de actualización |

Restricción: UNIQUE(tenant_id, setting_key)

## platform.branches

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | UUID | NO | Identificador único (PK) |
| tenant_id | UUID | NO | FK → tenants.id |
| code | VARCHAR(30) | NO | Código de la sucursal |
| name | VARCHAR(150) | NO | Nombre de la sucursal |
| address | VARCHAR(250) | SI | Dirección |
| city | VARCHAR(100) | SI | Ciudad |
| state | VARCHAR(100) | SI | Departamento |
| country_code | VARCHAR(3) | SI | Código de país |
| phone | VARCHAR(50) | SI | Teléfono |
| email | VARCHAR(150) | SI | Email |
| latitude | NUMERIC(10,7) | SI | Latitud |
| longitude | NUMERIC(10,7) | SI | Longitud |
| is_active | BOOLEAN | NO | Activa (default: true) |
| created_at | TIMESTAMPTZ | NO | Fecha de creación |
| updated_at | TIMESTAMPTZ | NO | Fecha de actualización |
| deleted_at | TIMESTAMPTZ | SI | Borrado lógico |

Restricción: UNIQUE(tenant_id, code)

## audit.audit_logs

| Columna | Tipo | Nullable | Descripción |
|---------|------|----------|-------------|
| id | UUID | NO | Identificador único (PK) |
| tenant_id | UUID | SI | FK → tenants.id |
| user_id | UUID | SI | ID del usuario (nullable hasta Sprint 2) |
| action | VARCHAR(50) | NO | Acción realizada |
| module | VARCHAR(100) | NO | Módulo afectado |
| entity_type | VARCHAR(100) | SI | Tipo de entidad |
| entity_id | UUID | SI | ID de la entidad |
| old_values | JSONB | SI | Valores anteriores |
| new_values | JSONB | SI | Valores nuevos |
| ip_address | VARCHAR(64) | SI | Dirección IP |
| user_agent | TEXT | SI | User agent |
| request_id | VARCHAR(100) | SI | ID de la petición |
| occurred_at | TIMESTAMPTZ | NO | Fecha del evento |
