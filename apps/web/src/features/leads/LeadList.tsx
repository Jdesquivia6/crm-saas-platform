import { useState } from 'react';
import { Box, Tabs, Tab, Button, TextField, InputAdornment } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, PriorityBadge, formatRelativeTime } from '../../shared';

interface Lead {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  status: string;
  priority: string;
  source?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  budget?: number;
  createdAt: string;
}

const mockLeads: Lead[] = [
  { id: '1', firstName: 'Carlos', lastName: 'Ruiz', email: 'carlos@email.com', company: 'Tech Corp', status: 'NEW', priority: 'HIGH', source: 'Web', assigneeName: 'Ana García', assigneeInitials: 'AG', budget: 5000000, createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', firstName: 'María', lastName: 'López', email: 'maria@email.com', company: 'Marketing Plus', status: 'CONTACTED', priority: 'NORMAL', source: 'Instagram', assigneeName: 'Carlos Martínez', assigneeInitials: 'CM', budget: 2000000, createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', firstName: 'Pedro', lastName: 'Rodríguez', email: 'pedro@email.com', status: 'QUALIFIED', priority: 'NORMAL', source: 'WhatsApp', assigneeName: 'Luis Hernández', assigneeInitials: 'LH', createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', firstName: 'Laura', lastName: 'Sánchez', email: 'laura@email.com', company: 'Design Studio', status: 'NEW', priority: 'URGENT', source: 'Email', createdAt: '2026-08-17T08:00:00Z' },
  { id: '5', firstName: 'Roberto', lastName: 'Díaz', email: 'roberto@email.com', status: 'UNQUALIFIED', priority: 'LOW', source: 'Web', createdAt: '2026-08-14T16:00:00Z' },
];

export function LeadList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const leads = mockLeads.filter((l) => {
    if (search && !l.firstName.toLowerCase().includes(search.toLowerCase()) && !l.lastName?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (tab === 1 && l.status !== 'NEW') return false;
    if (tab === 2 && l.status !== 'CONTACTED') return false;
    if (tab === 3 && l.status !== 'QUALIFIED') return false;
    return true;
  });

  const newCount = mockLeads.filter((l) => l.status === 'NEW').length;
  const contactedCount = mockLeads.filter((l) => l.status === 'CONTACTED').length;
  const qualifiedCount = mockLeads.filter((l) => l.status === 'QUALIFIED').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Leads</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona tus prospectos potenciales.</Box>
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
          Nuevo lead
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
          <Tab label={`Todos (${mockLeads.length})`} />
          <Tab label={`Nuevos (${newCount})`} />
          <Tab label={`Contactados (${contactedCount})`} />
          <Tab label={`Calificados (${qualifiedCount})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar leads..."
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 150px 100px 90px 100px 100px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>Nombre</Box>
          <Box>Empresa</Box>
          <Box>Estado</Box>
          <Box>Prioridad</Box>
          <Box>Presupuesto</Box>
          <Box>Creado</Box>
        </Box>
        {leads.map((lead) => (
          <Box
            key={lead.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 150px 100px 90px 100px 100px',
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
              <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{lead.firstName} {lead.lastName}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{lead.email}</Box>
            </Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{lead.company || '-'}</Box>
            <Box><StatusBadge status={lead.status} /></Box>
            <Box><PriorityBadge priority={lead.priority} /></Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{lead.budget ? `$${(lead.budget / 1000000).toFixed(1)}M` : '-'}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.muted }}>{formatRelativeTime(lead.createdAt)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
