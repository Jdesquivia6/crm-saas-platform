import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, formatRelativeTime } from '../../shared';

interface Segment {
  id: string;
  name: string;
  description?: string;
  type: string;
  memberCount: number;
  isActive: boolean;
  createdAt: string;
}

const mockSegments: Segment[] = [
  { id: '1', name: 'Clientes Enterprise', description: 'Contactos con plan Enterprise', type: 'DYNAMIC', memberCount: 45, isActive: true, createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', name: 'Leads Calificados', description: 'Leads con estado CALIFIED', type: 'DYNAMIC', memberCount: 128, isActive: true, createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', name: 'Inactivos 30 días', description: 'Contactos sin actividad por 30 días', type: 'DYNAMIC', memberCount: 89, isActive: true, createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', name: 'Eventos Q3', description: 'Asistentes al evento Q3', type: 'STATIC', memberCount: 67, isActive: true, createdAt: '2026-08-14T16:00:00Z' },
  { id: '5', name: 'Beta Testers', description: 'Usuarios del programa beta', type: 'STATIC', memberCount: 23, isActive: false, createdAt: '2026-08-13T11:00:00Z' },
];

const typeLabels: Record<string, string> = {
  STATIC: 'Estático',
  DYNAMIC: 'Dinámico',
};

export function SegmentList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const segments = mockSegments.filter((s) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 1 && s.type !== 'DYNAMIC') return false;
    if (tab === 2 && s.type !== 'STATIC') return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Segmentos</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Crea audiencias personalizadas para tus campañas.</Box>
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
          Nuevo segmento
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
          <Tab label={`Todos (${mockSegments.length})`} />
          <Tab label={`Dinámicos (${mockSegments.filter((s) => s.type === 'DYNAMIC').length})`} />
          <Tab label={`Estáticos (${mockSegments.filter((s) => s.type === 'STATIC').length})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar segmentos..."
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 90px 100px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>Nombre</Box>
          <Box>Tipo</Box>
          <Box>Miembros</Box>
          <Box>Estado</Box>
          <Box>Creado</Box>
        </Box>
        {segments.map((segment) => (
          <Box
            key={segment.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 100px 80px 90px 100px',
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
              <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{segment.name}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{segment.description}</Box>
            </Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{typeLabels[segment.type]}</Box>
            <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.primary[600] }}>{segment.memberCount}</Box>
            <Box><StatusBadge status={segment.isActive ? 'ACTIVE' : 'INACTIVE'} /></Box>
            <Box sx={{ fontSize: 11, color: colors.text.muted }}>{formatRelativeTime(segment.createdAt)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
