import { useState } from 'react';
import { Box, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge } from '../../shared';

interface BillingInvoice {
  id: string;
  number: string;
  planName: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

const mockInvoices: BillingInvoice[] = [
  { id: '1', number: 'BOL-000001', planName: 'Enterprise', status: 'PAID', totalAmount: 500000, paidAmount: 500000, dueDate: '2026-08-17T00:00:00Z', periodStart: '2026-07-17T00:00:00Z', periodEnd: '2026-08-17T00:00:00Z', createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', number: 'BOL-000002', planName: 'Professional', status: 'PENDING', totalAmount: 250000, paidAmount: 0, dueDate: '2026-09-16T00:00:00Z', periodStart: '2026-08-16T00:00:00Z', periodEnd: '2026-09-16T00:00:00Z', createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', number: 'BOL-000003', planName: 'Basic', status: 'OVERDUE', totalAmount: 100000, paidAmount: 0, dueDate: '2026-08-15T00:00:00Z', periodStart: '2026-07-15T00:00:00Z', periodEnd: '2026-08-15T00:00:00Z', createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', number: 'BOL-000004', planName: 'Enterprise', status: 'DRAFT', totalAmount: 500000, paidAmount: 0, dueDate: '2026-09-14T00:00:00Z', periodStart: '2026-08-14T00:00:00Z', periodEnd: '2026-09-14T00:00:00Z', createdAt: '2026-08-14T16:00:00Z' },
];

const formatAmount = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

export function BillingInvoiceList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const invoices = mockInvoices.filter((i) => {
    if (search && !i.number.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 1 && i.status !== 'PENDING') return false;
    if (tab === 2 && i.status !== 'PAID') return false;
    if (tab === 3 && i.status !== 'OVERDUE') return false;
    return true;
  });

  const totalRevenue = mockInvoices.filter((i) => i.status === 'PAID').reduce((sum, i) => sum + i.paidAmount, 0);
  const totalPending = mockInvoices.filter((i) => i.status === 'PENDING' || i.status === 'OVERDUE').reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Facturación SaaS</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona las facturas de suscripción de tus clientes.</Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, mb: 3, py: 2, borderBottom: `1px solid ${colors.border.default}` }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, lineHeight: 1 }}>{mockInvoices.length}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Facturas</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.status.RESOLVED, lineHeight: 1 }}>{formatAmount(totalRevenue)}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Cobrado</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.status.WAITING, lineHeight: 1 }}>{formatAmount(totalPending)}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Pendiente</Box>
        </Box>
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
          <Tab label={`Todas (${mockInvoices.length})`} />
          <Tab label={`Pendientes (${mockInvoices.filter((i) => i.status === 'PENDING').length})`} />
          <Tab label={`Pagadas (${mockInvoices.filter((i) => i.status === 'PAID').length})`} />
          <Tab label={`Vencidas (${mockInvoices.filter((i) => i.status === 'OVERDUE').length})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar facturas..."
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

      <Box sx={{ borderRadius: radius.md, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 110px 110px 100px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>Número</Box>
          <Box>Plan</Box>
          <Box>Estado</Box>
          <Box>Total</Box>
          <Box>Vencimiento</Box>
          <Box>Período</Box>
        </Box>
        {invoices.map((invoice) => (
          <Box
            key={invoice.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '120px 1fr 100px 110px 110px 100px',
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
            <Box sx={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 500, color: colors.primary[600] }}>{invoice.number}</Box>
            <Box sx={{ fontSize: 13, color: colors.text.primary }}>{invoice.planName}</Box>
            <Box><StatusBadge status={invoice.status} /></Box>
            <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{formatAmount(invoice.totalAmount)}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{new Date(invoice.dueDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.muted }}>
              {new Date(invoice.periodStart).toLocaleDateString('es-MX', { month: 'short' })} - {new Date(invoice.periodEnd).toLocaleDateString('es-MX', { month: 'short' })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
