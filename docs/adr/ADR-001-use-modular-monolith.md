# ADR-001: Monolito Modular

## Estado

Aceptado

## Contexto

El proyecto CRM SaaS Omnicanal requiere una arquitectura que soporte multi-tenancy, múltiples módulos funcionales (CRM, ventas, soporte, marketing, automatizaciones, IA) y que sea mantenible a lo largo de 20 sprints de desarrollo.

## Decisión

Iniciar con un **monolito modular** usando NestJS como framework backend. Los módulos se organizan por dominio de negocio (platform, crm, sales, support, messaging, etc.) con comunicación interna directa.

## Consecuencias

### Positivas
- Despliegue simplificado (un solo servicio)
- Comunicación interna rápida (llamadas de función)
- Facilidad para desarrollar y probar en local
- Menor complejidad operativa inicial

### Negativas
- Acoplamiento temporal entre módulos (mitigado con interfaces)
- Escalado horizontal completo requiere duplicar todo el monolito
- Deploy de un módulo implica deploy de todos

### Mitigaciones
- Cada módulo tiene su propio controller, service, repository
- Los módulos se comunican a través de interfaces (NestJS modules con exports)
- Preparado para separación futura si el volumen lo exige
- No se crean dependencias circulares entre módulos

## Alternativas Consideradas

1. **Microservicios desde el inicio**: Rechazado por complejidad operativa prematura
2. **Serverless**: Rechazado por cold starts y dependencia de proveedor
3. **Monolito sin modularidad**: Rechazado por dificultad de separación futura
