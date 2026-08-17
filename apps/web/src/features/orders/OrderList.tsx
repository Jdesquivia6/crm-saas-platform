import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, formatRelativeTime } from '../../shared';

interface Order {
  id: string;
  number: string;
  contactName?: string;
  company?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

const mockOrders: Order[] = [
  { id: '1', number: 'PED-000001', contactName: 'Carlos Ruiz', company: 'Tech Corp', status: 'CONFIRMED', totalAmount: 15000000, createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', number: 'PED-000002', contactName: 'María López', company: 'Marketing Plus', status: 'PROCESSING', totalAmount: 5000000, createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', number: 'PED-000003', contactName: 'Laura Sánchez', company: 'Design Studio', status: 'PENDING', totalAmount: 8000000, createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', number: 'PED-000004', contactName: 'Pedro Rodríguez', company: 'GlobalTech', status: 'SHIPPED', totalAmount: 12000000, createdAt: '2026-08-14T16:00:00Z' },
  { id: '5', number: 'PED-000005', contactName: 'Roberto Díaz', company: 'DataSoft', status: 'DELIVERED', totalAmount: 3500000, createdAt: '2026-08-13T11:00:00Z' },
];

const formatAmount = (amount: number) => {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
};

export function OrderList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const orders = mockOrders.filter((o) => {
    if (search && !o.number.toLowerCase().includes(search.toLowerCase()) && !o.contactName?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (tab === 1 && o.status !== 'PENDING') return false;
    if (tab === 2 && o.status !== 'CONFIRMED') return false;
    if (tab === 3 && o.status !== 'PROCESSING') return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Pedidos</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona tus pedidos de venta.</Box>
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
          Nuevo pedido
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
          <Tab label={`Todos (${mockOrders.length})`} />
          <Tab label={`Pendientes (${mockOrders.filter((o) => o.status === 'PENDING').length})`} />
          <Tab label={`Confirmados (${mockOrders.filter((o) => o.status === 'CONFIRMED').length})`} />
          <Tab label={`En proceso (${mockOrders.filter((o) => o.status === 'PROCESSING').length})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar pedidos..."
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 110px 100px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>Número</Box>
          <Box>Contacto</Box>
          <Box>Estado</Box>
          <Box>Total</Box>
          <Box>Creado</Box>
        </Box>
        {orders.map((order) => (
          <Box
            key={order.id}
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
            <Box sx={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 500, color: colors.primary[600] }}>{order.number}</Box>
            <Box>
              <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{order.contactName}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{order.company}</Box>
            </Box>
            <Box><StatusBadge status={order.status} /></Box>
            <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.text.primary }}>{formatAmount(order.totalAmount)}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.muted }}>{formatRelativeTime(order.createdAt)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
