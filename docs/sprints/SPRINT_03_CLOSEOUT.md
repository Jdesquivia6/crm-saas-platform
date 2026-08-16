# Sprint 3 — Planes, Features y Suscripciones SaaS

## Objetivo

Implementar el sistema de planes, features y suscripciones SaaS con sistema de entitlements.

## Funcionalidades implementadas

- Gestión de planes (CRUD con precios mensual/anual)
- Sistema de features (BOOLEAN, LIMIT, QUOTA)
- Asignación de features a planes con límites
- Suscripciones de tenants a planes (mensual/anual)
- Historial de cambios de suscripción
- Sistema de entitlements (verificar acceso a features)
- Contadores de uso por período
- Eventos de uso
- Overrides de features por tenant (para personalizaciones)
- Seed con 4 planes y 23 features predefinidos

## Tablas creadas

| Tabla | Descripción |
|-------|-------------|
| `saas.planes` | Planes de suscripción (starter, pro, business, enterprise) |
| `saas.features` | Features del sistema (23 features) |
| `saas.plan_features` | Asociación plan-feature con límites |
| `saas.subscriptions` | Suscripciones activas de tenants |
| `saas.subscription_history` | Historial de cambios |
| `saas.usage_counters` | Contadores de uso por período |
| `saas.usage_events` | Eventos individuales de uso |
| `saas.tenant_feature_overrides` | Overrides personalizados por tenant |

## Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/plans` | Crear plan |
| GET | `/api/v1/plans` | Listar planes |
| GET | `/api/v1/plans/:id` | Obtener plan |
| PATCH | `/api/v1/plans/:id` | Actualizar plan |
| POST | `/api/v1/features` | Crear feature |
| GET | `/api/v1/features` | Listar features |
| GET | `/api/v1/features/:id` | Obtener feature |
| POST | `/api/v1/plans/:planId/features/:featureId` | Asignar feature a plan |
| DELETE | `/api/v1/plans/:planId/features/:featureId` | Remover feature de plan |
| POST | `/api/v1/tenants/:tenantId/subscriptions` | Crear suscripción |
| GET | `/api/v1/tenants/:tenantId/subscriptions` | Listar suscripciones |
| GET | `/api/v1/subscriptions/:id` | Obtener suscripción |
| PATCH | `/api/v1/subscriptions/:id` | Actualizar suscripción |
| DELETE | `/api/v1/subscriptions/:id` | Cancelar suscripción |
| GET | `/api/v1/tenants/:tenantId/entitlements` | Obtener todos los entitlements |
| GET | `/api/v1/tenants/:tenantId/entitlements/:featureCode` | Verificar entitlement específico |
| POST | `/api/v1/tenants/:tenantId/usage` | Registrar evento de uso |
| POST | `/api/v1/tenants/:tenantId/overrides/:featureId` | Crear override de feature |
| GET | `/api/v1/tenants/:tenantId/overrides` | Listar overrides |
| DELETE | `/api/v1/overrides/:id` | Eliminar override |

## Planes predefinidos

| Plan | Precio Mensual | Precio Anual | Usuarios | Contactos |
|------|---------------|-------------|----------|-----------|
| Starter | $49.99 | $499.99 | 3 | 500 |
| Pro | $99.99 | $999.99 | 10 | 5,000 |
| Business | $249.99 | $2,499.99 | 50 | 50,000 |
| Enterprise | Personalizado | Personalizado | Ilimitado | Ilimitado |

## Decisiones técnicas

1. **Planes con features** — cada plan define qué features están habilitadas y con qué límites
2. **Entitlements** — verificación en tiempo real de acceso a features basado en plan + overrides
3. **Overrides** — permiten personalizar features por tenant sin cambiar el plan
4. **Usage tracking** — contadores por período (YYYY-MM) para features con límites
5. **Historial** — cada cambio de suscripción queda registrado
6. **NO billing automático** — solo estructura de datos, el cobro será en Sprint 15

## Pruebas

- Tests e2e para CRUD de planes
- Tests e2e para features
- Tests e2e para plan features
- Tests e2e para suscripciones
- Tests e2e para entitlements
- Tests e2e para usage tracking

## Criterios de aceptación

| Criterio | Estado |
|----------|--------|
| Tablas SaaS creadas | ✅ |
| CRUD de planes funciona | ✅ |
| Features y plan features funcionan | ✅ |
| Suscripciones funcionan | ✅ |
| Entitlements verifican acceso | ✅ |
| Usage tracking funciona | ✅ |
| Overrides funcionan | ✅ |
| Pruebas automatizadas | ✅ |
| Documentación Swagger | ✅ |

## Estado final

**COMPLETED**

---

Sprint 3 completado. Esperar instrucción humana para iniciar Sprint 4.
