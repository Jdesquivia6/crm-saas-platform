import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge } from '../../shared';

interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  type: string;
  documentCount: number;
  isActive: boolean;
  createdAt: string;
}

const mockBases: KnowledgeBase[] = [
  { id: '1', name: 'FAQ Productos', description: 'Preguntas frecuentes sobre productos', type: 'FAQ', documentCount: 45, isActive: true, createdAt: '2026-08-18T10:00:00Z' },
  { id: '2', name: 'Políticas de Venta', description: 'Políticas y procedimientos de venta', type: 'POLICY', documentCount: 12, isActive: true, createdAt: '2026-08-17T14:00:00Z' },
  { id: '3', name: 'Documentación Técnica', description: 'Documentación técnica de productos', type: 'DOCUMENTATION', documentCount: 28, isActive: true, createdAt: '2026-08-16T09:00:00Z' },
  { id: '4', name: 'Base de Conocimiento Legacy', description: 'Base antigua migrada', type: 'FAQ', documentCount: 120, isActive: false, createdAt: '2026-08-15T11:00:00Z' },
];

const typeLabels: Record<string, string> = {
  FAQ: 'FAQ',
  DOCUMENTATION: 'Documentación',
  POLICY: 'Políticas',
  PRODUCT: 'Productos',
};

export function KnowledgeBaseList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const bases = mockBases.filter((b) => {
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 1 && b.type !== 'FAQ') return false;
    if (tab === 2 && b.type !== 'DOCUMENTATION') return false;
    if (tab === 3 && b.type !== 'POLICY') return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Base de Conocimiento</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona el conocimiento para el asistente IA.</Box>
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
          Nueva base
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
          <Tab label={`Todas (${mockBases.length})`} />
          <Tab label={`FAQ (${mockBases.filter((b) => b.type === 'FAQ').length})`} />
          <Tab label={`Docs (${mockBases.filter((b) => b.type === 'DOCUMENTATION').length})`} />
          <Tab label={`Políticas (${mockBases.filter((b) => b.type === 'POLICY').length})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar bases..."
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {bases.map((base) => (
          <Box
            key={base.id}
            sx={{
              p: 2,
              borderRadius: radius.md,
              border: `1px solid ${colors.border.default}`,
              backgroundColor: colors.surface.default,
              cursor: 'pointer',
              transition: transitions.fast,
              '&:hover': { borderColor: colors.primary[300] },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Box sx={{ fontSize: 14, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>{base.name}</Box>
                <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{base.description}</Box>
              </Box>
              <StatusBadge status={base.isActive ? 'ACTIVE' : 'INACTIVE'} />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, mt: 1.5 }}>
              <Box>
                <Box sx={{ fontSize: 10, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tipo</Box>
                <Box sx={{ fontSize: 13, fontWeight: 500, color: colors.text.primary }}>{typeLabels[base.type]}</Box>
              </Box>
              <Box>
                <Box sx={{ fontSize: 10, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Documentos</Box>
                <Box sx={{ fontSize: 13, fontWeight: 500, color: colors.primary[600] }}>{base.documentCount}</Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
