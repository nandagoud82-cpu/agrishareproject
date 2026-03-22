import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tractor, CalendarCheck, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMyEquipment } from '../../hooks/useEquipment';
import { useOwnerBookings } from '../../hooks/useBookings';
import StatCard from '../../components/common/StatCard';
import BookingTable from '../../components/bookings/BookingTable';
import Spinner from '../../components/common/Spinner';
import { formatCurrency } from '../../utils/helpers';

export default function OwnerDashboard() {
  const { user } = useAuth();
  const { equipment }          = useMyEquipment();
  const { bookings, loading }  = useOwnerBookings();

  const stats = useMemo(() => {
    const pending   = bookings.filter((b) => b.status === 'pending').length;
    const approved  = bookings.filter((b) => b.status === 'approved').length;
    const completed = bookings.filter((b) => b.status === 'completed').length;
    const revenue   = bookings
      .filter((b) => b.status === 'completed')
      .reduce((s, b) => s + (b.totalAmount || 0), 0);
    return { pending, approved, completed, revenue };
  }, [bookings]);

  const recent = bookings.slice(0, 5);

  return (
    <div className="page-content">
      {/* Welcome */}
      <div className="welcome-banner fade-in" style={{ background: 'linear-gradient(120deg, var(--green-900), var(--green-700))' }}>
        <h2>Owner Dashboard 🏭</h2>
        <p>Welcome back, {user?.name}. Manage your equipment and booking requests.</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Link to="/owner/add" className="btn btn-secondary btn-sm" style={{ color: 'var(--green-800)' }}>
            + List Equipment
          </Link>
          <Link to="/owner/bookings" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}>
            View Requests
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 stagger mb-6">
        <StatCard
          value={equipment.length}
          label="Equipment Listed"
          icon={<Tractor size={22} color="var(--green-700)" />}
          iconBg="stat-icon-green"
        />
        <StatCard
          value={stats.pending}
          label="Pending Requests"
          icon={<Clock size={22} color="#92400e" />}
          iconBg="stat-icon-amber"
        />
        <StatCard
          value={stats.approved}
          label="Active Rentals"
          icon={<CalendarCheck size={22} color="var(--blue-500)" />}
          iconBg="stat-icon-blue"
        />
        <StatCard
          value={formatCurrency(stats.revenue)}
          label="Total Revenue"
          icon={<TrendingUp size={22} color="var(--green-700)" />}
          iconBg="stat-icon-green"
        />
      </div>

      {/* Recent requests */}
      <div className="card fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, color: 'var(--green-900)' }}>Recent Booking Requests</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>Latest 5 requests for your equipment</p>
          </div>
          <Link to="/owner/bookings" className="btn btn-outline btn-sm">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <Spinner fullPage />
        ) : (
          <BookingTable
            bookings={recent}
            columns={['equipment', 'farmer', 'dates', 'amount', 'status']}
            emptyText="No booking requests yet."
          />
        )}
      </div>

      {/* My equipment preview */}
      <div className="card mt-6 fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, color: 'var(--green-900)' }}>My Equipment</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
              {equipment.length} item{equipment.length !== 1 ? 's' : ''} listed
            </p>
          </div>
          <Link to="/owner/equipment" className="btn btn-outline btn-sm">
            Manage <ArrowRight size={13} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {equipment.slice(0, 6).map((eq) => (
            <div key={eq._id} style={{
              background: eq.available ? 'var(--green-50)' : 'var(--gray-100)',
              border: `1.5px solid ${eq.available ? 'var(--green-200)' : 'var(--gray-200)'}`,
              borderRadius: 'var(--radius)',
              padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13,
            }}>
              <span style={{ fontSize: 22 }}>🚜</span>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{eq.name}</p>
                <p style={{ fontSize: 11, color: eq.available ? 'var(--green-600)' : 'var(--gray-400)' }}>
                  {eq.available ? '● Available' : '○ Paused'}
                </p>
              </div>
            </div>
          ))}

          {equipment.length === 0 && (
            <div style={{ color: 'var(--gray-400)', fontSize: 14, padding: '20px 0' }}>
              No equipment listed yet.{' '}
              <Link to="/owner/add" style={{ color: 'var(--green-600)', fontWeight: 600 }}>
                Add your first item →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
