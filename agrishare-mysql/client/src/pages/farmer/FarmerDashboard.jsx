import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tractor, CalendarDays, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFarmerBookings } from '../../hooks/useBookings';
import StatCard from '../../components/common/StatCard';
import BookingTable from '../../components/bookings/BookingTable';
import Spinner from '../../components/common/Spinner';
import { formatCurrency } from '../../utils/helpers';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { bookings, loading } = useFarmerBookings();

  const stats = useMemo(() => {
    const pending   = bookings.filter((b) => b.status === 'pending').length;
    const approved  = bookings.filter((b) => b.status === 'approved').length;
    const completed = bookings.filter((b) => b.status === 'completed').length;
    const totalSpent = bookings
      .filter((b) => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return { pending, approved, completed, totalSpent };
  }, [bookings]);

  const recent = bookings.slice(0, 5);

  return (
    <div className="page-content">
      {/* Welcome banner */}
      <div className="welcome-banner fade-in">
        <h2>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p>Here's what's happening with your equipment rentals today.</p>
        <Link to="/farmer/equipment" className="btn btn-secondary btn-sm" style={{ marginTop: 16, color: 'var(--green-800)' }}>
          Browse Equipment <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-4 stagger mb-6">
        <StatCard
          value={bookings.length}
          label="Total Bookings"
          icon={<CalendarDays size={22} color="var(--green-700)" />}
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
          label="Approved Bookings"
          icon={<CheckCircle size={22} color="var(--blue-500)" />}
          iconBg="stat-icon-blue"
        />
        <StatCard
          value={formatCurrency(stats.totalSpent)}
          label="Total Spent"
          icon={<span style={{ fontSize: 22 }}>💰</span>}
          iconBg="stat-icon-green"
        />
      </div>

      {/* Recent Bookings */}
      <div className="card fade-in">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 18, color: 'var(--green-900)' }}>Recent Bookings</h3>
            <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>Your 5 most recent rental requests</p>
          </div>
          <Link to="/farmer/bookings" className="btn btn-outline btn-sm">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {loading
          ? <Spinner fullPage />
          : <BookingTable
              bookings={recent}
              columns={['equipment', 'dates', 'amount', 'status']}
              emptyText="No bookings yet. Browse equipment to get started!"
            />
        }
      </div>

      {/* Quick actions */}
      <div className="grid-2 mt-6 stagger">
        <Link to="/farmer/equipment" style={{ textDecoration: 'none' }}>
          <div className="card card-hover" style={{ borderLeft: '4px solid var(--green-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 36 }}>🚜</span>
              <div>
                <h4 style={{ fontSize: 16, color: 'var(--green-900)' }}>Browse Equipment</h4>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 3 }}>
                  Find tractors, harvesters, sprayers and more near you.
                </p>
              </div>
              <ArrowRight size={18} color="var(--green-500)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        <Link to="/farmer/bookings" style={{ textDecoration: 'none' }}>
          <div className="card card-hover" style={{ borderLeft: '4px solid var(--amber-500)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 36 }}>📋</span>
              <div>
                <h4 style={{ fontSize: 16, color: 'var(--green-900)' }}>My Bookings</h4>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 3 }}>
                  Track status of all your equipment rental requests.
                </p>
              </div>
              <ArrowRight size={18} color="var(--amber-500)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
