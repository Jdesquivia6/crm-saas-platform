import { Box, Grid } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { KPIRow } from './KPIRow';
import { ChannelChart } from './ChannelChart';
import { RecentActivity } from './RecentActivity';

export function Dashboard() {
  return (
    <Box>
      <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Dashboard</Box>
      <Box sx={{ fontSize: 13, color: colors.text.secondary, mb: 3 }}>Resumen de métricas clave de tu CRM.</Box>

      <KPIRow />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8}>
          <ChannelChart />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentActivity />
        </Grid>
      </Grid>
    </Box>
  );
}
