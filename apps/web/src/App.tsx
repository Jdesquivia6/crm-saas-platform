import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './design-system/layouts/AppShell';
import DashboardPage from './pages/DashboardPage';
import TenantsPage from './pages/TenantsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { TicketList } from './features/tickets';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/app/dashboard" element={<AppShell><DashboardPage /></AppShell>} />
      <Route path="/app/tenants" element={<AppShell title="Organizaciones"><TenantsPage /></AppShell>} />
      <Route path="/app/tickets" element={<AppShell title="Tickets"><TicketList /></AppShell>} />
      <Route path="/app/inbox" element={<AppShell title="Inbox"><div>Inbox - Proximamente</div></AppShell>} />
      <Route path="/app/contacts" element={<AppShell title="Contactos"><div>Contactos - Proximamente</div></AppShell>} />
      <Route path="/app/pipeline" element={<AppShell title="Pipeline"><div>Pipeline - Proximamente</div></AppShell>} />
      <Route path="/app/settings" element={<AppShell title="Configuracion"><div>Configuracion - Proximamente</div></AppShell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
