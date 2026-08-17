import { Box, IconButton, Badge, TextField, InputAdornment } from '@mui/material';
import { colors } from '../tokens/colors';
import { radius } from '../tokens/radius';
import { AppIcon } from './AppIcon';

interface TopbarProps {
  title?: string;
  rightContent?: React.ReactNode;
}

export function Topbar({ title, rightContent }: TopbarProps) {
  return (
    <Box
      component="header"
      sx={{
        height: 56,
        px: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.surface.default,
        borderBottom: `1px solid ${colors.border.default}`,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {title && (
          <Box sx={{ fontSize: 15, fontWeight: 600, color: colors.text.primary }}>{title}</Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {rightContent}
        <TextField
          size="small"
          placeholder="Buscar..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AppIcon name="search" size={15} color={colors.text.muted} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 240,
            '& .MuiOutlinedInput-root': {
              borderRadius: radius.sm,
              backgroundColor: colors.neutral[50],
              fontSize: 13,
              height: 34,
            },
          }}
        />
        <IconButton size="small" sx={{ color: colors.text.muted, '&:hover': { backgroundColor: colors.neutral[100] } }}>
          <Badge
            badgeContent={3}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: colors.danger.main,
                color: '#FFFFFF',
                fontSize: 9,
                height: 16,
                minWidth: 16,
              },
            }}
          >
            <AppIcon name="bell" size={18} color="currentColor" />
          </Badge>
        </IconButton>
        <IconButton size="small" sx={{ color: colors.text.muted, '&:hover': { backgroundColor: colors.neutral[100] } }}>
          <AppIcon name="helpCircle" size={18} color="currentColor" />
        </IconButton>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: radius.pill,
            backgroundColor: colors.brand.lavender,
            color: colors.primary[700],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            ml: 0.5,
            '&:hover': { backgroundColor: colors.primary[200] },
          }}
        >
          JP
        </Box>
      </Box>
    </Box>
  );
}
