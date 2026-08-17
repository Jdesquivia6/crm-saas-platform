# UI AUDIT — Sprint 10

## 1. Componentes Existentes

| Componente | Archivo | Estado |
|------------|---------|--------|
| DashboardLayout | `layouts/DashboardLayout.tsx` | MUI AppBar + Drawer básico |
| DashboardPage | `pages/DashboardPage.tsx` | Cards simples con emojis |
| TenantsPage | `pages/TenantsPage.tsx` | Tabla MUI estándar |
| Sidebar | `design-system/components/Sidebar.tsx` | Nuevo, usa emojis |
| Topbar | `design-system/components/Topbar.tsx` | Nuevo, usa emojis |
| AppShell | `design-system/layouts/AppShell.tsx` | Nuevo |
| StatusBadge | `shared/index.tsx` | Usa emojis en badges |
| PriorityBadge | `shared/index.tsx` | Usa emojis |
| ChannelBadge | `shared/index.tsx` | Usa emojis |
| MetricCard | `shared/index.tsx` | Usa emojis |
| TicketList | `features/tickets/TicketList.tsx` | Usa emojis |
| TicketDrawer | `features/tickets/TicketDrawer.tsx` | Usa emojis |

## 2. Inconsistencias Visuales

- Mezcla de MUI estándar con componentes custom
- Emojis como iconografía (⚠️, 🔴, 🟡, 🔵, ⚪, 💬, 📷, 👤, ✉️, 📞, 🌐)
- Colores inline en DashboardPage (`#1976d2`)
- badges excesivamente grandes
- border-radius excesivo (radius.full en badges)
- sombras fuertes en drawer

## 3. Uso Actual de Emojis

- Sidebar: iconos de navegación son emojis
- Topbar: 🔔 notificaciones, 👤 usuario
- StatusBadge: emojis por estado
- PriorityBadge: 🔴🟡🔵⚪ por prioridad
- ChannelBadge: 💬📷👤✉️📞🌐 por canal
- MetricCard: emojis como iconos
- TicketList: ⚠️ SLA, 🎫 tickets
- TicketDrawer: 🎫👤 emojis en timeline

## 4. Icon Libraries Existentes

- `@mui/icons-material` (instalado pero subutilizado)
- Emojis Unicode (usado como reemplazo)

## 5. Tipografías Existentes

- Inter (declarada en theme.ts)
- Fallback: Roboto, Helvetica, Arial, sans-serif

## 6. Colores Existentes

- Primary: `#1976d2` (MUI default blue)
- Secondary: `#9c27b0` (MUI default purple)
- Background: `#f5f5f5`
- Personalizados en `design-system/tokens/colors.ts` (nuevos, no alineados)

## 7. Layout Actual

- AppBar fijo + Drawer permanente
- Sidebar de 260px
- Topbar genérica
- Sin responsive design

## 8. Rutas Públicas

- Ninguna actualmente

## 9. Rutas Privadas

- `/dashboard`
- `/tenants`
- `/tickets`
- `/inbox` (placeholder)
- `/contacts` (placeholder)
- `/pipeline` (placeholder)
- `/settings` (placeholder)

## 10. Componentes Reutilizables

- StatusBadge, PriorityBadge, ChannelBadge
- MetricCard, EmptyState, SkeletonRow
- formatRelativeTime, formatCurrency

## 11. Componentes a Sustituir

- DashboardLayout → AppShell
- Sidebar actual → Sidebar sin emojis
- Topbar actual → Topbar minimalista
- Todos los badges → Badges con SVG icons
- MetricCard → MetricCard sin emojis

## 12. Riesgo de Regresiones

- Bajo: Solo se modifica presentación, no lógica
- Las rutas existentes se mantienen
- El backend no se modifica

## 13. Plan de Migración

1. Crear Design System tokens alineados
2. Crear AppIcon (SVG icon system)
3. Rebuild Sidebar/Topbar/AppShell
4. Crear PublicLayout + Landing
5. Crear Login/Register
6. Rebuild Tickets module
7. Actualizar rutas
