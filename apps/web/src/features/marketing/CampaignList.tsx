import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge } from '../../shared';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  segmentName?: string;
  totalRecipients: number;
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Lanzamiento Nueva Función', type: 'EMAIL', status: 'COMPLETED', segmentName: 'Clientes Enterprise', totalRecipients: 45, totalSent: 45, totalOpened: 38, totalClicked: 22, createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', name: 'Promoción Q3', type: 'WHATSAPP', status: 'RUNNING', segmentName: 'Leads Calificados', totalRecipients: 128, totalSent: 128, totalOpened: 95, totalClicked: 41, createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', name: 'Newsletter Agosto', type: 'EMAIL', status: 'DRAFT', segmentName: 'Todos los contactos', totalRecipients: 0, totalSent: 0, totalOpened: 0, totalClicked: 0, createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', name: 'Re-engagement Inactivos', type: 'EMAIL', status: 'SCHEDULED', segmentName: 'Inactivos 30 días', totalRecipients: 89, totalSent: 0, totalOpened: 0, totalClicked: 0, createdAt: '2026-08-14T16:00:00Z' },
  { id: '5', name: 'Evento Premium', type: 'SMS', status: 'PAUSED', segmentName: 'Eventos Q3', totalRecipients: 67, totalSent: 40, totalOpened: 0, totalClicked: 0, createdAt: '2026-08-13T11:00:00Z' },
];

const typeLabels: Record<string, string> = {
  EMAIL: 'Email',
  SMS: 'SMS',
  WHATSAPP: 'WhatsApp',
  PUSH: 'Push',
  SOCIAL: 'Social',
};

const formatPercent = (num: number, total: number) => {
  if (total === 0) return '0%';
  return `${Math.round((num / total) * 100)}%`;
};

export function CampaignList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const campaigns = mockCampaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 1 && c.status !== 'DRAFT' && c.status !== 'SCHEDULED') return false;
    if (tab === 2 && c.status !== 'RUNNING') return false;
    if (tab === 3 && c.status !== 'COMPLETED') return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Campañas</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Crea y gestiona campañas de marketing multicanal.</Box>
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
          Nueva campaña
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
          <Tab label={`Todas (${mockCampaigns.length})`} />
          <Tab label={`Borradores (${mockCampaigns.filter((c) => c.status === 'DRAFT' || c.status === 'SCHEDULED').length})`} />
          <Tab label={`Activas (${mockCampaigns.filter((c) => c.status === 'RUNNING').length})`} />
          <Tab label={`Completadas (${mockCampaigns.filter((c) => c.status === 'COMPLETED').length})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar campañas..."
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 80px 80px 80px 100px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>Nombre</Box>
          <Box>Tipo</Box>
          <Box>Segmento</Box>
          <Box>Estado</Box>
          <Box>Enviados</Box>
          <Box>Aperturas</Box>
          <Box>Clics</Box>
        </Box>
        {campaigns.map((campaign) => (
          <Box
            key={campaign.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 100px 80px 80px 80px 100px',
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
              <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{campaign.name}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{campaign.segmentName}</Box>
            </Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{typeLabels[campaign.type]}</Box>
            <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{campaign.segmentName}</Box>
            <Box><StatusBadge status={campaign.status} /></Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{campaign.totalSent}</Box>
            <Box sx={{ fontSize: 12, color: colors.status.RESOLVED }}>{formatPercent(campaign.totalOpened, campaign.totalSent)}</Box>
            <Box sx={{ fontSize: 12, color: colors.primary[600] }}>{formatPercent(campaign.totalClicked, campaign.totalSent)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
