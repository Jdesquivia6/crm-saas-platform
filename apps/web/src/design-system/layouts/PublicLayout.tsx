import React from 'react';
import { Box } from '@mui/material';
import { colors } from '../tokens/colors';
import { radius } from '../tokens/radius';
import { AppIcon } from '../components/AppIcon';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: colors.surface.default, display: 'flex', flexDirection: 'column' }}>
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backgroundColor: colors.surface.default,
          borderBottom: `1px solid ${colors.border.default}`,
        }}
      >
        <Box
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: 3,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: radius.sm,
                background: 'linear-gradient(135deg, #7367F0 0%, #5B4FE9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppIcon name="zap" size={18} color="#FFFFFF" />
            </Box>
            <Box sx={{ fontSize: 16, fontWeight: 600, color: colors.text.primary }}>CRM</Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
            {['Producto', 'Soluciones', 'Integraciones', 'Precios', 'Recursos'].map((item) => (
              <Box
                key={item}
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: colors.text.secondary,
                  cursor: 'pointer',
                  '&:hover': { color: colors.primary[600] },
                }}
              >
                {item}
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="a"
              href="/app/dashboard"
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: colors.text.secondary,
                textDecoration: 'none',
                cursor: 'pointer',
                display: { xs: 'none', md: 'block' },
                '&:hover': { color: colors.primary[600] },
              }}
            >
              Ver app
            </Box>
            <Box
              component="a"
              href="/login"
              sx={{
                fontSize: 13,
                fontWeight: 500,
                color: colors.text.primary,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { color: colors.primary[600] },
              }}
            >
              Iniciar sesión
            </Box>
            <Box
              component="a"
              href="/register"
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: radius.sm,
                backgroundColor: colors.primary[600],
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 500,
                textDecoration: 'none',
                cursor: 'pointer',
                '&:hover': { backgroundColor: colors.primary[700] },
              }}
            >
              Comenzar gratis
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: `1px solid ${colors.border.default}`,
          backgroundColor: colors.neutral[50],
          py: 6,
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(6, 1fr)' }, gap: 4, mb: 4 }}>
            {[
              { title: 'Producto', items: ['CRM', 'Omnicanal', 'Ventas', 'Marketing', 'IA', 'Automatizaciones'] },
              { title: 'Soluciones', items: ['Ventas', 'Servicio al cliente', 'Marketing'] },
              { title: 'Integraciones', items: ['WhatsApp', 'Instagram', 'Facebook', 'Email'] },
              { title: 'Recursos', items: ['Centro de ayuda', 'Documentación', 'API'] },
              { title: 'Empresa', items: ['Nosotros', 'Contacto'] },
              { title: 'Legal', items: ['Privacidad', 'Términos'] },
            ].map((col) => (
              <Box key={col.title}>
                <Box sx={{ fontSize: 12, fontWeight: 600, color: colors.text.primary, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{col.title}</Box>
                {col.items.map((item) => (
                  <Box key={item} sx={{ fontSize: 13, color: colors.text.secondary, mb: 1, cursor: 'pointer', '&:hover': { color: colors.primary[600] } }}>{item}</Box>
                ))}
              </Box>
            ))}
          </Box>
          <Box sx={{ pt: 3, borderTop: `1px solid ${colors.border.default}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ fontSize: 12, color: colors.text.muted }}>2026 CRM. Todos los derechos reservados.</Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AppIcon name="whatsapp" size={16} color={colors.text.muted} />
              <AppIcon name="instagram" size={16} color={colors.text.muted} />
              <AppIcon name="facebook" size={16} color={colors.text.muted} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
