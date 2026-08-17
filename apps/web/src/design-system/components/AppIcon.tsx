import React from 'react';
import {
  LayoutDashboard, Users, Ticket, Inbox, GitBranch, Settings, Home,
  Search, Bell, Plus, Filter, X, Menu, User, UsersRound, MessageSquare,
  Phone, Mail, Globe, Clock, AlertTriangle, Check, ChevronRight, ChevronDown,
  ArrowRight, ExternalLink, Star, DollarSign, TrendingUp, BarChart3,
  Zap, Shield, HelpCircle, Eye, EyeOff, Lock, Send, Paperclip, Calendar,
  Tag, MessageCircle, MoreHorizontal, Building2, Activity, FileText,
  Image, Video, Mic, MapPin, Link2, Copy, Download, Upload, RefreshCw,
  Trash2, Edit, MoreVertical, ChevronLeft, ChevronsRight, ArrowUpRight,
  Minus, CircleDot,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  dashboard: LayoutDashboard,
  contacts: Users,
  tickets: Ticket,
  inbox: Inbox,
  inboxIcon: Inbox,
  pipeline: GitBranch,
  settings: Settings,
  tenants: Building2,
  home: Home,
  search: Search,
  bell: Bell,
  plus: Plus,
  filter: Filter,
  close: X,
  menu: Menu,
  user: User,
  users: UsersRound,
  usersRound: UsersRound,
  message: MessageSquare,
  messageSquare: MessageSquare,
  phone: Phone,
  mail: Mail,
  globe: Globe,
  clock: Clock,
  alert: AlertTriangle,
  alertTriangle: AlertTriangle,
  check: Check,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronDown: ChevronDown,
  chevronsRight: ChevronsRight,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  externalLink: ExternalLink,
  whatsapp: MessageCircle,
  instagram: Image,
  facebook: MessageCircle,
  star: Star,
  dollar: DollarSign,
  dollarSign: DollarSign,
  trendingUp: TrendingUp,
  barChart: BarChart3,
  barChart3: BarChart3,
  zap: Zap,
  shield: Shield,
  helpCircle: HelpCircle,
  eye: Eye,
  eyeOff: EyeOff,
  lock: Lock,
  send: Send,
  paperclip: Paperclip,
  calendar: Calendar,
  tag: Tag,
  building: Building2,
  building2: Building2,
  activity: Activity,
  fileText: FileText,
  image: Image,
  video: Video,
  mic: Mic,
  mapPin: MapPin,
  link: Link2,
  link2: Link2,
  copy: Copy,
  download: Download,
  upload: Upload,
  refresh: RefreshCw,
  refreshCw: RefreshCw,
  trash: Trash2,
  trash2: Trash2,
  edit: Edit,
  moreHorizontal: MoreHorizontal,
  moreVertical: MoreVertical,
  minus: Minus,
  circleDot: CircleDot,
};

interface AppIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export function AppIcon({ name, size = 20, color = 'currentColor', className }: AppIconProps) {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    return null;
  }

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
      <IconComponent size={size} color={color} strokeWidth={1.75} />
    </span>
  );
}

export type AppIconName = keyof typeof iconMap;
