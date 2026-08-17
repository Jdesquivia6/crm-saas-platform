import { Box } from '@mui/material';
import { colors } from '../design-system/tokens/colors';
import { radius } from '../design-system/tokens/radius';
import { AppIcon } from '../design-system/components/AppIcon';
import { PublicLayout } from '../design-system/layouts/PublicLayout';

export default function LandingPage() {
  return (
    <PublicLayout>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        <Box sx={{ py: 12, textAlign: 'center' }}>
          <Box sx={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, color: colors.text.primary, lineHeight: 1.15, mb: 3, maxWidth: 700, mx: 'auto', letterSpacing: '-0.02em' }}>
            Convierte conversaciones en clientes y ventas.
          </Box>
          <Box sx={{ fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', color: colors.text.secondary, mb: 4, maxWidth: 560, mx: 'auto', lineHeight: 1.6 }}>
            Centraliza WhatsApp, redes sociales, clientes, ventas y automatizaciones en un CRM impulsado por inteligencia.
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Box
              component="a"
              href="/register"
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: radius.sm,
                backgroundColor: colors.primary[600],
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { backgroundColor: colors.primary[700] },
              }}
            >
              Comenzar gratis
              <AppIcon name="arrowRight" size={16} color="currentColor" />
            </Box>
            <Box
              component="a"
              href="/app/dashboard"
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: radius.sm,
                border: `1px solid ${colors.border.default}`,
                color: colors.text.primary,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                '&:hover': { backgroundColor: colors.neutral[50] },
              }}
            >
              Ver demostración
            </Box>
          </Box>
        </Box>

        <Box sx={{ py: 10, borderTop: `1px solid ${colors.border.default}` }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 600, color: colors.text.primary, mb: 1 }}>Todo tu proceso comercial en un solo lugar.</Box>
            <Box sx={{ fontSize: 15, color: colors.text.secondary }}>Desde la primera conversación hasta la venta cerrada.</Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {['Conversaciones', 'Cliente', 'Oportunidad', 'Venta', 'Fidelización'].map((step, i) => (
              <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ p: 2, borderRadius: radius.md, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, textAlign: 'center', minWidth: 120 }}>
                  <Box sx={{ fontSize: 13, fontWeight: 500, color: colors.text.primary }}>{step}</Box>
                </Box>
                {i < 4 && <AppIcon name="chevronRight" size={16} color={colors.text.muted} />}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 10, borderTop: `1px solid ${colors.border.default}` }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 600, color: colors.text.primary, mb: 1 }}>Todos tus canales. Una sola conversación.</Box>
            <Box sx={{ fontSize: 15, color: colors.text.secondary }}>WhatsApp, Instagram, Facebook, Email y más.</Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            {[
              { name: 'WhatsApp', color: colors.channels.whatsapp },
              { name: 'Instagram', color: colors.channels.instagram },
              { name: 'Facebook', color: colors.channels.facebook },
              { name: 'Email', color: colors.channels.email },
            ].map((ch) => (
              <Box key={ch.name} sx={{ p: 2.5, borderRadius: radius.md, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, minWidth: 100 }}>
                <AppIcon name={ch.name.toLowerCase() as any} size={24} color={ch.color} />
                <Box sx={{ fontSize: 11, fontWeight: 500, color: colors.text.secondary }}>{ch.name}</Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 10, borderTop: `1px solid ${colors.border.default}` }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 600, color: colors.text.primary, mb: 1 }}>IA que entiende tu negocio.</Box>
            <Box sx={{ fontSize: 15, color: colors.text.secondary }}>Recomendaciones automáticas basadas en tus datos.</Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            {[
              '184 clientes llevan más de 60 días sin comprar.',
              'El producto X aumentó sus ventas un 28%.',
              'Recomendamos contactar estas 32 oportunidades.',
            ].map((msg, i) => (
              <Box key={i} sx={{ p: 2, borderRadius: radius.md, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, maxWidth: 300, fontSize: 13, color: colors.text.primary, lineHeight: 1.5 }}>
                {msg}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 10, borderTop: `1px solid ${colors.border.default}` }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 600, color: colors.text.primary, mb: 1 }}>Pipeline visual.</Box>
            <Box sx={{ fontSize: 15, color: colors.text.secondary }}>Gestiona tus oportunidades como un profesional.</Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            {['Lead', 'Contactado', 'Cotización', 'Negociación', 'Ganado'].map((stage, i) => (
              <Box key={stage} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ px: 2, py: 1, borderRadius: radius.sm, backgroundColor: i === 4 ? colors.success.main : colors.brand.soft, color: i === 4 ? '#FFFFFF' : colors.primary[700], fontSize: 12, fontWeight: 500 }}>
                  {stage}
                </Box>
                {i < 4 && <AppIcon name="chevronRight" size={14} color={colors.text.muted} />}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 10, borderTop: `1px solid ${colors.border.default}` }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 600, color: colors.text.primary, mb: 1 }}>Automatizaciones inteligentes.</Box>
            <Box sx={{ fontSize: 15, color: colors.text.secondary }}>Ahorra tiempo con flujos automáticos.</Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
            {['Nuevo lead', 'Asignar vendedor', 'Enviar WhatsApp', 'Esperar 24h', 'Crear tarea'].map((step, i) => (
              <Box key={step} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ px: 2, py: 1, borderRadius: radius.sm, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, fontSize: 12, fontWeight: 500, color: colors.text.primary }}>
                  {step}
                </Box>
                {i < 4 && <AppIcon name="chevronRight" size={14} color={colors.text.muted} />}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 10, borderTop: `1px solid ${colors.border.default}` }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 600, color: colors.text.primary, mb: 1 }}>Integraciones.</Box>
            <Box sx={{ fontSize: 15, color: colors.text.secondary }}>Conecta las herramientas que ya usas.</Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            {[
              { name: 'WhatsApp', status: 'Disponible', color: colors.channels.whatsapp },
              { name: 'Instagram', status: 'Disponible', color: colors.channels.instagram },
              { name: 'Facebook', status: 'Beta', color: colors.channels.facebook },
              { name: 'Email', status: 'Disponible', color: colors.channels.email },
            ].map((int) => (
              <Box key={int.name} sx={{ p: 2.5, borderRadius: radius.md, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, textAlign: 'center', minWidth: 120 }}>
                <Box sx={{ fontSize: 14, fontWeight: 500, color: colors.text.primary, mb: 0.5 }}>{int.name}</Box>
                <Box sx={{ fontSize: 11, color: int.status === 'Disponible' ? colors.success.main : colors.warning.main }}>{int.status}</Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 10, borderTop: `1px solid ${colors.border.default}` }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 600, color: colors.text.primary, mb: 1 }}>Planes para cada negocio.</Box>
            <Box sx={{ fontSize: 15, color: colors.text.secondary }}>Escalable según tus necesidades.</Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            {[
              { name: 'Starter', price: '$29', features: ['1 usuario', '1.000 contactos', '1 canal'] },
              { name: 'Professional', price: '$79', features: ['5 usuarios', '10.000 contactos', '3 canales', 'IA'] },
              { name: 'Business', price: '$199', features: ['Ilimitado', 'Ilimitado', 'Todos los canales', 'IA + API'] },
            ].map((plan) => (
              <Box key={plan.name} sx={{ p: 3, borderRadius: radius.lg, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, minWidth: 240, textAlign: 'center' }}>
                <Box sx={{ fontSize: 14, fontWeight: 600, color: colors.text.primary, mb: 1 }}>{plan.name}</Box>
                <Box sx={{ fontSize: 28, fontWeight: 700, color: colors.text.primary, mb: 2 }}>{plan.price}<Box component="span" sx={{ fontSize: 13, fontWeight: 400, color: colors.text.secondary }}>/mes</Box></Box>
                {plan.features.map((f) => (
                  <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, justifyContent: 'center' }}>
                    <AppIcon name="check" size={14} color={colors.success.main} />
                    <Box sx={{ fontSize: 12, color: colors.text.secondary }}>{f}</Box>
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ py: 10, textAlign: 'center', borderTop: `1px solid ${colors.border.default}` }}>
          <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.75rem)', fontWeight: 600, color: colors.text.primary, mb: 2 }}>Tu operación comercial. Una sola plataforma.</Box>
          <Box
            component="a"
            href="/register"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 3,
              py: 1.5,
              borderRadius: radius.sm,
              backgroundColor: colors.primary[600],
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': { backgroundColor: colors.primary[700] },
            }}
          >
            Comenzar gratis
            <AppIcon name="arrowRight" size={16} color="currentColor" />
          </Box>
        </Box>
      </Box>
    </PublicLayout>
  );
}
