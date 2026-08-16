# crm-saas-platform

# CRM SaaS Platform

Plataforma CRM SaaS modular, omnicanal y multiempresa orientada a la gestión de clientes, ventas, comunicaciones, servicio al cliente, marketing, automatizaciones, pagos, analítica e inteligencia artificial.

## Estado del proyecto

🚧 En desarrollo

Versión actual: `0.1.0`

---

## Objetivo

Construir una plataforma CRM escalable que permita a diferentes empresas administrar de manera centralizada:

- Clientes y contactos.
- Historial 360° del cliente.
- Leads y oportunidades.
- Productos y servicios.
- Cotizaciones y ventas.
- Comunicaciones omnicanal.
- WhatsApp.
- Instagram.
- Facebook.
- Correo electrónico.
- Tickets y servicio al cliente.
- Campañas de marketing.
- Pagos.
- Suscripciones.
- Automatizaciones.
- Analítica comercial.
- Inteligencia artificial.

---

## Arquitectura

El proyecto utilizará inicialmente una arquitectura de Monolito Modular preparada para evolucionar hacia servicios independientes cuando sea necesario.

La plataforma será Multi-Tenant, permitiendo que múltiples empresas utilicen la misma infraestructura manteniendo aislamiento lógico y de seguridad de su información.

---

## Tecnologías

### Frontend

- React
- TypeScript
- Vite
- PWA
- Material UI
- TanStack Query
- React Hook Form
- Zod

### Backend

- Node.js
- TypeScript
- NestJS
- REST API
- OpenAPI / Swagger
- WebSockets

### Base de datos

- PostgreSQL
- Prisma ORM

### Cache y procesamiento

- Redis
- BullMQ

### Autenticación

- Keycloak
- OAuth 2.0
- OpenID Connect
- JWT

### Almacenamiento

- Object Storage compatible con S3

### Infraestructura

- Docker
- Docker Compose
- Nginx

### Observabilidad

- OpenTelemetry
- Prometheus
- Grafana

---

## Estructura del proyecto

```text
apps/
├── web
├── api
└── worker

packages/
├── shared
├── types
├── validation
└── config

database/
├── migrations
├── seeds
└── scripts

docs/
├── architecture
├── database
├── api
└── sprints
