# CRM SaaS Omnicanal

Plataforma CRM SaaS, modular, multiempresa y omnicanal.

## Stack

- **Frontend:** React, TypeScript, Vite, Material UI, TanStack Query
- **Backend:** NestJS, TypeScript, Prisma ORM
- **Database:** PostgreSQL 16, Redis 7
- **Auth:** Keycloak (Sprint 2)
- **Infra:** Docker, Docker Compose

## Requisitos

- Node.js 20+
- Docker y Docker Compose
- pnpm (opcional)

## Instalación Rápida

```bash
# Levantar servicios de base de datos
docker-compose up -d postgres redis

# Instalar dependencias del backend
cd apps/api
npm install

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar backend en desarrollo
npm run start:dev
```

El backend estará disponible en http://localhost:3000
Swagger docs: http://localhost:3000/docs

### Frontend

```bash
cd apps/web
npm install
npm run dev
```

El frontend estará disponible en http://localhost:5173

### Docker Compose Completo

```bash
docker-compose up --build
```

## Estructura del Proyecto

```
crm-saas-platform/
├── apps/
│   ├── api/          # Backend NestJS
│   └── web/          # Frontend React
├── packages/
│   └── shared/       # Código compartido
├── prisma/
│   └── schema.prisma # Esquema de base de datos
├── docs/
│   ├── architecture/ # Documentación de arquitectura
│   ├── database/     # Changelog y diccionario de datos
│   ├── sprints/      # Informes de sprint
│   └── adr/          # Architecture Decision Records
├── docker/
│   └── nginx.conf    # Configuración Nginx
└── docker-compose.yml
```

## API Endpoints (Sprint 1)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/v1/health | Health check |
| POST | /api/v1/tenants | Crear tenant |
| GET | /api/v1/tenants | Listar tenants |
| GET | /api/v1/tenants/:id | Obtener tenant |
| PATCH | /api/v1/tenants/:id | Actualizar tenant |
| GET | /api/v1/tenants/:id/settings | Obtener settings |
| POST | /api/v1/tenants/:id/settings | Crear/actualizar setting |
| POST | /api/v1/tenants/:id/branches | Crear branch |
| GET | /api/v1/tenants/:id/branches | Listar branches |
| PATCH | /api/v1/tenants/:id/branches/:branchId | Actualizar branch |
| GET | /api/v1/audit/logs | Obtener logs de auditoría |

## Desarrollo

```bash
# Tests del backend
cd apps/api
npm test

# Lint
npm run lint

# Build
npm run build
```

## Sprint Status

```
ACTIVE_SPRINT: 1
STATUS: IN_PROGRESS
```
