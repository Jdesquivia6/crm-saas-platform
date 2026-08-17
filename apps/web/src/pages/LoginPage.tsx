import { useState } from 'react';
import { Box, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { colors } from '../design-system/tokens/colors';
import { radius } from '../design-system/tokens/radius';
import { AppIcon } from '../design-system/components/AppIcon';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <Box
        sx={{
          flex: 1,
          backgroundColor: colors.primary[900],
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: radius.sm,
                background: 'linear-gradient(135deg, #7367F0 0%, #5B4FE9 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AppIcon name="zap" size={24} color="#FFFFFF" />
            </Box>
            <Box sx={{ fontSize: 22, fontWeight: 600, color: '#FFFFFF' }}>CRM</Box>
          </Box>
          <Box sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, mb: 2 }}>
            Convierte conversaciones en clientes y ventas.
          </Box>
          <Box sx={{ fontSize: 15, color: colors.primary[300], lineHeight: 1.6 }}>
            Centraliza WhatsApp, redes sociales, clientes, ventas y automatizaciones en un CRM impulsado por inteligencia.
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          backgroundColor: colors.surface.default,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 380 }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', gap: 1, mb: 4 }}>
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
            <Box sx={{ fontSize: 18, fontWeight: 600, color: colors.text.primary }}>CRM</Box>
          </Box>

          <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 1, textAlign: 'center' }}>Inicia sesión</Box>
          <Box sx={{ fontSize: 13, color: colors.text.secondary, mb: 3, textAlign: 'center' }}>Ingresa tus credenciales para acceder.</Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AppIcon name="mail" size={16} color={colors.text.muted} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: radius.sm, fontSize: 13 },
                '& .MuiInputLabel-root': { fontSize: 13 },
              }}
            />
            <TextField
              fullWidth
              size="small"
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AppIcon name="lock" size={16} color={colors.text.muted} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                      <AppIcon name={showPassword ? 'eyeOff' : 'eye'} size={16} color={colors.text.muted} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: radius.sm, fontSize: 13 },
                '& .MuiInputLabel-root': { fontSize: 13 },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                py: 1.2,
                borderRadius: radius.sm,
                backgroundColor: colors.primary[600],
                fontSize: 13,
                fontWeight: 500,
                textTransform: 'none',
                '&:hover': { backgroundColor: colors.primary[700] },
              }}
            >
              Entrar
            </Button>
          </Box>

          <Box sx={{ mt: 2.5, textAlign: 'center' }}>
            <Box
              component="a"
              href="#"
              sx={{ fontSize: 12, color: colors.primary[600], textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              ¿Olvidaste tu contraseña?
            </Box>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Box sx={{ fontSize: 12, color: colors.text.secondary }}>
              ¿No tienes cuenta?{' '}
              <Box component="a" href="/register" sx={{ fontSize: 12, color: colors.primary[600], textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Crear cuenta
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
