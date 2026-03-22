// ── StatCard ──────────────────────────────────────────────────────────────────
export default function StatCard({
  value,
  label,
  icon,
  iconBg = 'stat-icon-green',
  change,
  changePositive,
  prefix = '',
  suffix = '',
}) {
  return (
    <div className="stat-card fade-in">
      <div className="stat-card-body">
        <p className="value">
          {prefix}{value}{suffix}
        </p>
        <p className="label">{label}</p>
        {change !== undefined && (
          <p
            className="change"
            style={{ color: changePositive ? 'var(--green-600)' : 'var(--red-500)' }}
          >
            {changePositive ? '↑' : '↓'} {change}
          </p>
        )}
      </div>
      <div className={`stat-card-icon ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}
