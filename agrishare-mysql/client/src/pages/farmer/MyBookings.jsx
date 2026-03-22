import { useState, useMemo } from 'react';
import { useFarmerBookings } from '../../hooks/useBookings.js';
import BookingTable from '../../components/bookings/BookingTable.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';

const TABS = [
  { key: 'all',       label: 'All' },
  { key: 'pending',   label: 'Pending' },
  { key: 'approved',  label: 'Approved' },
  { key: 'completed', label: 'Completed' },
  { key: 'rejected',  label: 'Rejected' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function MyBookings() {
  const { bookings, loading, handleCancel } = useFarmerBookings();
  const [tab, setTab] = useState('all');

  const filtered = useMemo(() => {
    if (tab === 'all') return bookings;
    return bookings.filter((b) => b.status === tab);
  }, [bookings, tab]);

  const count = (key) =>
    key === 'all' ? bookings.length : bookings.filter((b) => b.status === key).length;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">My Bookings</h1>
        <p className="page-subtitle">Track all your equipment rental requests</p>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition)',
              background: tab === key ? 'var(--green-700)' : 'var(--white)',
              color: tab === key ? 'white' : 'var(--gray-600)',
              // Fixed: Only one 'border' key defined to avoid Vite compiler warnings
              border: tab === key ? 'none' : '1.5px solid var(--gray-200)',
            }}
          >
            {label} <span style={{ opacity: .7 }}>({count(key)})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card fade-in">
        {loading ? (
          <Spinner fullPage />
        ) : (
          <BookingTable
            bookings={filtered}
            columns={['equipment', 'dates', 'amount', 'status', 'created']}
            emptyText="No bookings in this category."
            actions={(b) => (
              <>
                {b.status === 'pending' && (
                  <button
                    className="btn btn-danger btn-xs"
                    onClick={() => handleCancel(b.id)}
                  >
                    Cancel
                  </button>
                )}
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}