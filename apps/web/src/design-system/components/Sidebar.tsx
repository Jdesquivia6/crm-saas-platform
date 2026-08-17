import { Box, Tooltip, Badge } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { colors } from '../tokens/colors';
import { sidebar } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { transitions } from '../tokens';
import { AppIcon, AppIconName } from './AppIcon';

interface NavItem {
  icon: AppIconName;
  label: string;
  path: string;
  badge?: number;
}

interface SidebarProps {
  items: NavItem[];
  expanded?: boolean;
}

export function Sidebar({ items, expanded = false }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const width = expanded ? sidebar.widthExpanded : sidebar.width;

  return (
    <Box
      component="nav"
      sx={{
        width,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: colors.primary[900],
        display: 'flex',
        flexDirection: 'column',
        transition: transitions.normal,
        overflow: 'hidden',
        zIndex: 1200,
        borderRight: `1px solid ${colors.primary[800]}`,
      }}
    >
      <Box
        sx={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: expanded ? 'flex-start' : 'center',
          px: expanded ? 2 : 0,
          borderBottom: `1px solid ${colors.primary[800]}`,
        }}
      >
        {expanded ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
            <Box sx={{ color: '#FFFFFF', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>CRM</Box>
          </Box>
        ) : (
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
        )}
      </Box>

      <Box sx={{ flex: 1, py: 1.5, px: expanded ? 1 : 0.75 }}>
        {items.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Tooltip key={item.path} title={expanded ? '' : item.label} placement="right" arrow>
              <Box
                onClick={() => navigate(item.path)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: expanded ? 1.5 : 0,
                  justifyContent: expanded ? 'flex-start' : 'center',
                  px: expanded ? 1.5 : 0,
                  py: 1,
                  mb: 0.25,
                  borderRadius: radius.sm,
                  cursor: 'pointer',
                  transition: transitions.fast,
                  position: 'relative',
                  backgroundColor: isActive ? 'rgba(115, 103, 240, 0.15)' : 'transparent',
                  color: isActive ? '#FFFFFF' : colors.primary[300],
                  '&:hover': {
                    backgroundColor: isActive ? 'rgba(115, 103, 240, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                  },
                }}
              >
                {isActive && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: expanded ? -8 : '50%',
                      top: '50%',
                      transform: expanded ? 'translateY(-50%)' : 'translate(-50%, -50%)',
                      width: 3,
                      height: 20,
                      borderRadius: '0 2px 2px 0',
                      backgroundColor: colors.primary[400],
                    }}
                  />
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 24,
                    height: 24,
                  }}
                >
                  <AppIcon name={item.icon} size={20} color="currentColor" />
                </Box>
                {expanded && (
                  <Box sx={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {item.label}
                  </Box>
                )}
                {!expanded && item.badge && item.badge > 0 && (
                  <Badge
                    badgeContent={item.badge}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: expanded ? 'auto' : 4,
                      left: expanded ? 0 : 'auto',
                      '& .MuiBadge-badge': {
                        backgroundColor: colors.danger.main,
                        color: '#FFFFFF',
                        fontSize: 9,
                        height: 16,
                        minWidth: 16,
                        border: `2px solid ${colors.primary[900]}`,
                      },
                    }}
                  />
                )}
              </Box>
            </Tooltip>
          );
        })}
      </Box>

      <Box
        sx={{
          py: 1.5,
          px: expanded ? 1 : 0.75,
          borderTop: `1px solid ${colors.primary[800]}`,
        }}
      >
        <Tooltip title={expanded ? '' : 'Configuración'} placement="right" arrow>
          <Box
            onClick={() => navigate('/app/settings')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: expanded ? 1.5 : 0,
              justifyContent: expanded ? 'flex-start' : 'center',
              px: expanded ? 1.5 : 0,
              py: 1,
              borderRadius: radius.sm,
              cursor: 'pointer',
              transition: transitions.fast,
              color: colors.primary[400],
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
              },
            }}
          >
            <AppIcon name="settings" size={20} color="currentColor" />
            {expanded && <Box sx={{ fontSize: 13, fontWeight: 500 }}>Configuración</Box>}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
}
