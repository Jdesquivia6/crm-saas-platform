import { Box, IconButton, TextField } from '@mui/material';
import { colors } from '../../design-system/tokens/colors';
import { radius } from '../../design-system/tokens/radius';
import { AppIcon } from '../../design-system/components/AppIcon';
import { StatusBadge, PriorityBadge, ChannelBadge, formatRelativeTime } from '../../shared';

interface TicketDrawerProps {
  ticket: {
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
  };
  onClose: () => void;
}

export function TicketDrawer({ ticket, onClose }: TicketDrawerProps) {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 420,
        height: '100vh',
        backgroundColor: colors.neutral[0],
        borderLeft: `1px solid ${colors.neutral[200]}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1300,
        boxShadow: '-4px 0 12px rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{ px: 2.5, py: 2, borderBottom: `1px solid ${colors.neutral[200]}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ fontSize: 14, fontWeight: 600, color: colors.neutral[900] }}>Ticket #{ticket.number}</Box>
          <Box sx={{ fontSize: 12, color: colors.neutral[500], mt: 0.25 }}>{ticket.subject}</Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: colors.neutral[400] }}>
          <AppIcon name="close" size={18} color="currentColor" />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AppIcon name="user" size={14} color={colors.neutral[400]} />
            <Box>
              <Box sx={{ fontSize: 12, fontWeight: 500, color: colors.neutral[900] }}>{ticket.contactName}</Box>
              {ticket.contactEmail && <Box sx={{ fontSize: 11, color: colors.neutral[500] }}>{ticket.contactEmail}</Box>}
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            <Box>
              <Box sx={{ fontSize: 10, fontWeight: 600, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Estado</Box>
              <StatusBadge status={ticket.status} />
            </Box>
            <Box>
              <Box sx={{ fontSize: 10, fontWeight: 600, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Prioridad</Box>
              <PriorityBadge priority={ticket.priority} />
            </Box>
            <Box>
              <Box sx={{ fontSize: 10, fontWeight: 600, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Canal</Box>
              <ChannelBadge channel={ticket.channel} />
            </Box>
            <Box>
              <Box sx={{ fontSize: 10, fontWeight: 600, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>Responsable</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box sx={{ width: 20, height: 20, borderRadius: radius.sm, backgroundColor: colors.primary[100], color: colors.primary[700], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 600 }}>
                  {ticket.assigneeInitials || '??'}
                </Box>
                <Box sx={{ fontSize: 12, color: colors.neutral[700] }}>{ticket.assigneeName}</Box>
              </Box>
            </Box>
          </Box>

          {ticket.slaDeadline && (
            <Box sx={{ mt: 1.5, p: 1, borderRadius: radius.sm, backgroundColor: new Date(ticket.slaDeadline) < new Date() ? '#FEF2F2' : colors.neutral[50], border: `1px solid ${new Date(ticket.slaDeadline) < new Date() ? '#FECACA' : colors.neutral[200]}` }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 11, color: new Date(ticket.slaDeadline) < new Date() ? colors.danger : colors.neutral[600] }}>
                <AppIcon name="clock" size={12} color="currentColor" />
                SLA: {formatRelativeTime(ticket.slaDeadline)}
              </Box>
            </Box>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ fontSize: 10, fontWeight: 600, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>Conversación</Box>
          {ticket.messages && ticket.messages.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {ticket.messages.map((msg) => (
                <Box key={msg.id} sx={{ p: 1.5, borderRadius: radius.md, backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[200]}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ fontSize: 11, fontWeight: 500, color: colors.neutral[700] }}>{msg.sender}</Box>
                    <Box sx={{ fontSize: 10, color: colors.neutral[400] }}>{formatRelativeTime(msg.createdAt)}</Box>
                  </Box>
                  <Box sx={{ fontSize: 13, color: colors.neutral[800], lineHeight: 1.5 }}>{msg.content}</Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ fontSize: 12, color: colors.neutral[400], textAlign: 'center', py: 2 }}>Sin mensajes</Box>
          )}
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ fontSize: 10, fontWeight: 600, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>Actividad</Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: colors.primary[500], mt: 0.5, flexShrink: 0 }} />
              <Box>
                <Box sx={{ fontSize: 11, color: colors.neutral[500] }}>Hoy 10:35</Box>
                <Box sx={{ fontSize: 12, color: colors.neutral[700] }}>Mensaje recibido</Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: colors.neutral[300], mt: 0.5, flexShrink: 0 }} />
              <Box>
                <Box sx={{ fontSize: 11, color: colors.neutral[500] }}>Hoy 10:21</Box>
                <Box sx={{ fontSize: 12, color: colors.neutral[700] }}>Ticket creado</Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ fontSize: 10, fontWeight: 600, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>Comentarios internos</Box>
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="Agregar comentario..."
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: radius.md,
                fontSize: 13,
              },
            }}
          />
        </Box>

        <Box>
          <Box sx={{ fontSize: 10, fontWeight: 600, color: colors.neutral[500], textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>Adjuntos</Box>
          <Box sx={{ p: 2, borderRadius: radius.md, border: `1px dashed ${colors.neutral[300]}`, textAlign: 'center', cursor: 'pointer', '&:hover': { backgroundColor: colors.neutral[50] } }}>
            <AppIcon name="paperclip" size={16} color={colors.neutral[400]} />
            <Box sx={{ fontSize: 11, color: colors.neutral[500], mt: 0.5 }}>Arrastra archivos o haz clic para adjuntar</Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2.5, py: 2, borderTop: `1px solid ${colors.neutral[200]}`, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Responder..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: radius.md,
              fontSize: 13,
            },
          }}
        />
        <IconButton
          size="small"
          sx={{
            backgroundColor: colors.primary[600],
            color: '#FFFFFF',
            '&:hover': { backgroundColor: colors.primary[700] },
          }}
        >
          <AppIcon name="send" size={16} color="currentColor" />
        </IconButton>
      </Box>
    </Box>
  );
}
