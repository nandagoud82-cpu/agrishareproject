import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, CheckSquare } from 'lucide-react';
import { useOwnerBookings } from '../../hooks/useBookings.js';
import BookingTable from '../../components/bookings/BookingTable.jsx';
import BookingCard from '../../components/bookings/BookingCard.jsx';
import Spinner from '../../components/common/Spinner.jsx';
import Modal from '../../components/common/Modal.jsx';
import { StatusBadge } from '../../components/common/Badge.jsx';
import { formatDate, formatCurrency } from '../../utils/helpers.js';

const TABS = [
  { key: 'all',       label: 'All' },
  { key: 'pending',   label: '⏳ Pending' },
  { key: 'approved',  label: '✅ Approved' },
  { key: 'completed', label: '🏁 Completed' },
  { key: 'rejected',  label: '❌ Rejected' },
];

export default function BookingRequests() {
  const { bookings, loading, handleStatus, handleComplete } = useOwnerBookings();

  const [tab,     setTab    ] = useState('all');
  const [detail,  setDetail ] = useState(null); 

  const filtered = useMemo(() => {
    if (tab === 'all') return bookings;
    return bookings.filter((b) => b.status === tab);
  }, [bookings, tab]);

  const count = (key) =>
    key === 'all' ? bookings.length : bookings.filter((b) => b.status === key).length;

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Booking Requests</h1>
          <p className="page-subtitle">Review and approve rental requests for your equipment</p>
        </div>
        {pendingCount > 0 && (
          <div style={{
            background: 'var(--amber-100)',
            border: '1.5px solid var(--amber-400)',
            borderRadius: 'var(--radius)',
            padding: '10px 18px',
            fontSize: 13,
            color: '#92400e',
            fontWeight: 600,
          }}>
            ⏳ {pendingCount} request{pendingCount !== 1 ? 's' : ''} awaiting approval
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {TABS.map(({ key, label }) => {
          const cnt = count(key);
          const isPending = key === 'pending' && cnt > 0;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                padding: '7px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition)',
                background: tab === key
                  ? 'var(--green-700)'
                  : isPending ? 'var(--amber-100)' : 'var(--white)',
                color: tab === key
                  ? 'white'
                  : isPending ? '#92400e' : 'var(--gray-600)',
                // FIXED: Combined into one conditional border property
                border: tab === key ? 'none' : `1.5px solid ${isPending ? 'var(--amber-300)' : 'var(--gray-200)'}`,
                position: 'relative',
              }}
            >
              {label}{' '}
              <span style={{ opacity: .75 }}>({cnt})</span>
            </button>
          );
        })}
      </div>

      <div className="card fade-in">
        {loading ? (
          <Spinner fullPage />
        ) : (
          <BookingTable
            bookings={filtered}
            columns={['equipment', 'farmer', 'dates', 'amount', 'status']}
            emptyText="No requests in this category."
            actions={(b) => (
              <>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => setDetail(b)}
                >
                  👁 View
                </button>

                {b.status === 'pending' && (
                  <>
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => handleStatus(b.id, 'approved')}
                    >
                      <CheckCircle size={12} /> Approve
                    </button>
                    <button
                      className="btn btn-danger btn-xs"
                      onClick={() => handleStatus(b.id, 'rejected')}
                    >
                      <XCircle size={12} /> Reject
                    </button>
                  </>
                )}

                {b.status === 'approved' && (
                  <button
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleComplete(b.id)}
                  >
                    <CheckSquare size={12} /> Complete
                  </button>
                )}
              </>
            )}
          />
        )}
      </div>

      <Modal
        isOpen={!!detail}
        onClose={() => setDetail(null)}
        title="Booking Detail"
        size="lg"
      >
        {detail && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--green-50)',
              border: '1.5px solid var(--green-200)',
              borderRadius: 'var(--radius)',
              padding: '14px 18px',
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 36 }}>🚜</span>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--green-900)' }}>
                    {detail.equipment?.name}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--green-700)' }}>
                    {detail.equipment?.category} · {detail.equipment?.location}
                  </p>
                </div>
              </div>
              <StatusBadge status={detail.status} />
            </div>

            {[
              ['Farmer',       detail.farmer?.name],
              ['Phone',        detail.farmer?.phone],
              ['Start Date',   formatDate(detail.startDate)],
              ['End Date',     formatDate(detail.endDate)],
              ['Total Amount', formatCurrency(detail.totalAmount)],
              ['Requested On', formatDate(detail.createdAt)],
            ].map(([lbl, val]) => (
              <div key={lbl} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--gray-100)',
                fontSize: 14,
              }}>
                <span style={{ color: 'var(--gray-500)', fontWeight: 500 }}>{lbl}</span>
                <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{val}</span>
              </div>
            ))}

            {detail.notes && (
              <div style={{ marginTop: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', padding: '12px 16px' }}>
                <p style={{ fontSize: 12, color: 'var(--gray-400)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  Farmer's Notes
                </p>
                <p style={{ fontSize: 14, color: 'var(--gray-700)', fontStyle: 'italic' }}>
                  "{detail.notes}"
                </p>
              </div>
            )}

            {detail.status === 'pending' && (
              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-danger"
                  onClick={() => { handleStatus(detail.id, 'rejected'); setDetail(null); }}
                >
                  <XCircle size={15} /> Reject
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => { handleStatus(detail.id, 'approved'); setDetail(null); }}
                >
                  <CheckCircle size={15} /> Approve
                </button>
              </div>
            )}

            {detail.status === 'approved' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => { handleComplete(detail.id); setDetail(null); }}
                >
                  <CheckSquare size={15} /> Mark as Completed
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}