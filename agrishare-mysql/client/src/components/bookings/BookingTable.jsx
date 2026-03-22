import { StatusBadge } from '../common/Badge';
import { formatDate, formatCurrency } from '../../utils/helpers';
import EmptyState from '../common/EmptyState';

/**
 * Reusable booking table used by all roles.
 * `columns` controls which columns to show.
 * `actions` renders action buttons per row.
 */
export default function BookingTable({
  bookings = [],
  columns  = ['equipment', 'farmer', 'dates', 'amount', 'status'],
  actions,
  emptyText = 'No bookings found.',
}) {
  if (!bookings.length) {
    return (
      <EmptyState
        icon="📋"
        title="No bookings yet"
        description={emptyText}
      />
    );
  }

  const colHeaders = {
    equipment: 'Equipment',
    farmer:    'Farmer',
    owner:     'Owner',
    dates:     'Dates',
    amount:    'Amount',
    status:    'Status',
    created:   'Requested',
  };

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map((c) => <th key={c}>{colHeaders[c] || c}</th>)}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              {columns.includes('equipment') && (
                <td>
                  <p style={{ fontWeight: 600, color: 'var(--gray-900)', fontSize: 13 }}>
                    {b.equipment?.name || '—'}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    {b.equipment?.category}
                  </p>
                </td>
              )}

              {columns.includes('farmer') && (
                <td>
                  <p style={{ fontWeight: 600, fontSize: 13 }}>{b.farmer?.name || '—'}</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{b.farmer?.phone}</p>
                </td>
              )}

              {columns.includes('owner') && (
                <td>
                  <p style={{ fontWeight: 600, fontSize: 13 }}>{b.owner?.name || '—'}</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{b.owner?.location}</p>
                </td>
              )}

              {columns.includes('dates') && (
                <td>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>{formatDate(b.startDate)}</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>→ {formatDate(b.endDate)}</p>
                </td>
              )}

              {columns.includes('amount') && (
                <td>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--green-700)' }}>
                    {formatCurrency(b.totalAmount)}
                  </span>
                </td>
              )}

              {columns.includes('status') && (
                <td><StatusBadge status={b.status} /></td>
              )}

              {columns.includes('created') && (
                <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                  {formatDate(b.createdAt)}
                </td>
              )}

              {actions && (
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {actions(b)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
