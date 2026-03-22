import { getStatusBadgeClass, getStatusLabel } from '../../utils/helpers';

// ── Generic Badge ─────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'gray', className = '' }) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}

// ── Booking Status Badge ───────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const dot = {
    pending:   '#f59e0b',
    approved:  '#22c55e',
    rejected:  '#ef4444',
    completed: '#3b82f6',
    cancelled: '#9ca3af',
  }[status] || '#9ca3af';

  return (
    <span className={`badge ${getStatusBadgeClass(status)}`}>
      <span style={{
        width: 6, height: 6,
        borderRadius: '50%',
        background: dot,
        display: 'inline-block',
        flexShrink: 0,
      }} />
      {getStatusLabel(status)}
    </span>
  );
}

// ── Role Badge ────────────────────────────────────────────────────────────────
export function RoleBadge({ role }) {
  const map = {
    farmer: { cls: 'badge-green', label: '👨‍🌾 Farmer' },
    owner:  { cls: 'badge-blue',  label: '🏭 Owner'  },
    admin:  { cls: 'badge-dark',  label: '🛡️ Admin'  },
  };
  const { cls, label } = map[role] || { cls: 'badge-gray', label: role };
  return <span className={`badge ${cls}`}>{label}</span>;
}

// ── Availability Badge ────────────────────────────────────────────────────────
export function AvailBadge({ available }) {
  return available
    ? <span className="badge badge-green">✓ Available</span>
    : <span className="badge badge-red">✗ Unavailable</span>;
}

export default Badge;
