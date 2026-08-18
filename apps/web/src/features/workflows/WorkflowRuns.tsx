import { Box, Button } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, formatRelativeTime } from '../../shared';

interface WorkflowRun {
  id: string;
  workflowName: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  nodesExecuted: number;
}

const mockRuns: WorkflowRun[] = [
  { id: '1', workflowName: 'Nuevo Lead → Asignar', status: 'COMPLETED', startedAt: '2026-08-18T10:00:00Z', completedAt: '2026-08-18T10:00:01Z', durationMs: 1200, nodesExecuted: 3 },
  { id: '2', workflowName: 'Ticket Sin Respuesta → Alertar', status: 'RUNNING', startedAt: '2026-08-18T09:00:00Z', nodesExecuted: 2 },
  { id: '3', workflowName: 'Oportunidad Ganada → Facturar', status: 'COMPLETED', startedAt: '2026-08-17T16:00:00Z', completedAt: '2026-08-17T16:00:02Z', durationMs: 2100, nodesExecuted: 4 },
  { id: '4', workflowName: 'Contacto Inactivo → Re-engagement', status: 'FAILED', startedAt: '2026-08-18T08:00:00Z', completedAt: '2026-08-18T08:00:01Z', durationMs: 850, nodesExecuted: 2 },
  { id: '5', workflowName: 'Nuevo Lead → Asignar', status: 'COMPLETED', startedAt: '2026-08-17T14:00:00Z', completedAt: '2026-08-17T14:00:01Z', durationMs: 980, nodesExecuted: 3 },
];

export function WorkflowRuns() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Ejecuciones</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Historial de ejecuciones de workflows.</Box>
        </Box>
      </Box>

      <Box sx={{ borderRadius: radius.md, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 80px 100px 80px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>Workflow</Box>
          <Box>Estado</Box>
          <Box>Iniciado</Box>
          <Box>Duración</Box>
          <Box>Nodos</Box>
          <Box>Acciones</Box>
        </Box>
        {mockRuns.map((run) => (
          <Box
            key={run.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 120px 80px 100px 80px',
              gap: 1,
              px: 2,
              py: 1.25,
              borderBottom: `1px solid ${colors.border.default}`,
              cursor: 'pointer',
              transition: transitions.fast,
              '&:hover': { backgroundColor: colors.neutral[50] },
              alignItems: 'center',
              '&:last-child': { borderBottom: 'none' },
            }}
          >
            <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{run.workflowName}</Box>
            <Box><StatusBadge status={run.status} /></Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{formatRelativeTime(run.startedAt)}</Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{run.durationMs ? `${run.durationMs}ms` : '-'}</Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{run.nodesExecuted}</Box>
            <Box>
              <Button
                size="small"
                startIcon={<AppIcon name="eye" size={12} color={colors.primary[600]} />}
                sx={{ fontSize: 11, color: colors.primary[600], textTransform: 'none' }}
              >
                Ver
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
