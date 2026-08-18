import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, formatRelativeTime } from '../../shared';

interface Workflow {
  id: string;
  name: string;
  description?: string;
  triggerType: string;
  isActive: boolean;
  version: number;
  runCount: number;
  lastRunAt?: string;
  createdAt: string;
}

const mockWorkflows: Workflow[] = [
  { id: '1', name: 'Nuevo Lead → Asignar', description: 'Asigna automáticamente leads nuevos al equipo de ventas', triggerType: 'EVENT', isActive: true, version: 3, runCount: 245, lastRunAt: '2026-08-18T10:00:00Z', createdAt: '2026-08-15T10:00:00Z' },
  { id: '2', name: 'Ticket Sin Respuesta → Alertar', description: 'Envía alerta si ticket no tiene respuesta en 2 horas', triggerType: 'SCHEDULE', isActive: true, version: 2, runCount: 89, lastRunAt: '2026-08-18T09:00:00Z', createdAt: '2026-08-14T14:00:00Z' },
  { id: '3', name: 'Oportunidad Ganada → Facturar', description: 'Crea factura automática al ganar oportunidad', triggerType: 'EVENT', isActive: true, version: 1, runCount: 34, lastRunAt: '2026-08-17T16:00:00Z', createdAt: '2026-08-13T09:00:00Z' },
  { id: '4', name: 'Campaña Completada → Reporte', description: 'Genera reporte al completar campaña', triggerType: 'EVENT', isActive: false, version: 1, runCount: 12, createdAt: '2026-08-12T11:00:00Z' },
  { id: '5', name: 'Contacto Inactivo → Re-engagement', description: 'Inicia campaña de re-engagement después de 30 días', triggerType: 'SCHEDULE', isActive: true, version: 4, runCount: 156, lastRunAt: '2026-08-18T08:00:00Z', createdAt: '2026-08-10T16:00:00Z' },
];

const triggerLabels: Record<string, string> = {
  MANUAL: 'Manual',
  EVENT: 'Evento',
  SCHEDULE: 'Programado',
  WEBHOOK: 'Webhook',
};

export function WorkflowList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const workflows = mockWorkflows.filter((w) => {
    if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 1 && !w.isActive) return false;
    if (tab === 2 && w.isActive) return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Automatizaciones</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Crea flujos de trabajo para automatizar tareas repetitivas.</Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AppIcon name="plus" size={16} color="#FFFFFF" />}
          sx={{
            backgroundColor: colors.primary[600],
            '&:hover': { backgroundColor: colors.primary[700] },
            fontSize: 13,
            fontWeight: 500,
            borderRadius: radius.sm,
            px: 2,
          }}
        >
          Nuevo workflow
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 36,
            '& .MuiTab-root': {
              minHeight: 36,
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: colors.text.secondary,
              '&.Mui-selected': { color: colors.primary[600] },
            },
            '& .MuiTabs-indicator': { height: 2, backgroundColor: colors.primary[600] },
          }}
        >
          <Tab label={`Todos (${mockWorkflows.length})`} />
          <Tab label={`Activos (${mockWorkflows.filter((w) => w.isActive).length})`} />
          <Tab label={`Inactivos (${mockWorkflows.filter((w) => !w.isActive).length})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar workflows..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AppIcon name="search" size={15} color={colors.text.muted} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 240,
            '& .MuiOutlinedInput-root': { borderRadius: radius.sm, fontSize: 13, height: 34 },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {workflows.map((workflow) => (
          <Box
            key={workflow.id}
            sx={{
              p: 2,
              borderRadius: radius.md,
              border: `1px solid ${colors.border.default}`,
              backgroundColor: colors.surface.default,
              cursor: 'pointer',
              transition: transitions.fast,
              '&:hover': { borderColor: colors.primary[300] },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Box sx={{ fontSize: 14, fontWeight: 600, color: colors.text.primary }}>{workflow.name}</Box>
                  <Box sx={{ fontSize: 10, color: colors.text.muted, px: 0.5, py: 0.25, backgroundColor: colors.neutral[100], borderRadius: 1 }}>v{workflow.version}</Box>
                </Box>
                <Box sx={{ fontSize: 12, color: colors.text.secondary, mb: 1 }}>{workflow.description}</Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AppIcon name="zap" size={12} color={colors.primary[600]} />
                    <Box sx={{ fontSize: 11, color: colors.text.muted }}>{triggerLabels[workflow.triggerType]}</Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AppIcon name="play" size={12} color={colors.status.RESOLVED} />
                    <Box sx={{ fontSize: 11, color: colors.text.muted }}>{workflow.runCount} ejecuciones</Box>
                  </Box>
                  {workflow.lastRunAt && (
                    <Box sx={{ fontSize: 11, color: colors.text.muted }}>Última: {formatRelativeTime(workflow.lastRunAt)}</Box>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <StatusBadge status={workflow.isActive ? 'ACTIVE' : 'INACTIVE'} />
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<AppIcon name="play" size={12} color={colors.primary[600]} />}
                  sx={{
                    fontSize: 11,
                    color: colors.primary[600],
                    borderColor: colors.primary[300],
                    '&:hover': { borderColor: colors.primary[600] },
                    textTransform: 'none',
                  }}
                >
                  Ejecutar
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
