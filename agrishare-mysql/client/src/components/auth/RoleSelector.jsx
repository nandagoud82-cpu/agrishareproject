// ── RoleSelector ──────────────────────────────────────────────────────────────
const ROLES = [
  {
    value: 'farmer',
    icon:  '👨‍🌾',
    name:  'Farmer',
    desc:  'Rent equipment for your farm',
  },
  {
    value: 'owner',
    icon:  '🏭',
    name:  'Equipment Owner',
    desc:  'List & earn from your machinery',
  },
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div>
      <label className="form-label" style={{ marginBottom: 8 }}>I am a…</label>
      <div className="role-grid">
        {ROLES.map((r) => (
          <div
            key={r.value}
            className={`role-card ${value === r.value ? 'selected' : ''}`}
            onClick={() => onChange(r.value)}
          >
            <div className="role-icon">{r.icon}</div>
            <div className="role-name">{r.name}</div>
            <div className="role-desc">{r.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
