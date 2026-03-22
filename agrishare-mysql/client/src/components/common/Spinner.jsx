// ── Spinner ───────────────────────────────────────────────────────────────────
export default function Spinner({ size = 36, fullPage = false }) {
  const spinner = (
    <div
      className="loading-spinner"
      style={{ width: size, height: size }}
    />
  );

  if (fullPage) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}>
        {spinner}
        <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Loading…</p>
      </div>
    );
  }

  return spinner;
}
