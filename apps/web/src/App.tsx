import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './design-system/layouts/AppShell';
import DashboardPage from './pages/DashboardPage';
import TenantsPage from './pages/TenantsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { TicketList } from './features/tickets';
import { LeadList } from './features/leads';
import { PipelineBoard } from './features/pipeline';
import { OpportunityList } from './features/opportunities';
import { ProductList } from './features/products';
import { QuoteList } from './features/quotes';
import { OrderList } from './features/orders';
import { SaleList } from './features/sales';
import { InvoiceList } from './features/invoices';
import { PaymentList } from './features/payments';
import { BillingInvoiceList } from './features/billing';
import { SegmentList, CampaignList } from './features/marketing';
import { Dashboard } from './features/dashboard';

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
      <Route path="/app/leads" element={<AppShell title="Leads"><LeadList /></AppShell>} />
      <Route path="/app/pipeline" element={<AppShell title="Pipeline"><PipelineBoard /></AppShell>} />
      <Route path="/app/opportunities" element={<AppShell title="Oportunidades"><OpportunityList /></AppShell>} />
      <Route path="/app/products" element={<AppShell title="Productos"><ProductList /></AppShell>} />
      <Route path="/app/quotes" element={<AppShell title="Cotizaciones"><QuoteList /></AppShell>} />
      <Route path="/app/orders" element={<AppShell title="Pedidos"><OrderList /></AppShell>} />
      <Route path="/app/sales" element={<AppShell title="Ventas"><SaleList /></AppShell>} />
      <Route path="/app/invoices" element={<AppShell title="Facturas"><InvoiceList /></AppShell>} />
      <Route path="/app/payments" element={<AppShell title="Pagos"><PaymentList /></AppShell>} />
      <Route path="/app/billing" element={<AppShell title="Facturación SaaS"><BillingInvoiceList /></AppShell>} />
      <Route path="/app/segments" element={<AppShell title="Segmentos"><SegmentList /></AppShell>} />
      <Route path="/app/campaigns" element={<AppShell title="Campañas"><CampaignList /></AppShell>} />
      <Route path="/app/dashboard" element={<AppShell title="Dashboard"><Dashboard /></AppShell>} />
      <Route path="/app/inbox" element={<AppShell title="Inbox"><div>Inbox - Proximamente</div></AppShell>} />
      <Route path="/app/contacts" element={<AppShell title="Contactos"><div>Contactos - Proximamente</div></AppShell>} />
      <Route path="/app/settings" element={<AppShell title="Configuracion"><div>Configuracion - Proximamente</div></AppShell>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
