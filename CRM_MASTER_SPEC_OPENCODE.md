# CRM SaaS Omnicanal — Documento Maestro para OpenCode

**Versión:** 1.0  
**Fecha base:** 2026-08-15  
**Estado:** Documento rector del proyecto  
**Propósito:** Servir como fuente única de verdad para el agente de IA de OpenCode durante el desarrollo incremental del CRM.

---

# 0. INSTRUCCIÓN PRINCIPAL PARA EL AGENTE DE IA

Este documento define el contexto funcional, técnico y de negocio del proyecto.

El agente DEBE:

1. Leer este documento completo antes de modificar código.
2. Entender el sprint activo antes de implementar.
3. NO implementar funcionalidades de sprints futuros.
4. Crear las tablas, relaciones, índices, enums, DTO, servicios, endpoints, validaciones, pruebas y pantallas únicamente cuando correspondan al sprint activo.
5. Mantener compatibilidad con la arquitectura definida aquí.
6. Diseñar pensando en SaaS multiempresa, seguridad, escalabilidad y mantenibilidad.
7. Nunca eliminar o modificar una decisión arquitectónica importante sin documentar la razón.
8. Al terminar cada sprint, generar un informe de cierre y detenerse.
9. Esperar la instrucción explícita de iniciar el siguiente sprint.
10. Mantener actualizados:
   - migraciones;
   - esquema Prisma;
   - documentación OpenAPI;
   - pruebas;
   - archivo de cambios;
   - documentación de base de datos;
   - estado del sprint.
11. No crear todas las tablas del proyecto desde el inicio. Las tablas se crearán progresivamente por sprint.
12. No usar datos simulados como sustituto permanente de funcionalidades reales.
13. Aplicar siempre `tenant_id` a todas las entidades operativas que pertenezcan a una empresa.
14. Aplicar auditoría a las operaciones críticas.
15. Utilizar borrado lógico (`deleted_at`) cuando corresponda.
16. Evitar dependencias circulares entre módulos.
17. No implementar microservicios prematuramente. La primera versión será un monolito modular.
18. Mantener los módulos desacoplados para permitir futura separación.
19. Toda nueva funcionalidad debe respetar roles, permisos, plan/feature y tenant.
20. El sprint se considera terminado únicamente cuando cumple todos sus criterios de aceptación.

---

# 1. VISIÓN DEL PRODUCTO

Construir una plataforma CRM SaaS, modular, multiempresa y omnicanal para pequeñas, medianas y posteriormente grandes empresas.

La solución debe permitir administrar desde un único ecosistema:

**Cliente → conversación → lead → oportunidad → cotización → venta → pago → recompra → servicio → campaña → fidelización → analítica → IA → automatización.**

El producto debe funcionar desde navegador en:

- computadores;
- tabletas;
- teléfonos móviles.

La primera versión será una aplicación web responsive y PWA.

React Native podrá incorporarse posteriormente si existe una necesidad real de capacidades nativas profundas.

---

# 2. OBJETIVOS DEL NEGOCIO

La plataforma debe convertirse en un producto SaaS comercializable mediante planes.

Debe permitir que diferentes empresas utilicen la misma plataforma manteniendo aislamiento completo de información.

Ejemplos de planes futuros:

- STARTER
- PRO
- BUSINESS
- ENTERPRISE

Cada plan podrá controlar:

- número de usuarios;
- número de contactos;
- almacenamiento;
- canales disponibles;
- campañas;
- automatizaciones;
- uso de IA;
- API;
- reportes avanzados;
- funcionalidades premium.

El sistema debe diferenciar dos tipos de pagos:

## 2.1 Billing SaaS

Pago que la empresa realiza por utilizar el CRM.

## 2.2 Pagos comerciales

Pagos que los clientes finales realizan a las empresas que utilizan el CRM.

Estos dominios NO deben mezclarse.

---

# 3. PRINCIPIOS DEL PRODUCTO

1. Multi-tenant desde la primera versión.
2. Seguridad por diseño.
3. API-first.
4. Mobile-first.
5. Modularidad.
6. Auditoría.
7. Integraciones desacopladas.
8. Event-driven preparado, no sobredimensionado.
9. Datos relacionales primero.
10. JSONB únicamente para información variable.
11. Separación entre lógica de negocio y presentación.
12. Feature/entitlement management.
13. Observabilidad.
14. Pruebas automatizadas.
15. Evolución incremental por sprint.

---

# 4. STACK TECNOLÓGICO

## Frontend

- React
- TypeScript
- Vite
- PWA
- Material UI
- TanStack Query
- React Hook Form
- Zod

## Backend

- Node.js
- TypeScript
- NestJS
- REST
- OpenAPI / Swagger
- WebSocket
- Prisma ORM

## Datos

- PostgreSQL
- Redis
- BullMQ

## Autenticación

- Keycloak
- OAuth 2.0
- OpenID Connect
- JWT

## Storage

- S3 compatible

## DevOps

- Docker
- Docker Compose
- Nginx
- CI/CD

## Observabilidad

- OpenTelemetry
- Prometheus
- Grafana

## Futuro

- RabbitMQ
- React Native / Expo
- Kubernetes
- Data Warehouse
- OpenSearch
- pgvector
- Servicios IA independientes

---

# 5. ARQUITECTURA GENERAL

Primera etapa:

```text
Usuarios
   |
   +-- PC
   +-- Tablet
   +-- Celular
          |
          v
React + TypeScript + PWA
          |
          v
API NestJS
          |
   +------+---------+---------+----------+
   |                |         |          |
PostgreSQL        Redis     BullMQ      S3
   |
   +-- CRM
   +-- Ventas
   +-- SaaS
   +-- Messaging
   +-- Support
   +-- Marketing
   +-- Automation
   +-- AI
   +-- Analytics
```

Arquitectura inicial:

**Monolito modular.**

No implementar Kubernetes, Kafka, Service Mesh ni microservicios múltiples durante las primeras fases salvo decisión técnica documentada.

---

# 6. ORGANIZACIÓN DEL BACKEND

Estructura sugerida:

```text
src/
  core/
  auth/
  platform/
  iam/
  saas/
  crm/
  integrations/
  messaging/
  support/
  work/
  sales/
  payments/
  marketing/
  automation/
  ai/
  notifications/
  audit/
  analytics/
```

Cada módulo debe mantener, cuando aplique:

```text
controller
service
domain
repository
dto
entities / prisma mappings
guards
policies
events
tests
```

---

# 7. ESQUEMAS POSTGRESQL

Organizar PostgreSQL conceptualmente en los siguientes dominios:

```text
platform
iam
saas
crm
integration
messaging
support
work
sales
payments
marketing
automation
ai
notification
audit
analytics
```

Si Prisma o restricciones de infraestructura complican el uso de schemas múltiples, se podrá utilizar el schema `public` inicialmente, pero los modelos deberán conservar prefijos/módulos claros y documentar la decisión.

---

# 8. ESTÁNDARES DE BASE DE DATOS

## 8.1 Identificadores

Utilizar UUID.

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

## 8.2 Fechas

Utilizar:

```text
TIMESTAMPTZ
```

No utilizar timestamps sin zona horaria para eventos de negocio.

## 8.3 Valores monetarios

```text
NUMERIC(18,2)
```

No utilizar `FLOAT` ni `DOUBLE` para dinero.

## 8.4 Campos comunes

Cuando aplique:

```text
id
tenant_id
created_at
updated_at
created_by
updated_by
deleted_at
```

## 8.5 Soft delete

Utilizar `deleted_at` para:

- clientes;
- productos;
- empresas;
- entidades configurables importantes.

No utilizar borrado lógico para tablas puramente transaccionales cuando resulte innecesario.

## 8.6 JSONB

Usar JSONB solo para:

- payload de proveedores;
- configuraciones variables;
- metadata;
- snapshots;
- atributos extensibles.

No convertir campos estructurales importantes en JSONB para evitar modelarlos.

## 8.7 Multi-tenancy

Toda consulta operativa debe filtrar por tenant.

Incorrecto:

```sql
SELECT *
FROM contacts
WHERE id = :id;
```

Correcto:

```sql
SELECT *
FROM contacts
WHERE tenant_id = :tenantId
  AND id = :id;
```

Preparar Row Level Security de PostgreSQL como segunda capa de protección.

## 8.8 Restricciones

Usar:

- PK;
- FK;
- UNIQUE;
- CHECK;
- índices;
- restricciones compuestas.

No depender únicamente de validaciones de aplicación.

---

# 9. MULTI-TENANCY

Cada empresa cliente del SaaS es un `tenant`.

Estructura conceptual:

```text
Tenant A
   +-- usuarios
   +-- clientes
   +-- ventas
   +-- productos
   +-- mensajes
   +-- campañas

Tenant B
   +-- usuarios
   +-- clientes
   +-- ventas
   +-- productos
   +-- mensajes
   +-- campañas
```

Nunca debe existir acceso cruzado entre tenants.

---

# 10. AUTENTICACIÓN, AUTORIZACIÓN Y SEGURIDAD

Keycloak administrará identidad:

- login;
- recuperación;
- MFA;
- OAuth;
- OIDC;
- sesiones.

El CRM administrará autorización.

Modelo:

```text
USER
  |
TENANT_USER
  |
ROLE
  |
PERMISSIONS
```

Ejemplos:

```text
crm.contacts.view
crm.contacts.create
crm.contacts.update

sales.opportunities.view
sales.opportunities.create

marketing.campaigns.create

saas.subscription.manage
```

Nunca almacenar API keys, passwords o tokens externos en texto plano.

---

# 11. AUDITORÍA

Toda operación crítica debe poder registrar:

```text
tenant_id
user_id
action
module
entity_type
entity_id
old_values
new_values
ip_address
user_agent
request_id
occurred_at
```

Acciones típicas:

- CREATE
- UPDATE
- DELETE
- LOGIN
- LOGOUT
- EXPORT
- PAYMENT
- MERGE
- ASSIGN
- CHANGE_STATUS

---

# 12. MODELO FUNCIONAL COMPLETO

## Plataforma

- tenants
- tenant_settings
- tenant_domains
- branches
- teams
- team_members
- files
- file_links

## IAM

- users
- tenant_users
- user_invitations
- roles
- permissions
- role_permissions
- user_roles
- user_branches
- api_keys

## SaaS

- plans
- features
- plan_features
- subscriptions
- subscription_history
- usage_counters
- usage_events
- tenant_feature_overrides
- billing_invoices
- billing_invoice_items
- billing_payments

## CRM

- companies
- contacts
- contact_company_relations
- contact_identifiers
- contact_addresses
- contact_consents
- tags
- contact_tags
- contact_notes
- contact_assignments
- custom_fields
- custom_field_options
- contact_custom_values
- activities
- contact_match_candidates
- contact_merge_history

## Integration

- connections
- webhook_inbox
- webhook_outbox
- sync_jobs

## Messaging

- channel_accounts
- contact_channel_identities
- conversations
- conversation_participants
- messages
- message_attachments
- message_delivery_events
- conversation_assignments
- conversation_status_history
- message_templates
- canned_responses
- calls

## Support

- ticket_categories
- sla_policies
- tickets
- ticket_comments
- ticket_assignments
- ticket_status_history
- ticket_sla_events
- satisfaction_surveys

## Work

- tasks
- task_assignees
- task_reminders

## Sales

- lead_sources
- leads
- lead_status_history
- pipelines
- pipeline_stages
- opportunities
- opportunity_contacts
- opportunity_stage_history
- product_categories
- products
- product_variants
- taxes
- price_lists
- price_list_items
- opportunity_items
- quotes
- quote_items
- quote_status_history
- orders
- order_items
- order_status_history
- sales
- sale_items
- invoices
- invoice_items

## Payments

- provider_accounts
- payment_intents
- payment_links
- payment_transactions
- refunds

## Marketing

- segments
- segment_rules
- segment_members
- campaigns
- campaign_channels
- campaign_recipients
- campaign_events
- campaign_conversions

## Automation

- workflows
- workflow_versions
- workflow_nodes
- workflow_edges
- workflow_runs
- workflow_run_nodes

## AI

- model_configs
- prompts
- requests
- usage
- insights
- recommendations
- knowledge_bases
- knowledge_documents

## Notification

- notifications
- preferences
- push_subscriptions
- delivery_logs

## Audit

- audit_logs
- security_events
- outbox_events
- idempotency_keys

## Analytics

- events
- contact_metrics_daily
- product_metrics_daily
- agent_metrics_daily
- channel_metrics_daily
- campaign_metrics_daily
- tenant_metrics_daily

---

# 13. RELACIONES PRINCIPALES

```text
TENANT
 |
 +-- TENANT_USERS
 |
 +-- CONTACTS
 |     |
 |     +-- CONTACT_IDENTIFIERS
 |     +-- CONTACT_ADDRESSES
 |     +-- CONTACT_CONSENTS
 |     +-- CONTACT_TAGS
 |     +-- ACTIVITIES
 |     |
 |     +-- CONVERSATIONS
 |     |      |
 |     |      +-- MESSAGES
 |     |
 |     +-- TICKETS
 |     +-- TASKS
 |     +-- LEADS
 |     +-- OPPORTUNITIES
 |             |
 |             +-- QUOTES
 |                   |
 |                   +-- ORDERS
 |                         |
 |                         +-- SALES
 |                               |
 |                               +-- SALE_ITEMS
 |                               +-- PAYMENTS
 |
 +-- PRODUCTS
 +-- CAMPAIGNS
 +-- WORKFLOWS
 +-- AI
 +-- ANALYTICS
```

---

# 14. CLIENTE 360°

La ficha única de cliente deberá integrar progresivamente:

- información personal;
- empresa relacionada;
- teléfonos;
- emails;
- canales;
- etiquetas;
- consentimientos;
- conversaciones;
- mensajes;
- notas;
- tareas;
- oportunidades;
- cotizaciones;
- ventas;
- productos recurrentes;
- última compra;
- total comprado;
- tickets;
- campañas;
- asesor responsable;
- actividad cronológica;
- recomendaciones IA.

---

# 15. RESOLUCIÓN DE IDENTIDAD

El sistema debe reconocer que una misma persona puede aparecer en distintos canales.

Fuentes de coincidencia:

- documento;
- teléfono;
- email;
- WhatsApp;
- Instagram;
- Facebook;
- identificadores externos;
- similitud de nombre.

Estados:

- exact match;
- probable match;
- manual match.

La fusión de registros debe mantener historial y auditoría.

Nunca eliminar silenciosamente información durante una fusión.

---

# 16. INTEGRATION HUB

Las APIs externas no deben contaminar la lógica central.

Flujo:

```text
WhatsApp
Instagram
Facebook
Email
Telefonía
   |
   v
Integration Hub
   |
Normalización
   |
   v
CRM / Messaging
```

Las integraciones deben utilizar webhooks idempotentes.

---

# 17. OMNICANALIDAD

La bandeja unificada deberá manejar:

- conversación;
- cliente;
- canal;
- asesor;
- equipo;
- estado;
- prioridad;
- mensajes;
- adjuntos;
- notas internas;
- plantillas;
- respuestas rápidas;
- historial.

Estados sugeridos:

```text
NEW
OPEN
PENDING
RESOLVED
CLOSED
```

---

# 18. SERVICIO AL CLIENTE

Flujo:

```text
Conversación
   |
   v
Ticket
   |
Categoría
Prioridad
Responsable
SLA
   |
   v
Resolución
   |
Encuesta
```

Métricas:

- primera respuesta;
- tiempo de resolución;
- tickets vencidos;
- agente;
- categoría;
- satisfacción.

---

# 19. VENTAS

Flujo comercial:

```text
Lead
  |
  v
Opportunity
  |
  v
Quote
  |
  v
Order
  |
  v
Sale
  |
  v
Invoice
  |
  v
Payment
```

El pipeline debe ser configurable por tenant.

---

# 20. PRODUCTOS Y SERVICIOS

La tabla `products` deberá soportar:

- PRODUCT
- SERVICE
- SUBSCRIPTION

Capacidades futuras:

- categorías;
- variantes;
- listas de precios;
- impuestos;
- costos;
- márgenes;
- recurrencia.

---

# 21. PAGOS

Crear una abstracción `Payment Service`.

No acoplar el dominio de ventas directamente a un proveedor.

Ejemplo:

```text
CRM
 |
Payment Service
 |
 +-- Wompi
 +-- Mercado Pago
 +-- Stripe
 +-- PayU
 +-- Otros
```

Confirmar transacciones por webhook servidor-servidor.

Implementar idempotencia.

---

# 22. MARKETING

Debe permitir:

- segmentos;
- reglas dinámicas;
- campañas;
- múltiples canales;
- métricas;
- conversiones;
- ROI.

Ejemplo:

```text
Clientes frecuentes
AND
sin compra > 60 días
AND
compraron Producto A
```

---

# 23. ANALÍTICA

No recalcular dashboards recorriendo tablas transaccionales completas cada vez.

Construir agregados diarios cuando el volumen lo requiera.

Métricas:

- ventas;
- clientes;
- productos;
- vendedores;
- canales;
- campañas;
- tickets;
- conversión;
- ticket promedio;
- recurrencia.

---

# 24. IA

La IA debe estar desacoplada.

Casos:

- resumir conversación;
- sugerir respuesta;
- clasificar lead;
- identificar riesgo;
- detectar recurrencia;
- detectar baja rotación;
- recomendar campaña;
- recomendar producto;
- resumir cliente 360;
- generar insights comerciales.

La IA NO debe modificar datos críticos automáticamente sin una regla o workflow autorizado.

---

# 25. AUTOMATIZACIONES

Motor conceptual:

```text
TRIGGER
   |
CONDITION
   |
ACTION
```

Triggers:

- contacto creado;
- mensaje recibido;
- oportunidad creada;
- etapa modificada;
- venta realizada;
- pago recibido;
- tiempo transcurrido;
- ticket creado.

Actions:

- crear tarea;
- asignar usuario;
- agregar etiqueta;
- enviar mensaje;
- enviar email;
- cambiar estado;
- crear oportunidad;
- ejecutar webhook;
- invocar IA.

---

# 26. ROADMAP OFICIAL — 20 SPRINTS

Para evitar la confusión histórica entre Sprint 0 y Sprint 1, este documento establece una numeración definitiva de **Sprint 1 a Sprint 20**.

Cada sprint tiene una duración de referencia de 2 semanas.

---

# SPRINT 1 — Fundación técnica + Multi-Tenant

## Objetivo

Crear la base del proyecto y dejar funcionando la primera estructura multiempresa.

## Backend

Crear:

- proyecto NestJS;
- TypeScript;
- configuración;
- health endpoint;
- manejo global de errores;
- logging;
- Prisma;
- PostgreSQL;
- Redis;
- Docker;
- Docker Compose;
- OpenAPI.

## Frontend

Crear:

- React;
- TypeScript;
- Vite;
- Material UI;
- routing;
- layout base;
- responsive;
- estructura PWA inicial.

## Base de datos del Sprint 1

Crear únicamente:

### `platform.tenants`

```text
id                  UUID PK
code                VARCHAR(30) UNIQUE NOT NULL
legal_name          VARCHAR(200) NOT NULL
trade_name          VARCHAR(200)
tax_id              VARCHAR(50)
email               VARCHAR(150)
phone               VARCHAR(50)
country_code        VARCHAR(3)
state               VARCHAR(100)
city                VARCHAR(100)
address             VARCHAR(250)
postal_code         VARCHAR(20)
currency_code       VARCHAR(3) NOT NULL DEFAULT 'COP'
timezone            VARCHAR(50) NOT NULL DEFAULT 'America/Bogota'
locale              VARCHAR(10) NOT NULL DEFAULT 'es-CO'
status              VARCHAR(30) NOT NULL
trial_ends_at       TIMESTAMPTZ
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
deleted_at          TIMESTAMPTZ
```

Estados iniciales:

```text
TRIAL
ACTIVE
SUSPENDED
CANCELLED
```

### `platform.tenant_settings`

```text
id                  UUID PK
tenant_id           UUID FK -> tenants.id
setting_key         VARCHAR(100) NOT NULL
setting_value       JSONB
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
```

Restricción:

```text
UNIQUE(tenant_id, setting_key)
```

### `platform.branches`

```text
id                  UUID PK
tenant_id           UUID FK -> tenants.id
code                VARCHAR(30)
name                VARCHAR(150) NOT NULL
address             VARCHAR(250)
city                VARCHAR(100)
state               VARCHAR(100)
country_code        VARCHAR(3)
phone               VARCHAR(50)
email               VARCHAR(150)
latitude            NUMERIC(10,7)
longitude           NUMERIC(10,7)
is_active           BOOLEAN DEFAULT TRUE
created_at          TIMESTAMPTZ NOT NULL
updated_at          TIMESTAMPTZ NOT NULL
deleted_at          TIMESTAMPTZ
```

Restricción:

```text
UNIQUE(tenant_id, code)
```

### `audit.audit_logs`

Crear desde el inicio para soportar trazabilidad.

```text
id                  UUID PK
tenant_id           UUID NULL
user_id             UUID NULL
action              VARCHAR(50) NOT NULL
module              VARCHAR(100) NOT NULL
entity_type         VARCHAR(100)
entity_id           UUID
old_values          JSONB
new_values          JSONB
ip_address          VARCHAR(64)
user_agent          TEXT
request_id          VARCHAR(100)
occurred_at         TIMESTAMPTZ NOT NULL
```

`user_id` se dejará inicialmente nullable hasta que IAM sea implementado en Sprint 2.

## API Sprint 1

Como mínimo:

```text
GET    /health
POST   /tenants
GET    /tenants/:id
PATCH  /tenants/:id
GET    /tenants/:id/settings
PUT    /tenants/:id/settings/:key
POST   /tenants/:id/branches
GET    /tenants/:id/branches
PATCH  /tenants/:id/branches/:branchId
```

## Seguridad temporal

Mientras Keycloak se implementa en Sprint 2, las APIs administrativas del Sprint 1 podrán protegerse mediante un mecanismo temporal de desarrollo claramente separado y deshabilitable.

NO crear un sistema de autenticación casero permanente.

## Pruebas

- tenants CRUD;
- validación de código único;
- settings aislados por tenant;
- branches aisladas por tenant;
- auditoría;
- health check;
- migraciones reproducibles.

## Criterios de aceptación

Sprint 1 termina únicamente si:

- Docker levanta frontend, backend, PostgreSQL y Redis;
- migraciones ejecutan desde una base vacía;
- Swagger funciona;
- se puede crear un tenant;
- se puede consultar un tenant;
- se pueden crear settings;
- se pueden crear branches;
- no hay acceso cruzado accidental entre tenants;
- existen pruebas automatizadas;
- existe documentación de instalación;
- lint y tests pasan;
- auditoría básica funciona.

---

# SPRINT 2 — IAM: Usuarios, Roles y Permisos

Crear progresivamente:

- users
- tenant_users
- user_invitations
- roles
- permissions
- role_permissions
- user_roles
- user_branches
- api_keys

Integrar Keycloak.

Implementar:

- login;
- JWT;
- OIDC;
- tenant context;
- guards;
- roles;
- permissions;
- MFA preparado.

---

# SPRINT 3 — Planes, Features y Suscripciones SaaS

Crear:

- plans
- features
- plan_features
- subscriptions
- subscription_history
- usage_counters
- usage_events
- tenant_feature_overrides

Implementar entitlements.

NO implementar todavía cobro automático completo; eso corresponde a un sprint posterior.

---

# SPRINT 4 — CRM Básico

Crear:

- companies
- contacts
- contact_company_relations
- contact_identifiers
- contact_addresses
- tags
- contact_tags
- contact_notes
- contact_assignments

Funcionalidades:

- contactos;
- empresas;
- búsqueda;
- filtros;
- notas;
- tags;
- asignación;
- importación básica.

---

# SPRINT 5 — Cliente 360°

Crear:

- contact_consents
- custom_fields
- custom_field_options
- contact_custom_values
- activities

Implementar ficha 360:

- timeline;
- resumen;
- últimas interacciones;
- información comercial;
- tareas;
- datos personalizados.

---

# SPRINT 6 — Resolución de Identidad

Crear:

- contact_match_candidates
- contact_merge_history

Implementar:

- detección de duplicados;
- coincidencias exactas;
- coincidencias probables;
- fusión manual;
- auditoría completa.

---

# SPRINT 7 — Bandeja Omnicanal Core

Crear:

- channel_accounts
- contact_channel_identities
- conversations
- conversation_participants
- messages
- message_attachments
- conversation_assignments
- conversation_status_history
- canned_responses

Implementar WebSocket.

No integrar aún todos los proveedores.

---

# SPRINT 8 — WhatsApp

Crear/activar:

- integration.connections
- integration.webhook_inbox
- integration.webhook_outbox
- messaging.message_delivery_events
- messaging.message_templates

Integrar WhatsApp.

---

# SPRINT 9 — Instagram, Facebook y Email

Crear:

- integration.sync_jobs

Extender channel accounts y adapters.

Integrar:

- Instagram;
- Messenger;
- email.

---

# SPRINT 10 — Tickets y Servicio

Crear:

- ticket_categories
- sla_policies
- tickets
- ticket_comments
- ticket_assignments
- ticket_status_history
- ticket_sla_events
- satisfaction_surveys

---

# SPRINT 11 — Leads, Pipeline y Oportunidades

Crear:

- lead_sources
- leads
- lead_status_history
- pipelines
- pipeline_stages
- opportunities
- opportunity_contacts
- opportunity_stage_history

---

# SPRINT 12 — Productos y Servicios

Crear:

- product_categories
- products
- product_variants
- taxes
- price_lists
- price_list_items
- opportunity_items

---

# SPRINT 13 — Cotizaciones, Pedidos y Ventas

Crear:

- quotes
- quote_items
- quote_status_history
- orders
- order_items
- order_status_history
- sales
- sale_items
- invoices
- invoice_items

---

# SPRINT 14 — Payment Service

Crear:

- provider_accounts
- payment_intents
- payment_links
- payment_transactions
- refunds
- audit.idempotency_keys

Integrar primer proveedor.

---

# SPRINT 15 — Billing SaaS

Crear:

- billing_invoices
- billing_invoice_items
- billing_payments

Implementar:

- renovación;
- vencimientos;
- past due;
- upgrade;
- downgrade;
- suspensión;
- reactivación.

---

# SPRINT 16 — Marketing y Campañas

Crear:

- segments
- segment_rules
- segment_members
- campaigns
- campaign_channels
- campaign_recipients
- campaign_events
- campaign_conversions

---

# SPRINT 17 — Dashboard y Analítica

Crear:

- analytics.events
- contact_metrics_daily
- product_metrics_daily
- agent_metrics_daily
- channel_metrics_daily
- campaign_metrics_daily
- tenant_metrics_daily

---

# SPRINT 18 — IA

Crear:

- model_configs
- prompts
- requests
- usage
- insights
- recommendations
- knowledge_bases
- knowledge_documents

No acoplar el CRM directamente a un proveedor específico de IA.

---

# SPRINT 19 — Automatizaciones

Crear:

- workflows
- workflow_versions
- workflow_nodes
- workflow_edges
- workflow_runs
- workflow_run_nodes
- audit.outbox_events

---

# SPRINT 20 — PWA avanzada, Seguridad y Escalabilidad

Completar:

- notification.notifications
- notification.preferences
- notification.push_subscriptions
- notification.delivery_logs
- audit.security_events

Fortalecer:

- RLS;
- rate limiting;
- MFA;
- observabilidad;
- performance;
- backups;
- recovery;
- PWA;
- push;
- cache;
- hardening.

---

# 27. REGLA DE EJECUCIÓN DE SPRINTS

El agente siempre debe manejar un único sprint activo.

Archivo recomendado:

```text
docs/SPRINT_STATUS.md
```

Formato:

```text
ACTIVE_SPRINT: 1
STATUS: IN_PROGRESS
STARTED_AT:
COMPLETED_AT:
```

Cuando termine:

```text
ACTIVE_SPRINT: 1
STATUS: COMPLETED
```

El agente NO debe cambiar automáticamente a:

```text
ACTIVE_SPRINT: 2
```

Debe esperar una instrucción humana explícita.

---

# 28. PROCEDIMIENTO AL INICIAR CADA SPRINT

1. Leer este documento.
2. Leer `SPRINT_STATUS.md`.
3. Revisar el código existente.
4. Revisar migraciones existentes.
5. Revisar tests.
6. Identificar dependencias del sprint.
7. Crear plan técnico del sprint.
8. Documentar tablas a crear.
9. Implementar backend.
10. Implementar frontend.
11. Crear pruebas.
12. Actualizar OpenAPI.
13. Actualizar documentación.
14. Ejecutar validaciones.
15. Generar informe final.

---

# 29. PROCEDIMIENTO DE BASE DE DATOS POR SPRINT

Antes de crear una tabla:

1. Confirmar que pertenece al sprint activo.
2. Revisar si existe una entidad previa reutilizable.
3. Definir:
   - PK;
   - FK;
   - UNIQUE;
   - CHECK;
   - índices;
   - nullable;
   - default;
   - `ON DELETE`;
   - tenant.
4. Crear modelo Prisma.
5. Crear migración.
6. Probar migración desde base vacía.
7. Probar rollback o estrategia correctiva.
8. Documentar la tabla.
9. Añadir tests.
10. No crear tablas futuras “por conveniencia”.

---

# 30. ÍNDICES

Todo índice debe responder a consultas reales.

Índices mínimos típicos:

```text
(tenant_id)
(tenant_id, id)
(tenant_id, status)
(tenant_id, created_at)
```

Ejemplos futuros:

```sql
CREATE INDEX idx_contacts_tenant
ON crm.contacts(tenant_id);

CREATE INDEX idx_contact_identifier_lookup
ON crm.contact_identifiers(tenant_id, normalized_value);

CREATE INDEX idx_conversation_contact
ON messaging.conversations(tenant_id, contact_id, last_message_at DESC);

CREATE INDEX idx_messages_conversation
ON messaging.messages(tenant_id, conversation_id, sent_at DESC);

CREATE INDEX idx_sales_date
ON sales.sales(tenant_id, sold_at DESC);

CREATE INDEX idx_sale_items_product
ON sales.sale_items(tenant_id, product_id);

CREATE INDEX idx_opportunity_pipeline
ON sales.opportunities(tenant_id, pipeline_id, stage_id);
```

No crear índices masivos sin justificación.

---

# 31. EVENTOS Y OUTBOX

Cuando se implemente el outbox:

Ejemplo:

```text
SALE_CREATED
   |
   +-- actualizar métricas
   +-- notificar vendedor
   +-- actualizar cliente
   +-- ejecutar workflow
   +-- generar insight IA
```

La creación de una venta no debe depender síncronamente de todas estas operaciones.

---

# 32. REGLAS DE PAGOS

1. Nunca confiar solo en redirect del navegador.
2. Confirmar mediante webhook.
3. Verificar firma del proveedor.
4. Implementar idempotencia.
5. Registrar payload externo.
6. No almacenar datos sensibles de tarjeta.
7. Mantener provider adapters.
8. Separar pago SaaS de pago comercial.

---

# 33. REGLAS DE INTEGRACIONES

Cada proveedor debe implementar un adapter.

Ejemplo conceptual:

```text
MessagingProvider
  receive()
  send()
  normalizeInbound()
  normalizeStatus()
  validateWebhook()
```

No escribir lógica específica de Meta dentro de `crm.contacts.service`.

---

# 34. REGLAS DE FRONTEND

1. Mobile-first.
2. Responsive real, no simplemente reducir desktop.
3. Componentes reutilizables.
4. Accesibilidad.
5. Estados:
   - loading;
   - empty;
   - error;
   - success.
6. No duplicar llamadas API.
7. Utilizar TanStack Query.
8. Validaciones compartidas conceptualmente con backend.
9. No almacenar secretos en frontend.
10. Rutas protegidas.
11. Feature guards.
12. Permission guards.

---

# 35. PANTALLAS FUTURAS PRINCIPALES

- Login
- Selección de tenant
- Dashboard
- Clientes
- Cliente 360
- Bandeja omnicanal
- Tickets
- Tareas
- Pipeline
- Oportunidad
- Productos
- Cotizaciones
- Pedidos
- Ventas
- Pagos
- Campañas
- Segmentos
- Analítica
- IA
- Automatizaciones
- Usuarios
- Roles
- Plan
- Facturación
- Integraciones
- Configuración

---

# 36. DEFINICIÓN DE TERMINADO — DEFINITION OF DONE

Una historia no está terminada solo porque “funciona”.

Debe cumplir:

- código compilando;
- lint limpio;
- pruebas pasando;
- migración reproducible;
- validaciones;
- permisos;
- tenant isolation;
- auditoría cuando corresponda;
- manejo de errores;
- logs;
- documentación;
- Swagger;
- frontend responsive;
- estados UX;
- revisión de seguridad;
- sin secretos expuestos.

---

# 37. INFORME DE CIERRE DE SPRINT

Al finalizar cada sprint crear:

```text
docs/sprints/SPRINT_XX_CLOSEOUT.md
```

Contenido:

```text
# Sprint XX

## Objetivo

## Funcionalidades implementadas

## Tablas creadas

## Migraciones

## Endpoints

## Pantallas

## Pruebas

## Decisiones técnicas

## Deuda técnica

## Problemas encontrados

## Pendientes no bloqueantes

## Criterios de aceptación

## Estado final
COMPLETED
```

---

# 38. CHANGELOG DE BASE DE DATOS

Mantener:

```text
docs/database/CHANGELOG.md
```

Ejemplo:

```text
Sprint 1
+ platform.tenants
+ platform.tenant_settings
+ platform.branches
+ audit.audit_logs
```

Sprint 2 posteriormente agregará sus propias tablas.

---

# 39. DICCIONARIO DE DATOS

Mantener progresivamente:

```text
docs/database/DATA_DICTIONARY.md
```

No escribir desde ahora columnas definitivas de tablas todavía no implementadas salvo las especificaciones maestras aquí descritas.

Cuando una tabla se implemente, documentar:

- propósito;
- columnas;
- tipo;
- nullable;
- FK;
- índice;
- regla de negocio.

---

# 40. DOCUMENTACIÓN DE ARQUITECTURA

Mantener:

```text
docs/architecture/
  overview.md
  backend.md
  frontend.md
  database.md
  security.md
  multi-tenancy.md
  integrations.md
```

Registrar decisiones significativas mediante ADR:

```text
docs/adr/
```

Ejemplo:

```text
ADR-001-use-modular-monolith.md
ADR-002-use-postgresql.md
ADR-003-use-keycloak.md
```

---

# 41. ESTRUCTURA DE REPOSITORIO SUGERIDA

Puede ser monorepo:

```text
crm-platform/
  apps/
    web/
    api/
  packages/
    shared/
    ui/
    config/
  prisma/
  docs/
    architecture/
    database/
    sprints/
    adr/
  docker/
  .github/
  docker-compose.yml
  README.md
```

El agente podrá ajustar esta estructura si encuentra una opción técnicamente superior, pero deberá mantener claramente separadas las aplicaciones.

---

# 42. CONVENCIONES DE NOMBRES

## Base de datos

snake_case.

```text
tenant_id
created_at
contact_identifiers
```

## TypeScript

camelCase.

```text
tenantId
createdAt
contactIdentifiers
```

## Clases

PascalCase.

```text
ContactService
CreateTenantDto
```

## Endpoints

REST plural.

```text
/tenants
/contacts
/opportunities
```

---

# 43. MANEJO DE ERRORES

La API debe responder con un formato consistente.

Ejemplo conceptual:

```json
{
  "statusCode": 409,
  "code": "TENANT_CODE_ALREADY_EXISTS",
  "message": "El código del tenant ya está registrado.",
  "requestId": "..."
}
```

No devolver stack trace en producción.

---

# 44. OBSERVABILIDAD

Desde los primeros sprints:

- request ID;
- structured logs;
- health endpoints;
- error logging.

Posteriormente:

- tracing;
- metrics;
- dashboards;
- alertas.

---

# 45. BACKUPS

Cuando el proyecto alcance ambientes compartidos:

- backup PostgreSQL;
- backup object storage;
- políticas de retención;
- pruebas de restauración.

Un backup que nunca ha sido restaurado no se considera validado.

---

# 46. PRIVACIDAD Y CONSENTIMIENTO

Preparar el CRM para manejar:

- consentimiento de marketing;
- revocación;
- canal;
- evidencia;
- fecha;
- origen.

Las campañas no deben ignorar restricciones de consentimiento.

---

# 47. IMPORTACIÓN DE DATOS

Cuando se implemente:

1. cargar archivo;
2. validar estructura;
3. preview;
4. mapear columnas;
5. detectar duplicados;
6. importar por lotes;
7. informar errores;
8. mantener auditoría.

No importar miles de registros dentro de una petición HTTP síncrona.

---

# 48. TRABAJOS ASÍNCRONOS

BullMQ + Redis deberá utilizarse progresivamente para:

- importaciones;
- campañas;
- sincronizaciones;
- procesamiento IA;
- generación de documentos;
- analytics;
- webhooks;
- notificaciones.

---

# 49. DATOS QUE NO DEBEN DUPLICARSE

Evitar mantener una misma información crítica en varios dominios si puede relacionarse.

Ejemplo:

La persona vive en `crm.contacts`.

Messaging debe relacionar el contacto, no crear otra “persona” independiente.

Sales debe relacionar el contacto.

Support debe relacionar el contacto.

---

# 50. FUENTE DE VERDAD

Fuentes principales:

```text
crm.contacts                 -> persona
sales.products               -> producto
sales.sales                  -> venta
messaging.messages           -> mensaje
support.tickets              -> ticket
payments.payment_transactions -> transacción
saas.subscriptions           -> suscripción SaaS
```

Analytics es derivado.

IA es derivada.

Los datos derivados nunca deben sustituir silenciosamente la fuente transaccional.

---

# 51. PRINCIPIO DE ESCALABILIDAD

No optimizar prematuramente.

Orden:

1. código correcto;
2. buenas consultas;
3. índices;
4. Redis;
5. workers;
6. particionamiento si corresponde;
7. réplicas;
8. separación de servicios;
9. Kubernetes solo si es necesario.

---

# 52. FUTURA SEPARACIÓN DE SERVICIOS

Si el volumen lo exige:

```text
CRM Core
Messaging Service
Campaign Service
Payment Service
Notification Service
AI Service
Analytics Service
```

Pero inicialmente deben permanecer como módulos del monolito modular.

---

# 53. REGLAS PARA EL AGENTE OPENCODE

Antes de escribir código, responder internamente estas preguntas:

1. ¿Cuál es el sprint activo?
2. ¿Esta funcionalidad pertenece al sprint?
3. ¿A qué tenant pertenece la información?
4. ¿Qué permiso necesita?
5. ¿Qué tabla es fuente de verdad?
6. ¿Necesita auditoría?
7. ¿Necesita índice?
8. ¿Puede ejecutarse de forma síncrona?
9. ¿Existe riesgo de duplicados?
10. ¿Existe una relación previa reutilizable?
11. ¿La solución crea deuda técnica innecesaria?
12. ¿La API está documentada?
13. ¿La funcionalidad es responsive?
14. ¿Está probada?

---

# 54. INSTRUCCIÓN DE ARRANQUE

## Sprint activo inicial

```text
SPRINT 1
Fundación técnica + Multi-Tenant
```

El agente debe comenzar exclusivamente por Sprint 1.

Primera secuencia recomendada:

```text
1. inspeccionar repositorio
2. crear/validar estructura monorepo
3. configurar NestJS
4. configurar React
5. configurar PostgreSQL
6. configurar Prisma
7. configurar Redis
8. crear Docker Compose
9. crear health endpoint
10. crear modelo Tenant
11. crear TenantSettings
12. crear Branch
13. crear AuditLog
14. crear migración
15. crear servicios
16. crear endpoints
17. crear validaciones
18. crear pruebas
19. crear interfaz administrativa mínima
20. documentar
21. ejecutar criterios de aceptación
22. generar cierre del Sprint 1
23. detenerse
```

NO iniciar Sprint 2 automáticamente.

---

# 55. PROMPT OPERATIVO PARA OPENCODE

Utilizar el siguiente texto al comenzar:

> Lee completamente `CRM_MASTER_SPEC_OPENCODE.md`. Este archivo es la fuente de verdad del proyecto. Revisa el repositorio actual y determina el estado real del código antes de realizar cambios. El sprint activo es el Sprint 1: Fundación técnica + Multi-Tenant. Implementa únicamente el alcance definido para ese sprint. No crees tablas ni funcionalidades de sprints futuros. Trabaja incrementalmente, mantén las migraciones reproducibles, aplica multi-tenancy, validaciones, auditoría y pruebas. Actualiza la documentación indicada por el documento maestro. Al completar todos los criterios de aceptación del Sprint 1, genera el archivo de cierre del sprint y detente. No avances al Sprint 2 hasta recibir una instrucción explícita.

---

# 56. REGLA FINAL

Este documento es el mapa completo, NO una orden para construir todo simultáneamente.

El proyecto debe crecer así:

```text
Sprint 1
   |
COMPLETED
   |
autorización humana
   |
Sprint 2
   |
COMPLETED
   |
autorización humana
   |
Sprint 3
   |
...
   |
Sprint 20
```

La estabilidad del sprint anterior tiene prioridad sobre la velocidad del siguiente.

---

# FIN DEL DOCUMENTO MAESTRO
