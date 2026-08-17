import { useState } from 'react';
import { Box, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, formatRelativeTime } from '../../shared';

interface PaymentIntent {
  id: string;
  number: string;
  contactName?: string;
  status: string;
  amount: number;
  amountReceived: number;
  paymentMethod?: string;
  currencyCode: string;
  createdAt: string;
}

const mockIntents: PaymentIntent[] = [
  { id: '1', number: 'PAY-000001', contactName: 'Carlos Ruiz', status: 'SUCCEEDED', amount: 15000000, amountReceived: 15000000, paymentMethod: 'CARD', currencyCode: 'COP', createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', number: 'PAY-000002', contactName: 'María López', status: 'PENDING', amount: 5000000, amountReceived: 0, paymentMethod: 'BANK_TRANSFER', currencyCode: 'COP', createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', number: 'PAY-000003', contactName: 'Laura Sánchez', status: 'FAILED', amount: 8000000, amountReceived: 0, paymentMethod: 'PSE', currencyCode: 'COP', createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', number: 'PAY-000004', contactName: 'Pedro Rodríguez', status: 'SUCCEEDED', amount: 12000000, amountReceived: 12000000, paymentMethod: 'NEQUI', currencyCode: 'COP', createdAt: '2026-08-14T16:00:00Z' },
  { id: '5', number: 'PAY-000005', contactName: 'Roberto Díaz', status: 'CANCELLED', amount: 3500000, amountReceived: 0, paymentMethod: 'CARD', currencyCode: 'COP', createdAt: '2026-08-13T11:00:00Z' },
];

const methodLabels: Record<string, string> = {
  CARD: 'Tarjeta',
  BANK_TRANSFER: 'Transferencia',
  PSE: 'PSE',
  NEQUI: 'Nequi',
  DAVIPLATA: 'Daviplata',
  CASH: 'Efectivo',
};

const formatAmount = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

export function PaymentList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const intents = mockIntents.filter((i) => {
    if (search && !i.number.toLowerCase().includes(search.toLowerCase()) && !i.contactName?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (tab === 1 && i.status !== 'PENDING') return false;
    if (tab === 2 && i.status !== 'SUCCEEDED') return false;
    if (tab === 3 && i.status !== 'FAILED') return false;
    return true;
  });

  const totalSucceeded = mockIntents.filter((i) => i.status === 'SUCCEEDED').reduce((sum, i) => sum + i.amountReceived, 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Pagos</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona tus cobros y transacciones.</Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 4, mb: 3, py: 2, borderBottom: `1px solid ${colors.border.default}` }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, lineHeight: 1 }}>{mockIntents.length}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Transacciones</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.status.RESOLVED, lineHeight: 1 }}>{formatAmount(totalSucceeded)}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Cobrado</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.status.CLOSED, lineHeight: 1 }}>{mockIntents.filter((i) => i.status === 'FAILED').length}</Box>
          <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>Fallidos</Box>
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
          <Tab label={`Todos (${mockIntents.length})`} />
          <Tab label={`Pendientes (${mockIntents.filter((i) => i.status === 'PENDING').length})`} />
          <Tab label={`Exitosos (${mockIntents.filter((i) => i.status === 'SUCCEEDED').length})`} />
          <Tab label={`Fallidos (${mockIntents.filter((i) => i.status === 'FAILED').length})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar pagos..."
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
          <Box>Monto</Box>
          <Box>Método</Box>
          <Box>Fecha</Box>
        </Box>
        {intents.map((intent) => (
          <Box
            key={intent.id}
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
            <Box sx={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 500, color: colors.primary[600] }}>{intent.number}</Box>
            <Box sx={{ fontSize: 13, color: colors.text.primary }}>{intent.contactName || '-'}</Box>
            <Box><StatusBadge status={intent.status} /></Box>
            <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{formatAmount(intent.amount)}</Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{methodLabels[intent.paymentMethod || ''] || intent.paymentMethod || '-'}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.muted }}>{formatRelativeTime(intent.createdAt)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
