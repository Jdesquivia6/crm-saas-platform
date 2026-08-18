import { Box } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { AppIcon } from '../../design-system/components/AppIcon';

const channels = [
  { name: 'Email', sent: 1240, opened: 890, clicked: 320, color: colors.primary[600] },
  { name: 'WhatsApp', sent: 560, opened: 420, clicked: 180, color: colors.status.RESOLVED },
  { name: 'SMS', sent: 340, opened: 210, clicked: 45, color: colors.primary[500] },
  { name: 'Social', sent: 180, opened: 95, clicked: 30, color: colors.brand.secondary },
];

export function ChannelChart() {
  const maxSent = Math.max(...channels.map((c) => c.sent));

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
        <Box sx={{ fontSize: 14, fontWeight: 600, color: colors.text.primary }}>Rendimiento por Canal</Box>
        <AppIcon name="bar-chart-3" size={16} color={colors.text.muted} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {channels.map((channel) => (
          <Box key={channel.name}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{channel.name}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.muted }}>{channel.sent} enviados</Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, height: 8, borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.neutral[100] }}>
              <Box sx={{ width: `${(channel.opened / maxSent) * 100}%`, backgroundColor: channel.color, borderRadius: radius.sm }} />
              <Box sx={{ width: `${((channel.sent - channel.opened) / maxSent) * 100}%`, backgroundColor: colors.neutral[200], borderRadius: radius.sm }} />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
              <Box sx={{ fontSize: 10, color: colors.text.muted }}>Abiertos: {channel.opened}</Box>
              <Box sx={{ fontSize: 10, color: colors.text.muted }}>Clics: {channel.clicked}</Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
