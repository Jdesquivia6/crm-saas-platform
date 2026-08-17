import { Box, Button } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { PriorityBadge } from '../../shared';

interface Opportunity {
  id: string;
  number?: number;
  title: string;
  contactName?: string;
  company?: string;
  stageId: string;
  stageName: string;
  priority: string;
  channel?: string;
  amount?: number;
  expectedCloseDate?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  createdAt: string;
}

const mockStages = [
  { id: '1', name: 'Nuevo', color: colors.status.OPEN },
  { id: '2', name: 'Contactado', color: colors.status.IN_PROGRESS },
  { id: '3', name: 'Cotización', color: '#7367F0' },
  { id: '4', name: 'Negociación', color: colors.status.WAITING },
  { id: '5', name: 'Ganado', color: colors.status.RESOLVED },
];

const mockOpportunities: Opportunity[] = [
  { id: '1', title: 'Implementación CRM Tech Corp', contactName: 'Carlos Ruiz', company: 'Tech Corp', stageId: '1', stageName: 'Nuevo', priority: 'HIGH', amount: 15000000, assigneeName: 'Ana García', assigneeInitials: 'AG', createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', title: 'Licencia Marketing Plus', contactName: 'María López', company: 'Marketing Plus', stageId: '2', stageName: 'Contactado', priority: 'NORMAL', amount: 5000000, assigneeName: 'Carlos Martínez', assigneeInitials: 'CM', createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', title: 'Consultoría Design Studio', contactName: 'Laura Sánchez', company: 'Design Studio', stageId: '3', stageName: 'Cotización', priority: 'NORMAL', amount: 8000000, assigneeName: 'Luis Hernández', assigneeInitials: 'LH', createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', title: 'Soporte anual GlobalTech', contactName: 'Pedro Rodríguez', stageId: '4', stageName: 'Negociación', priority: 'HIGH', amount: 12000000, assigneeName: 'Ana García', assigneeInitials: 'AG', createdAt: '2026-08-14T16:00:00Z' },
  { id: '5', title: 'Migración cloud DataSoft', contactName: 'Roberto Díaz', stageId: '5', stageName: 'Ganado', priority: 'NORMAL', amount: 20000000, assigneeName: 'Carlos Martínez', assigneeInitials: 'CM', createdAt: '2026-08-13T11:00:00Z' },
];

export function PipelineBoard() {
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Pipeline</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Visualiza y gestiona tus oportunidades de venta.</Box>
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
          Nueva oportunidad
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, mb: 3, py: 2, borderBottom: `1px solid ${colors.border.default}` }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, lineHeight: 1 }}>{mockOpportunities.length}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Oportunidades</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, lineHeight: 1 }}>{formatAmount(mockOpportunities.reduce((sum, o) => sum + (o.amount || 0), 0))}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Valor total</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.status.RESOLVED, lineHeight: 1 }}>{mockOpportunities.filter((o) => o.stageId === '5').length}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Ganados</Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
        {mockStages.map((stage) => {
          const stageOpps = mockOpportunities.filter((o) => o.stageId === stage.id);
          const stageTotal = stageOpps.reduce((sum, o) => sum + (o.amount || 0), 0);

          return (
            <Box key={stage.id} sx={{ minWidth: 280, flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, px: 0.5 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: stage.color }} />
                <Box sx={{ fontSize: 12, fontWeight: 600, color: colors.text.secondary }}>{stage.name}</Box>
                <Box sx={{ fontSize: 11, color: colors.text.muted }}>({stageOpps.length})</Box>
                <Box sx={{ ml: 'auto', fontSize: 11, color: colors.text.muted }}>{formatAmount(stageTotal)}</Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {stageOpps.map((opp) => (
                  <Box
                    key={opp.id}
                    sx={{
                      p: 1.5,
                      borderRadius: radius.sm,
                      border: `1px solid ${colors.border.default}`,
                      backgroundColor: colors.surface.default,
                      cursor: 'pointer',
                      transition: transitions.fast,
                      '&:hover': { borderColor: colors.primary[300], boxShadow: '0 1px 3px rgba(22,17,46,0.06)' },
                    }}
                  >
                    <Box sx={{ fontSize: 13, fontWeight: 500, color: colors.text.primary, mb: 0.5, lineHeight: 1.3 }}>{opp.title}</Box>
                    <Box sx={{ fontSize: 11, color: colors.text.secondary, mb: 0.75 }}>{opp.contactName}{opp.company ? ` - ${opp.company}` : ''}</Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <PriorityBadge priority={opp.priority} />
                      <Box sx={{ fontSize: 12, fontWeight: 600, color: colors.primary[600] }}>{opp.amount ? formatAmount(opp.amount) : ''}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
