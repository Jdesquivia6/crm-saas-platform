import { useState } from 'react';
import { Box, Tabs, Tab, Button, TextField, InputAdornment } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, PriorityBadge, formatRelativeTime } from '../../shared';

interface Opportunity {
  id: string;
  title: string;
  contactName?: string;
  company?: string;
  stageName: string;
  status: string;
  priority: string;
  channel?: string;
  amount?: number;
  expectedCloseDate?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  createdAt: string;
}

const mockOpportunities: Opportunity[] = [
  { id: '1', title: 'Implementación CRM Tech Corp', contactName: 'Carlos Ruiz', company: 'Tech Corp', stageName: 'Nuevo', status: 'OPEN', priority: 'HIGH', amount: 15000000, assigneeName: 'Ana García', assigneeInitials: 'AG', createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', title: 'Licencia Marketing Plus', contactName: 'María López', company: 'Marketing Plus', stageName: 'Contactado', status: 'OPEN', priority: 'NORMAL', amount: 5000000, assigneeName: 'Carlos Martínez', assigneeInitials: 'CM', createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', title: 'Consultoría Design Studio', contactName: 'Laura Sánchez', company: 'Design Studio', stageName: 'Cotización', status: 'OPEN', priority: 'NORMAL', amount: 8000000, assigneeName: 'Luis Hernández', assigneeInitials: 'LH', createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', title: 'Soporte anual GlobalTech', contactName: 'Pedro Rodríguez', company: 'GlobalTech', stageName: 'Negociación', status: 'OPEN', priority: 'HIGH', amount: 12000000, assigneeName: 'Ana García', assigneeInitials: 'AG', createdAt: '2026-08-14T16:00:00Z' },
  { id: '5', title: 'Migración cloud DataSoft', contactName: 'Roberto Díaz', company: 'DataSoft', stageName: 'Ganado', status: 'WON', priority: 'NORMAL', amount: 20000000, assigneeName: 'Carlos Martínez', assigneeInitials: 'CM', createdAt: '2026-08-13T11:00:00Z' },
  { id: '6', title: 'App móvil FreshMarket', contactName: 'Ana Torres', company: 'FreshMarket', stageName: 'Perdido', status: 'LOST', priority: 'LOW', amount: 3500000, createdAt: '2026-08-12T09:00:00Z' },
];

export function OpportunityList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const opportunities = mockOpportunities.filter((o) => {
    if (search && !o.title.toLowerCase().includes(search.toLowerCase()) && !o.contactName?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (tab === 1 && o.status !== 'OPEN') return false;
    if (tab === 2 && o.status !== 'WON') return false;
    if (tab === 3 && o.status !== 'LOST') return false;
    return true;
  });

  const openCount = mockOpportunities.filter((o) => o.status === 'OPEN').length;
  const wonCount = mockOpportunities.filter((o) => o.status === 'WON').length;
  const lostCount = mockOpportunities.filter((o) => o.status === 'LOST').length;

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Oportunidades</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona tus oportunidades de venta.</Box>
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
          <Tab label={`Todas (${mockOpportunities.length})`} />
          <Tab label={`Abiertas (${openCount})`} />
          <Tab label={`Ganadas (${wonCount})`} />
          <Tab label={`Perdidas (${lostCount})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar oportunidades..."
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 120px 90px 100px 110px 100px 100px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>Título</Box>
          <Box>Contacto</Box>
          <Box>Estado</Box>
          <Box>Prioridad</Box>
          <Box>Monto</Box>
          <Box>Cierre esp.</Box>
          <Box>Creado</Box>
        </Box>
        {opportunities.map((opp) => (
          <Box
            key={opp.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 90px 100px 110px 100px 100px',
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
            <Box>
              <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{opp.title}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{opp.company}</Box>
            </Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{opp.contactName || '-'}</Box>
            <Box><StatusBadge status={opp.status === 'OPEN' ? 'IN_PROGRESS' : opp.status === 'WON' ? 'RESOLVED' : 'CLOSED'} /></Box>
            <Box><PriorityBadge priority={opp.priority} /></Box>
            <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.primary[600] }}>{opp.amount ? formatAmount(opp.amount) : '-'}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{opp.expectedCloseDate ? new Date(opp.expectedCloseDate).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' }) : '-'}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.muted }}>{formatRelativeTime(opp.createdAt)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
