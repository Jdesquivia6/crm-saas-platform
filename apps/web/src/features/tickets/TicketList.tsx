import { useState } from 'react';
import { Box, IconButton, Tabs, Tab, Button } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { transitions } from '../../design-system/tokens/transitions';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, PriorityBadge, ChannelBadge, SLAIndicator } from '../../shared';
import { TicketDrawer } from './TicketDrawer';

interface Ticket {
  id: string;
  number: number;
  subject: string;
  description?: string;
  status: string;
  priority: string;
  channel: string;
  contactName: string;
  contactEmail?: string;
  assigneeName?: string;
  assigneeInitials?: string;
  slaDeadline?: string;
  createdAt: string;
  updatedAt: string;
  messages?: { id: string; content: string; sender: string; createdAt: string }[];
}

const mockTickets: Ticket[] = [
  {
    id: '1', number: 1847, subject: 'No puedo acceder al dashboard', status: 'OPEN', priority: 'HIGH',
    channel: 'WHATSAPP', contactName: 'Juan Pérez', contactEmail: 'juan@email.com',
    assigneeName: 'Carlos Martínez', assigneeInitials: 'CM',
    slaDeadline: '2026-08-17T11:00:00Z', createdAt: '2026-08-17T10:35:00Z', updatedAt: '2026-08-17T10:35:00Z',
    messages: [
      { id: '1', content: 'No puedo acceder al dashboard desde esta mañana', sender: 'Juan Pérez', createdAt: '2026-08-17T10:35:00Z' },
    ],
  },
  {
    id: '2', number: 1846, subject: 'Consulta sobre facturación', status: 'IN_PROGRESS', priority: 'NORMAL',
    channel: 'EMAIL', contactName: 'María López', contactEmail: 'maria@email.com',
    assigneeName: 'Ana García', assigneeInitials: 'AG',
    slaDeadline: '2026-08-17T12:00:00Z', createdAt: '2026-08-17T09:20:00Z', updatedAt: '2026-08-17T09:20:00Z',
    messages: [
      { id: '1', content: 'Necesito información sobre mi última factura', sender: 'María López', createdAt: '2026-08-17T09:20:00Z' },
    ],
  },
  {
    id: '3', number: 1845, subject: 'Solicitud de soporte técnico', status: 'WAITING', priority: 'NORMAL',
    channel: 'WHATSAPP', contactName: 'Pedro Rodríguez', contactEmail: 'pedro@email.com',
    assigneeName: 'Luis Hernández', assigneeInitials: 'LH',
    createdAt: '2026-08-17T08:10:00Z', updatedAt: '2026-08-17T08:10:00Z',
    messages: [
      { id: '1', content: 'El sistema no está respondiendo', sender: 'Pedro Rodríguez', createdAt: '2026-08-17T08:10:00Z' },
    ],
  },
  {
    id: '4', number: 1844, subject: 'Problema con la instalación', status: 'OPEN', priority: 'URGENT',
    channel: 'PHONE', contactName: 'Laura Sánchez', contactEmail: 'laura@email.com',
    assigneeName: 'Carlos Martínez', assigneeInitials: 'CM',
    slaDeadline: '2026-08-17T10:00:00Z', createdAt: '2026-08-17T07:45:00Z', updatedAt: '2026-08-17T07:45:00Z',
    messages: [
      { id: '1', content: 'La instalación falla constantemente', sender: 'Laura Sánchez', createdAt: '2026-08-17T07:45:00Z' },
    ],
  },
  {
    id: '5', number: 1843, subject: 'Consulta general', status: 'RESOLVED', priority: 'LOW',
    channel: 'WEB', contactName: 'Roberto Díaz', contactEmail: 'roberto@email.com',
    assigneeName: 'Ana García', assigneeInitials: 'AG',
    createdAt: '2026-08-16T16:30:00Z', updatedAt: '2026-08-16T16:30:00Z',
    messages: [
      { id: '1', content: '¿Cuáles son las horas de atención?', sender: 'Roberto Díaz', createdAt: '2026-08-16T16:30:00Z' },
    ],
  },
  {
    id: '6', number: 1842, subject: 'Solicitud de información', status: 'IN_PROGRESS', priority: 'NORMAL',
    channel: 'INSTAGRAM', contactName: 'Carmen Ortiz', contactEmail: 'carmen@email.com',
    assigneeName: 'Luis Hernández', assigneeInitials: 'LH',
    createdAt: '2026-08-16T14:15:00Z', updatedAt: '2026-08-16T14:15:00Z',
    messages: [
      { id: '1', content: 'Me gustaría información sobre sus servicios', sender: 'Carmen Ortiz', createdAt: '2026-08-16T14:15:00Z' },
    ],
  },
];

export function TicketList() {
  const [search] = useState('');
  const [tab, setTab] = useState(0);
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const tickets = mockTickets.filter((t) => {
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase()) && !t.contactName.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (tab === 1 && t.status !== 'OPEN' && t.status !== 'NEW') return false;
    if (tab === 2 && t.status !== 'WAITING') return false;
    if (tab === 3 && t.status !== 'RESOLVED' && t.status !== 'CLOSED') return false;
    return true;
  });

  const openCount = mockTickets.filter((t) => t.status === 'OPEN' || t.status === 'NEW').length;
  const waitingCount = mockTickets.filter((t) => t.status === 'WAITING').length;
  const resolvedCount = mockTickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length;
  const inProgressCount = mockTickets.filter((t) => t.status === 'IN_PROGRESS').length;
  const overdueCount = mockTickets.filter((t) => t.slaDeadline && new Date(t.slaDeadline) < new Date()).length;

  const kanbanColumns = [
    { status: 'OPEN', label: 'Nuevo', tickets: tickets.filter((t) => t.status === 'OPEN') },
    { status: 'IN_PROGRESS', label: 'En proceso', tickets: tickets.filter((t) => t.status === 'IN_PROGRESS') },
    { status: 'WAITING', label: 'Esperando', tickets: tickets.filter((t) => t.status === 'WAITING') },
    { status: 'RESOLVED', label: 'Resuelto', tickets: tickets.filter((t) => t.status === 'RESOLVED') },
    { status: 'CLOSED', label: 'Cerrado', tickets: tickets.filter((t) => t.status === 'CLOSED') },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>Tickets</Box>
            <Box sx={{ fontSize: 13, color: colors.text.secondary }}>Gestiona y resuelve las solicitudes de tus clientes.</Box>
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
            Nuevo ticket
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, mb: 3, py: 2, borderBottom: `1px solid ${colors.border.default}` }}>
          {[
            { label: 'Abiertos', value: openCount },
            { label: 'En proceso', value: inProgressCount },
            { label: 'SLA vencidos', value: overdueCount },
            { label: 'Resueltos hoy', value: resolvedCount },
          ].map((kpi) => (
            <Box key={kpi.label}>
              <Box sx={{ fontSize: 22, fontWeight: 600, color: colors.text.primary, lineHeight: 1 }}>{kpi.value}</Box>
              <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.5 }}>{kpi.label}</Box>
            </Box>
          ))}
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
            <Tab label={`Todos (${mockTickets.length})`} />
            <Tab label={`Abiertos (${openCount})`} />
            <Tab label={`Pendientes (${waitingCount})`} />
            <Tab label={`Resueltos (${resolvedCount})`} />
          </Tabs>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setView('list')}
              sx={{
                color: view === 'list' ? colors.primary[600] : colors.text.muted,
                backgroundColor: view === 'list' ? colors.brand.soft : 'transparent',
                '&:hover': { backgroundColor: view === 'list' ? colors.brand.lavender : colors.neutral[100] },
              }}
            >
              <AppIcon name="dashboard" size={16} color="currentColor" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setView('kanban')}
              sx={{
                color: view === 'kanban' ? colors.primary[600] : colors.text.muted,
                backgroundColor: view === 'kanban' ? colors.brand.soft : 'transparent',
                '&:hover': { backgroundColor: view === 'kanban' ? colors.brand.lavender : colors.neutral[100] },
              }}
            >
              <AppIcon name="pipeline" size={16} color="currentColor" />
            </IconButton>
          </Box>
        </Box>

        {view === 'list' ? (
          <Box sx={{ borderRadius: radius.md, border: `1px solid ${colors.border.default}`, backgroundColor: colors.surface.default, overflow: 'hidden' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 80px 110px 120px 100px', gap: 1, px: 2, py: 1, backgroundColor: colors.neutral[50], borderBottom: `1px solid ${colors.border.default}`, fontSize: 11, fontWeight: 600, color: colors.text.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Box>#</Box>
              <Box>Asunto</Box>
              <Box>Estado</Box>
              <Box>Prioridad</Box>
              <Box>Canal</Box>
              <Box>Responsable</Box>
              <Box>SLA</Box>
            </Box>
            {tickets.map((ticket) => (
              <Box
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 90px 80px 110px 120px 100px',
                  gap: 1,
                  px: 2,
                  py: 1.25,
                  borderBottom: `1px solid ${colors.border.default}`,
                  cursor: 'pointer',
                  transition: transitions.fast,
                  '&:hover': { backgroundColor: colors.neutral[50] },
                  alignItems: 'center',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.primary[600] }}>#{ticket.number}</Box>
                <Box>
                  <Box sx={{ fontSize: 13, color: colors.text.primary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</Box>
                  <Box sx={{ fontSize: 11, color: colors.text.secondary, mt: 0.25 }}>{ticket.contactName}</Box>
                </Box>
                <Box><StatusBadge status={ticket.status} /></Box>
                <Box><PriorityBadge priority={ticket.priority} /></Box>
                <Box><ChannelBadge channel={ticket.channel} /></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 22, height: 22, borderRadius: radius.xs, backgroundColor: colors.brand.lavender, color: colors.primary[700], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600, flexShrink: 0 }}>
                    {ticket.assigneeInitials || '??'}
                  </Box>
                  <Box sx={{ fontSize: 12, color: colors.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.assigneeName}</Box>
                </Box>
                <SLAIndicator deadline={ticket.slaDeadline} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
            {kanbanColumns.map((col) => (
              <Box key={col.status} sx={{ minWidth: 260, flex: 1 }}>
                <Box sx={{ fontSize: 12, fontWeight: 600, color: colors.text.secondary, mb: 1, px: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {col.label}
                  <Box component="span" sx={{ fontWeight: 400, color: colors.text.muted }}>({col.tickets.length})</Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {col.tickets.map((ticket) => (
                    <Box
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      sx={{
                        p: 1.5,
                        borderRadius: radius.sm,
                        border: `1px solid ${colors.border.default}`,
                        backgroundColor: colors.surface.default,
                        cursor: 'pointer',
                        transition: transitions.fast,
                        '&:hover': { borderColor: colors.primary[300], boxShadow: '0 1px 3px rgba(22,17,46,0.06)' },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.75 }}>
                        <Box sx={{ fontSize: 11, color: colors.primary[600], fontWeight: 500 }}>#{ticket.number}</Box>
                        <PriorityBadge priority={ticket.priority} />
                      </Box>
                      <Box sx={{ fontSize: 13, fontWeight: 500, color: colors.text.primary, mb: 0.75, lineHeight: 1.3 }}>{ticket.subject}</Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ fontSize: 11, color: colors.text.secondary }}>{ticket.contactName}</Box>
                        <ChannelBadge channel={ticket.channel} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {selectedTicket && (
        <TicketDrawer ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </Box>
  );
}
