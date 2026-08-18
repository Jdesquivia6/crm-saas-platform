import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge } from '../../shared';

interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  maxTokens: number;
  temperature: number;
  isActive: boolean;
  createdAt: string;
}

const mockConfigs: ModelConfig[] = [
  { id: '1', name: 'GPT-4o Principal', provider: 'openai', model: 'gpt-4o', maxTokens: 4096, temperature: 0.7, isActive: true, createdAt: '2026-08-18T10:00:00Z' },
  { id: '2', name: 'Claude Sonnet', provider: 'anthropic', model: 'claude-3-5-sonnet-20241022', maxTokens: 8192, temperature: 0.5, isActive: true, createdAt: '2026-08-17T14:00:00Z' },
  { id: '3', name: 'GPT-3.5 Rápido', provider: 'openai', model: 'gpt-3.5-turbo', maxTokens: 4096, temperature: 0.3, isActive: false, createdAt: '2026-08-16T09:00:00Z' },
];

const providerLabels: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  google: 'Google',
  azure: 'Azure',
  custom: 'Custom',
};

export function ModelConfigList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const configs = mockConfigs.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (tab === 1 && !c.isActive) return false;
    if (tab === 2 && c.isActive) return false;
    return true;
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Modelos IA</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Configura los modelos de IA para tu CRM.</Box>
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
          Nuevo modelo
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
          <Tab label={`Todos (${mockConfigs.length})`} />
          <Tab label={`Activos (${mockConfigs.filter((c) => c.isActive).length})`} />
          <Tab label={`Inactivos (${mockConfigs.filter((c) => !c.isActive).length})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar modelos..."
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
        {configs.map((config) => (
          <Box
            key={config.id}
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
                <Box sx={{ fontSize: 14, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>{config.name}</Box>
                <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{providerLabels[config.provider]} • {config.model}</Box>
              </Box>
              <StatusBadge status={config.isActive ? 'ACTIVE' : 'INACTIVE'} />
            </Box>
            <Box sx={{ display: 'flex', gap: 3, mt: 1.5 }}>
              <Box>
                <Box sx={{ fontSize: 10, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Max Tokens</Box>
                <Box sx={{ fontSize: 13, fontWeight: 500, color: colors.text.primary }}>{config.maxTokens.toLocaleString()}</Box>
              </Box>
              <Box>
                <Box sx={{ fontSize: 10, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Temperature</Box>
                <Box sx={{ fontSize: 13, fontWeight: 500, color: colors.text.primary }}>{config.temperature}</Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
