import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge } from '../../shared';

interface Invoice {
  id: string;
  number: string;
  contactName?: string;
  company?: string;
  status: string;
  totalAmount: number;
  paidAmount: number;
  dueDate?: string;
  createdAt: string;
}

const mockInvoices: Invoice[] = [
  { id: '1', number: 'FAC-000001', contactName: 'Carlos Ruiz', company: 'Tech Corp', status: 'PAID', totalAmount: 15000000, paidAmount: 15000000, createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', number: 'FAC-000002', contactName: 'María López', company: 'Marketing Plus', status: 'SENT', totalAmount: 5000000, paidAmount: 0, dueDate: '2026-09-16T00:00:00Z', createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', number: 'FAC-000003', contactName: 'Laura Sánchez', company: 'Design Studio', status: 'OVERDUE', totalAmount: 8000000, paidAmount: 2000000, dueDate: '2026-08-15T00:00:00Z', createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', number: 'FAC-000004', contactName: 'Pedro Rodríguez', company: 'GlobalTech', status: 'DRAFT', totalAmount: 12000000, paidAmount: 0, createdAt: '2026-08-14T16:00:00Z' },
];

const formatAmount = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

export function InvoiceList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const invoices = mockInvoices.filter((i) => {
    if (search && !i.number.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 1 && i.status !== 'PENDING' && i.status !== 'SENT') return false;
    if (tab === 2 && i.status !== 'PAID') return false;
    if (tab === 3 && i.status !== 'OVERDUE') return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Facturas</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona tus facturas y cobros.</Box>
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
          Nueva factura
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
          <Tab label={`Todas (${mockInvoices.length})`} />
          <Tab label={`Pendientes (${mockInvoices.filter((i) => i.status === 'PENDING' || i.status === 'SENT').length})`} />
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
          <Box>Contacto</Box>
          <Box>Estado</Box>
          <Box>Total</Box>
          <Box>Pagado</Box>
          <Box>Vencimiento</Box>
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
            <Box>
              <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{invoice.contactName}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{invoice.company}</Box>
            </Box>
            <Box><StatusBadge status={invoice.status} /></Box>
            <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{formatAmount(invoice.totalAmount)}</Box>
            <Box sx={{ fontSize: 12, color: invoice.paidAmount > 0 ? colors.status.RESOLVED : colors.text.muted }}>{formatAmount(invoice.paidAmount)}</Box>
            <Box sx={{ fontSize: 11, color: invoice.status === 'OVERDUE' ? colors.status.CLOSED : colors.text.secondary }}>
              {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }) : '-'}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
