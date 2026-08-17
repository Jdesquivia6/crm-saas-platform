import { useState } from 'react';
import { Box, Button, TextField, InputAdornment, Tabs, Tab } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';

interface Product {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  categoryName?: string;
  type: string;
  unit: string;
  taxIncluded: boolean;
  isActive: boolean;
  variantCount: number;
  createdAt: string;
}

const mockProducts: Product[] = [
  { id: '1', sku: 'CRM-ENT-001', name: 'Licencia CRM Enterprise', description: 'Licencia anual para CRM completo', categoryName: 'Software', type: 'DIGITAL', unit: 'MONTH', taxIncluded: true, isActive: true, variantCount: 3, createdAt: '2026-08-17T10:00:00Z' },
  { id: '2', sku: 'SVC-IMP-001', name: 'Servicio de Implementación', description: 'Implementación personalizada del sistema', categoryName: 'Servicios', type: 'SERVICE', unit: 'HOUR', taxIncluded: true, isActive: true, variantCount: 0, createdAt: '2026-08-16T14:00:00Z' },
  { id: '3', sku: 'HW-ACC-001', name: 'Lector de Código de Barras', description: 'Lector USB para inventario', categoryName: 'Hardware', type: 'PRODUCT', unit: 'UNIT', taxIncluded: false, isActive: true, variantCount: 2, createdAt: '2026-08-15T09:00:00Z' },
  { id: '4', sku: 'SVC-CAP-001', name: 'Capacitación Avanzada', description: 'Curso de 40 horas para administradores', categoryName: 'Servicios', type: 'SERVICE', unit: 'HOUR', taxIncluded: true, isActive: true, variantCount: 0, createdAt: '2026-08-14T16:00:00Z' },
  { id: '5', sku: 'CRM-BAS-001', name: 'Licencia CRM Básico', description: 'Licencia mensual para CRM básico', categoryName: 'Software', type: 'DIGITAL', unit: 'MONTH', taxIncluded: true, isActive: false, variantCount: 2, createdAt: '2026-08-13T11:00:00Z' },
];

const typeLabels: Record<string, string> = {
  PRODUCT: 'Producto',
  SERVICE: 'Servicio',
  DIGITAL: 'Digital',
};

export function ProductList() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const products = mockProducts.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (tab === 1 && p.type !== 'PRODUCT') return false;
    if (tab === 2 && p.type !== 'SERVICE') return false;
    if (tab === 3 && p.type !== 'DIGITAL') return false;
    return true;
  });

  const productCount = mockProducts.filter((p) => p.type === 'PRODUCT').length;
  const serviceCount = mockProducts.filter((p) => p.type === 'SERVICE').length;
  const digitalCount = mockProducts.filter((p) => p.type === 'DIGITAL').length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Productos y Servicios</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona tu catálogo de productos y servicios.</Box>
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
          Nuevo producto
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
          <Tab label={`Todos (${mockProducts.length})`} />
          <Tab label={`Productos (${productCount})`} />
          <Tab label={`Servicios (${serviceCount})`} />
          <Tab label={`Digitales (${digitalCount})`} />
        </Tabs>
        <TextField
          size="small"
          placeholder="Buscar productos..."
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
        <Box sx={{ display: 'grid', gridTemplateColumns: '100px 1fr 120px 90px 80px 80px 60px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Box>SKU</Box>
          <Box>Nombre</Box>
          <Box>Categoría</Box>
          <Box>Tipo</Box>
          <Box>Unidad</Box>
          <Box>IVA incl.</Box>
          <Box>Var.</Box>
        </Box>
        {products.map((product) => (
          <Box
            key={product.id}
            sx={{
              display: 'grid',
              gridTemplateColumns: '100px 1fr 120px 90px 80px 80px 60px',
              gap: 1,
              px: 2,
              py: 1.25,
              borderBottom: `1px solid ${colors.border.default}`,
              cursor: 'pointer',
              transition: transitions.fast,
              '&:hover': { backgroundColor: colors.neutral[50] },
              alignItems: 'center',
              '&:last-child': { borderBottom: 'none' },
              opacity: product.isActive ? 1 : 0.5,
            }}
          >
            <Box sx={{ fontSize: 11, fontFamily: 'monospace', color: colors.text.secondary }}>{product.sku || '-'}</Box>
            <Box>
              <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500 }}>{product.name}</Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{product.description}</Box>
            </Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{product.categoryName || '-'}</Box>
            <Box>
              <Box sx={{ fontSize: 11, color: colors.text.secondary, px: 1, py: 0.25, borderRadius: radius.xs, backgroundColor: colors.neutral[100], display: 'inline-block' }}>
                {typeLabels[product.type] || product.type}
              </Box>
            </Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{product.unit}</Box>
            <Box sx={{ fontSize: 12, color: product.taxIncluded ? colors.status.RESOLVED : colors.text.muted }}>
              {product.taxIncluded ? 'Si' : 'No'}
            </Box>
            <Box sx={{ fontSize: 12, color: colors.text.secondary, textAlign: 'center' }}>{product.variantCount}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
