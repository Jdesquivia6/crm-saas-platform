# ADR-002: PostgreSQL como base de datos principal

## Estado

Aceptado

## Contexto

El CRM necesita una base de datos relacional robusta que soporte multi-tenancy, consultas complejas, JSONB para datos flexibles, y que sea escalable.

## Decisión

Usar **PostgreSQL 16** como base de datos principal, con Prisma ORM como capa de acceso.

## Consecuencias

### Positivas
- Soporte nativo para JSONB (configuraciones variables)
- Row Level Security para protección adicional de multi-tenancy
- UUID como tipo de dato nativo
- Excelente rendimiento con índices compuestos
- Comunidad madura y extensa documentación

### Negativas
- Prisma tiene limitaciones con schemas múltiples (se usa `public` inicialmente)
- Migraciones requieren cuidado en producción

## Alternativas Consideradas

1. **MySQL**: Rechazado por menor soporte JSONB y ausencia de RLS
2. **MongoDB**: Rechazado por necesidad de integridad referencial y relaciones complejas
3. **CockroachDB**: Considerado para futuro si se necesita escalabilidad distribuida
