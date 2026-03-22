import { useState } from 'react';
import { Calendar, IndianRupee, Send } from 'lucide-react';
import { formatCurrency, daysBetween, minBookingDate } from '../../utils/helpers';

export default function BookingForm({ equipment, onSubmit, onCancel, loading = false }) {
  const today    = minBookingDate();
  const [form, setForm] = useState({ startDate: today, endDate: today, notes: '' });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const days   = daysBetween(form.startDate, form.endDate);
  const total  = days * (equipment?.pricePerDay || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      setError('Both dates are required.'); return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date must be on or after start date.'); return;
    }
    setError('');
    onSubmit({ equipmentId: equipment?.id, ...form });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Equipment summary */}
      <div style={{
        background: 'var(--green-50)',
        border: '1.5px solid var(--green-200)',
        borderRadius: 'var(--radius)',
        padding: '14px 18px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <span style={{ fontSize: 38 }}>🚜</span>
        <div>
          <p style={{ fontWeight: 700, color: 'var(--green-900)', fontSize: 15 }}>
            {equipment?.name}
          </p>
          <p style={{ fontSize: 12, color: 'var(--green-700)' }}>
            {formatCurrency(equipment?.pricePerDay)} / day · {equipment?.location}
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {/* Dates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div className="form-group">
          <label className="form-label">
            <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
            Start Date *
          </label>
          <input
            type="date"
            className="form-input"
            value={form.startDate}
            min={today}
            onChange={(e) => {
              const d = e.target.value;
              setForm((f) => ({
                ...f,
                startDate: d,
                endDate: f.endDate < d ? d : f.endDate,
              }));
            }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            <Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />
            End Date *
          </label>
          <input
            type="date"
            className="form-input"
            value={form.endDate}
            min={form.startDate}
            onChange={set('endDate')}
            required
          />
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea
          className="form-textarea"
          placeholder="Describe your usage needs, farm size, crop type…"
          value={form.notes}
          onChange={set('notes')}
          rows={3}
        />
      </div>

      {/* Cost summary */}
      <div style={{
        background: 'var(--gray-50)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius)',
        padding: '14px 18px',
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: 'var(--gray-600)' }}>Duration</span>
          <span style={{ fontWeight: 600 }}>{days} day{days !== 1 ? 's' : ''}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
          <span style={{ color: 'var(--gray-600)' }}>Rate</span>
          <span style={{ fontWeight: 600 }}>{formatCurrency(equipment?.pricePerDay)}/day</span>
        </div>
        <div style={{ borderTop: '1px solid var(--gray-200)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--green-700)' }}>
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? <span className="loading-spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
            : <><Send size={15} /> Send Request</>
          }
        </button>
      </div>
    </form>
  );
}
