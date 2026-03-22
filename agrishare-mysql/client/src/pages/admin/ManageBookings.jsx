import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useAdminBookings } from '../../hooks/useBookings';
import BookingTable from '../../components/bookings/BookingTable';
import Spinner from '../../components/common/Spinner';

const TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: '⏳ Pending'  },
  { key: 'approved',  label: '✅ Approved' },
  { key: 'completed', label: '🏁 Completed'},
  { key: 'rejected',  label: '❌ Rejected' },
  { key: 'cancelled', label: '🚫 Cancelled'},
];

export default function ManageBookings() {
  const { bookings, loading, total } = useAdminBookings();
  const [tab,    setTab   ] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = tab === 'all' ? bookings : bookings.filter((b) => b.status === tab);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.equipment?.name?.toLowerCase().includes(q) ||
        b.farmer?.name?.toLowerCase().includes(q) ||
        b.owner?.name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, tab, search]);

  const count = (key) =>
    key === 'all' ? bookings.length : bookings.filter((b) => b.status === key).length;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1 className="page-title">All Bookings</h1>
        <p className="page-subtitle">{total} total bookings across the platform</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '7px 16px',
              borderRadius: 'var(--radius-full)',
              border: tab === key ? 'none' : '1.5px solid var(--gray-200)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'var(--transition)',
              background: tab === key ? 'var(--green-800)' : 'white',
              color:      tab === key ? 'white' : 'var(--gray-600)',
            }}
          >
            {label} ({count(key)})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 20 }}>
        <div className="search-input-wrap">
          <span className="search-icon"><Search size={15} /></span>
          <input
            placeholder="Search by equipment, farmer or owner…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card fade-in">
        {loading ? (
          <Spinner fullPage />
        ) : (
          <BookingTable
            bookings={filtered}
            columns={['equipment', 'farmer', 'owner', 'dates', 'amount', 'status', 'created']}
            emptyText="No bookings match your filters."
          />
        )}
      </div>
    </div>
  );
}
