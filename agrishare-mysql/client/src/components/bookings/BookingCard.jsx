import { Calendar, MapPin, IndianRupee } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { formatDate, formatCurrency, getEquipmentEmoji } from '../../utils/helpers';

export default function BookingCard({ booking, actions }) {
  const { equipment, farmer, startDate, endDate, totalAmount, status, notes, createdAt } = booking;

  return (
    <div className="card fade-in" style={{ marginBottom: 14 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48,
            background: 'var(--green-100)',
            borderRadius: 'var(--radius)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, flexShrink: 0,
          }}>
            {getEquipmentEmoji(equipment?.category)}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: 'var(--gray-900)' }}>
              {equipment?.name || 'Equipment'}
            </p>
            <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{equipment?.category}</p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
          <p style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>Dates</p>
          <p style={{ fontSize: 13, fontWeight: 600 }}>
            {formatDate(startDate)}
          </p>
          <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>→ {formatDate(endDate)}</p>
        </div>

        <div style={{ background: 'var(--green-50)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
          <p style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>Total</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--green-700)' }}>
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      {notes && (
        <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 12, fontStyle: 'italic' }}>
          "{notes}"
        </p>
      )}

      {farmer && (
        <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 12 }}>
          Requested by <strong>{farmer.name}</strong> · {formatDate(createdAt)}
        </p>
      )}

      {/* Actions */}
      {actions && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--gray-100)' }}>
          {actions}
        </div>
      )}
    </div>
  );
}
