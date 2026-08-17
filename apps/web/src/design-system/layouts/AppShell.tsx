import { Box } from '@mui/material';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { sidebar } from '../tokens/spacing';
import { colors } from '../tokens/colors';
import { AppIconName } from '../components/AppIcon';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  navItems?: { icon: AppIconName; label: string; path: string; badge?: number }[];
}

const defaultNavItems = [
  { icon: 'dashboard' as AppIconName, label: 'Dashboard', path: '/app/dashboard' },
  { icon: 'inboxIcon' as AppIconName, label: 'Inbox', path: '/app/inbox' },
  { icon: 'contacts' as AppIconName, label: 'Contactos', path: '/app/contacts' },
  { icon: 'tickets' as AppIconName, label: 'Tickets', path: '/app/tickets', badge: 3 },
  { icon: 'pipeline' as AppIconName, label: 'Pipeline', path: '/app/pipeline' },
  { icon: 'tenants' as AppIconName, label: 'Organizaciones', path: '/app/tenants' },
];

export function AppShell({ children, title, navItems }: AppShellProps) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.background.soft }}>
      <Sidebar items={navItems || defaultNavItems} expanded={false} />
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: `${sidebar.width}px`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Topbar title={title} />
        <Box sx={{ flex: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
