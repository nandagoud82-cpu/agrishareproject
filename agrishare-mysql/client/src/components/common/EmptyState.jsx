// ── EmptyState ────────────────────────────────────────────────────────────────
export default function EmptyState({
  icon = '🌾',
  title = 'Nothing here yet',
  description = '',
  action,
}) {
  return (
    <div className="empty-state fade-in">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div style={{ marginTop: 20 }}>{action}</div>}
    </div>
  );
}
