import React from 'react';
import { Box, Chip } from '@mui/material';
import { colors } from '../design-system/tokens/colors';
import { radius } from '../design-system/tokens/radius';
import { AppIcon, AppIconName } from '../design-system/components/AppIcon';

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  OPEN: { color: colors.status.OPEN, bg: colors.info.soft, label: 'Nuevo' },
  NEW: { color: colors.status.OPEN, bg: colors.info.soft, label: 'Nuevo' },
  IN_PROGRESS: { color: colors.status.IN_PROGRESS, bg: colors.warning.soft, label: 'En proceso' },
  WAITING: { color: colors.status.WAITING, bg: colors.brand.lavender, label: 'Esperando' },
  RESOLVED: { color: colors.status.RESOLVED, bg: colors.success.soft, label: 'Resuelto' },
  CLOSED: { color: colors.status.CLOSED, bg: '#F3F1F8', label: 'Cerrado' },
  ASSIGNED: { color: colors.status.IN_PROGRESS, bg: colors.warning.soft, label: 'Asignado' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { color: colors.text.muted, bg: '#F3F1F8', label: status };

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: radius.xs,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}

const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  LOW: { color: colors.priority.LOW, bg: '#F3F1F8', label: 'Baja' },
  NORMAL: { color: colors.priority.NORMAL, bg: colors.info.soft, label: 'Normal' },
  HIGH: { color: colors.priority.HIGH, bg: colors.warning.soft, label: 'Alta' },
  URGENT: { color: colors.priority.URGENT, bg: colors.danger.soft, label: 'Urgente' },
};

export function PriorityBadge({ priority }: { priority: string }) {
  const config = priorityConfig[priority] || priorityConfig.NORMAL;

  return (
    <Chip
      label={config.label}
      size="small"
      sx={{
        height: 22,
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: config.bg,
        color: config.color,
        borderRadius: radius.xs,
        '& .MuiChip-label': { px: 1 },
      }}
    />
  );
}

const channelConfig: Record<string, { icon: AppIconName; color: string; label: string }> = {
  WHATSAPP: { icon: 'whatsapp', color: colors.channels.whatsapp, label: 'WhatsApp' },
  INSTAGRAM: { icon: 'instagram', color: colors.channels.instagram, label: 'Instagram' },
  FACEBOOK: { icon: 'facebook', color: colors.channels.facebook, label: 'Facebook' },
  EMAIL: { icon: 'mail', color: colors.channels.email, label: 'Email' },
  PHONE: { icon: 'phone', color: colors.channels.phone, label: 'Teléfono' },
  WEB: { icon: 'globe', color: colors.channels.web, label: 'Web' },
};

export function ChannelBadge({ channel }: { channel: string }) {
  const config = channelConfig[channel] || { icon: 'globe' as AppIconName, color: colors.text.muted, label: channel };
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }} title={config.label}>
      <AppIcon name={config.icon} size={14} color={config.color} />
      <Box component="span" sx={{ fontSize: 12, color: colors.text.secondary }}>{config.label}</Box>
    </Box>
  );
}

export function MetricCard({ label, value, icon, color }: { label: string; value: string | number; icon?: React.ReactNode; color?: string }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: radius.md,
        backgroundColor: colors.surface.default,
        border: `1px solid ${colors.border.default}`,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
      }}
    >
      {icon && (
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: radius.sm,
            backgroundColor: `${color || colors.primary[600]}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color || colors.primary[600],
          }}
        >
          {icon}
        </Box>
      )}
      <Box>
        <Box sx={{ fontSize: 20, fontWeight: 600, color: colors.text.primary, lineHeight: 1 }}>{value}</Box>
        <Box sx={{ fontSize: 12, color: colors.text.secondary, mt: 0.25 }}>{label}</Box>
      </Box>
    </Box>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: AppIconName; title: string; description: string; action?: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        px: 4,
        textAlign: 'center',
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, color: colors.text.muted }}>
          <AppIcon name={icon} size={48} color="currentColor" />
        </Box>
      )}
      <Box sx={{ fontSize: 15, fontWeight: 600, color: colors.text.primary, mb: 0.5 }}>{title}</Box>
      <Box sx={{ fontSize: 13, color: colors.text.secondary, mb: 3, maxWidth: 360, lineHeight: 1.6 }}>{description}</Box>
      {action}
    </Box>
  );
}

export function SkeletonRow() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5, px: 2 }}>
      <Box sx={{ width: 36, height: 36, borderRadius: radius.xs, backgroundColor: colors.neutral[200], animation: 'pulse 1.5s infinite' }} />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ height: 12, width: '60%', backgroundColor: colors.neutral[200], borderRadius: radius.xs, mb: 0.5 }} />
        <Box sx={{ height: 10, width: '40%', backgroundColor: colors.neutral[100], borderRadius: radius.xs }} />
      </Box>
      <Box sx={{ height: 22, width: 70, borderRadius: radius.xs, backgroundColor: colors.neutral[200] }} />
    </Box>
  );
}

export function SLAIndicator({ deadline }: { deadline?: string }) {
  if (!deadline) return <Box sx={{ fontSize: 11, color: colors.text.muted }}>-</Box>;

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();
  const minutes = Math.floor(diff / 60000);
  const isOverdue = minutes < 0;

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        fontSize: 11,
        fontWeight: 500,
        color: isOverdue ? colors.danger.main : colors.text.secondary,
        px: 1,
        py: 0.25,
        borderRadius: radius.xs,
        backgroundColor: isOverdue ? colors.danger.soft : colors.neutral[50],
      }}
    >
      <AppIcon name="clock" size={12} color="currentColor" />
      {isOverdue ? `Vencido hace ${Math.abs(minutes)}m` : `${minutes}m restantes`}
    </Box>
  );
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}
