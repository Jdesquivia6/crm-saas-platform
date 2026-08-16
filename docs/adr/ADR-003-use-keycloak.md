# ADR-003: Keycloak para autenticación

## Estado

Aceptado (implementación en Sprint 2)

## Contexto

El CRM necesita un sistema de autenticación y autorización que soporte OAuth 2.0, OIDC, MFA, y que sea separado de la lógica de negocio.

## Decisión

Usar **Keycloak** como proveedor de identidad. El CRM administrará autorización (roles y permisos) de forma independiente.

## Consecuencias

### Positivas
- Estándar OAuth 2.0 / OIDC
- MFA incluido
- User federation (LDAP, AD)
- Admin console para gestión de usuarios
- Integración madura con NestJS

### Negativas
- Servicio adicional que requiere configuración
- Overhead de mantenimiento
- Complejidad inicial de configuración

## Nota

En Sprint 1 se usa un mecanismo temporal de desarrollo para proteger las APIs. Keycloak se integrará en Sprint 2.
