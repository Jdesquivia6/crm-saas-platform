import { Box } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';

const kpis = [
  { label: 'Contactos', value: '2,847', change: '+12%', trend: 'up', icon: 'users' },
  { label: 'Leads', value: '456', change: '+8%', trend: 'up', icon: 'target' },
  { label: 'Oportunidades', value: '89', change: '+15%', trend: 'up', icon: 'briefcase' },
  { label: 'Ticket Activos', value: '23', change: '-5%', trend: 'down', icon: 'headphones' },
  { label: 'MRR', value: '$45,200', change: '+10%', trend: 'up', icon: 'dollar-sign' },
];

export function KPIRow() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {kpis.map((kpi) => (
        <Box
          key={kpi.label}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: radius.md,
            border: `1px solid ${colors.border.default}`,
            backgroundColor: colors.surface.default,
            transition: transitions.fast,
            '&:hover': { borderColor: colors.primary[300] },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box sx={{ fontSize: 11, fontWeight: 500, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</Box>
            <AppIcon name={kpi.icon} size={15} color={colors.text.muted} />
          </Box>
          <Box sx={{ fontSize: 24, fontWeight: 700, color: colors.text.primary, mb: 0.5 }}>{kpi.value}</Box>
          <Box sx={{ fontSize: 12, color: kpi.trend === 'up' ? colors.status.RESOLVED : colors.status.IN_PROGRESS, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AppIcon name={kpi.trend === 'up' ? 'trending-up' : 'trending-down'} size={12} color={kpi.trend === 'up' ? colors.status.RESOLVED : colors.status.IN_PROGRESS} />
            {kpi.change} vs mes anterior
          </Box>
        </Box>
      ))}
    </Box>
  );
}
