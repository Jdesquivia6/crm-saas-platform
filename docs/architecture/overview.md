# Arquitectura CRM SaaS Omnicanal

## Visión General

El CRM es una plataforma SaaS multiempresa que administra el ciclo completo: contacto → conversación → lead → oportunidad → cotización → venta → pago → servicio → campaña → analítica.

## Arquitectura Actual

```
┌─────────────────────────────────────────────┐
│                 Usuarios                     │
│    PC          Tablet         Celular        │
└─────────────┬───────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│    React + TypeScript + Vite + PWA          │
│    Material UI / TanStack Query             │
└─────────────┬───────────────────────────────┘
              │ HTTP/REST
              ▼
┌─────────────────────────────────────────────┐
│         API NestJS (Monolito Modular)       │
│  ┌────────┐ ┌────────┐ ┌────────┐          │
│  │Platform│ │  CRM   │ │ Audit  │ ...      │
│  └───┬────┘ └───┬────┘ └───┬────┘          │
└──────┼──────────┼──────────┼────────────────┘
       │          │          │
       ▼          ▼          ▼
┌──────────┐ ┌────────┐ ┌────────┐
│PostgreSQL│ │ Redis  │ │  S3    │
│   (ORM)  │ │        │ │        │
└──────────┘ └────────┘ └────────┘
```

## Principios

1. **Monolito modular** — módulos desacoplados por dominio
2. **Multi-tenant** — `tenant_id` en todas las entidades operativas
3. **API-first** — REST con OpenAPI/Swagger
4. **Seguridad por diseño** — Keycloak + roles + permisos
5. **Auditoría** — logs de todas las operaciones críticas
6. **Soft delete** — `deleted_at` para entidades importantes
7. **UUID** — identificadores únicos en todas las tablas

## Estructura Backend

```
apps/api/src/
├── core/           # Prisma, Health, Filtros, Middleware
├── platform/       # Tenants, Settings, Branches
├── audit/          # Audit Logs
├── crm/            # (Sprint 4+)
├── sales/          # (Sprint 11+)
├── messaging/      # (Sprint 7+)
├── support/        # (Sprint 10+)
├── marketing/      # (Sprint 16+)
├── automation/     # (Sprint 19+)
├── ai/             # (Sprint 18+)
└── analytics/      # (Sprint 17+)
```

## Estándares de BD

- PK: UUID (`gen_random_uuid()`)
- Fechas: `TIMESTAMPTZ`
- Dinero: `NUMERIC(18,2)`
- Soft delete: `deleted_at`
- Multi-tenancy: `tenant_id` en todas las entidades operativas
