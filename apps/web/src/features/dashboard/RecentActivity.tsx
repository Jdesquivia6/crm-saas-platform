import { Box } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { AppIcon } from '../../design-system/components/AppIcon';

const activities = [
  { icon: 'user-plus', text: 'Nuevo contacto: María García', time: 'Hace 5 min', color: colors.status.RESOLVED },
  { icon: 'target', text: 'Lead calificado: TechCorp', time: 'Hace 12 min', color: colors.primary[600] },
  { icon: 'check-circle', text: 'Ticket #1234 resuelto', time: 'Hace 25 min', color: colors.status.RESOLVED },
  { icon: 'message-circle', text: 'Nuevo mensaje WhatsApp de Juan', time: 'Hace 30 min', color: colors.status.IN_PROGRESS },
  { icon: 'briefcase', text: 'Oportunidad ganada: $12,500', time: 'Hace 1 hora', color: colors.status.RESOLVED },
  { icon: 'mail', text: 'Campaña "Lanzamiento" completada', time: 'Hace 2 horas', color: colors.brand.secondary },
  { icon: 'phone', text: 'Llamada programada con Ana', time: 'Hace 3 horas', color: colors.text.muted },
  { icon: 'file-text', text: 'Cotización #COT-0012 enviada', time: 'Hace 4 horas', color: colors.primary[600] },
];

export function RecentActivity() {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: radius.md,
        border: `1px solid ${colors.border.default}`,
        backgroundColor: colors.surface.default,
        height: '100%',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ fontSize: 14, fontWeight: 600, color: colors.text.primary }}>Actividad Reciente</Box>
        <AppIcon name="clock" size={16} color={colors.text.muted} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {activities.map((activity, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: colors.neutral[50],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <AppIcon name={activity.icon} size={14} color={activity.color} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ fontSize: 12, color: colors.text.primary, lineHeight: 1.4 }}>{activity.text}</Box>
              <Box sx={{ fontSize: 10, color: colors.text.muted, mt: 0.25 }}>{activity.time}</Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
