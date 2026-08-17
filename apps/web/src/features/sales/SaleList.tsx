import { Box } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { StatusBadge, formatRelativeTime } from '../../shared';

interface Sale {
  id: string;
  number: string;
  contactName?: string;
  company?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

const mockSales: Sale[] = [
  { id: '1', number: 'VTA-000001', contactName: 'Carlos Ruiz', company: 'Tech Corp', status: 'COMPLETED', totalAmount: 15000000, createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', number: 'VTA-000002', contactName: 'María López', company: 'Marketing Plus', status: 'PENDING', totalAmount: 5000000, createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', number: 'VTA-000003', contactName: 'Laura Sánchez', company: 'Design Studio', status: 'COMPLETED', totalAmount: 8000000, createdAt: '2026-08-15T09:00:00Z' },
];

const formatAmount = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

export function SaleList() {
  const sales = mockSales;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Ventas</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Historial de ventas realizadas.</Box>
        </Box>
      </Box>

      <Box sx={{ borderRadius: radius.md, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 110px 100px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>Número</Box>
          <Box>Contacto</Box>
          <Box>Estado</Box>
          <Box>Total</Box>
          <Box>Fecha</Box>
        </Box>
        {sales.map((sale) => (
          <Box
            key={sale.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 100px 110px 100px',
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
            <Box sx={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 500, color: colors.primary[600] }}>{sale.number}</Box>
            <Box>
              <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{sale.contactName}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{sale.company}</Box>
            </Box>
            <Box><StatusBadge status={sale.status} /></Box>
            <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{formatAmount(sale.totalAmount)}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.muted }}>{formatRelativeTime(sale.createdAt)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
