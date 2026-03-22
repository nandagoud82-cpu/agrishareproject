import { useState, useEffect, useMemo } from 'react';
import { Users, Tractor, CalendarDays, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/common/StatCard';
import { useAdminBookings } from '../../hooks/useBookings';
import BookingTable from '../../components/bookings/BookingTable';
import { RoleBadge } from '../../components/common/Badge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import Spinner from '../../components/common/Spinner';

export default function AdminDashboard() {
  const [users,    setUsers   ] = useState([]);
  const [equip,    setEquip   ] = useState([]);
  const [uLoading, setULoading] = useState(true);
  const { bookings, loading: bLoading } = useAdminBookings();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uRes, eRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/equipment'),
        ]);
        setUsers(uRes.data.users || []);
        setEquip(eRes.data.equipment || []);
      } catch { /* handled globally */ }
      finally { setULoading(false); }
    };
    fetchAll();
  }, []);

  const stats = useMemo(() => {
    const farmers = users.filter((u) => u.role === 'farmer').length;
    const owners  = users.filter((u) => u.role === 'owner').length;
    const revenue = bookings
      .filter((b) => b.status === 'completed')
      .reduce((s, b) => s + (b.totalAmount || 0), 0);
    const pending = bookings.filter((b) => b.status === 'pending').length;
    return { farmers, owners, revenue, pending };
  }, [users, bookings]);

  const recentBookings = bookings.slice(0, 6);
  const recentUsers    = users.slice(0, 5);

  return (
    <div className="page-content">
      {/* Banner */}
      <div className="welcome-banner fade-in" style={{ background: 'linear-gradient(120deg, #052e16, #166534)' }}>
        <h2>🛡️ Admin Control Panel</h2>
        <p>Platform overview — users, equipment, and booking activity at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid-4 stagger mb-6">
        <StatCard
          value={users.length}
          label="Total Users"
          icon={<Users size={22} color="var(--green-700)" />}
          iconBg="stat-icon-green"
        />
        <StatCard
          value={equip.length}
          label="Equipment Listed"
          icon={<Tractor size={22} color="#1e40af" />}
          iconBg="stat-icon-blue"
        />
        <StatCard
          value={bookings.length}
          label="Total Bookings"
          icon={<CalendarDays size={22} color="#92400e" />}
          iconBg="stat-icon-amber"
        />
        <StatCard
          value={formatCurrency(stats.revenue)}
          label="Platform Revenue"
          icon={<TrendingUp size={22} color="var(--green-700)" />}
          iconBg="stat-icon-green"
        />
      </div>

      {/* Role breakdown */}
      <div className="grid-3 mb-6 stagger">
        {[
          { label: 'Farmers',           val: stats.farmers,  color: 'var(--green-600)', bg: 'var(--green-50)',  border: 'var(--green-200)',  icon: '👨‍🌾' },
          { label: 'Equipment Owners',  val: stats.owners,   color: '#2563eb',           bg: 'var(--blue-50)',   border: 'var(--blue-200)',   icon: '🏭' },
          { label: 'Pending Approvals', val: stats.pending,  color: '#d97706',           bg: 'var(--amber-50)', border: 'var(--amber-200)', icon: '⏳' },
        ].map(({ label, val, color, bg, border, icon }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 'var(--radius)', padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color }}>{val}</p>
            </div>
            <span style={{ fontSize: 38, opacity: .8 }}>{icon}</span>
          </div>
        ))}
      </div>

      <div className="grid-2 gap-6">
        {/* Recent bookings */}
        <div className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, color: 'var(--green-900)' }}>Recent Bookings</h3>
            <Link to="/admin/bookings" className="btn btn-outline btn-sm">
              All <ArrowRight size={13} />
            </Link>
          </div>
          {bLoading ? <Spinner /> : (
            <BookingTable
              bookings={recentBookings}
              columns={['equipment', 'farmer', 'amount', 'status']}
              emptyText="No bookings yet."
            />
          )}
        </div>

        {/* Recent users */}
        <div className="card fade-in">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <h3 style={{ fontSize: 17, color: 'var(--green-900)' }}>Recent Users</h3>
            <Link to="/admin/users" className="btn btn-outline btn-sm">
              All <ArrowRight size={13} />
            </Link>
          </div>
          {uLoading ? <Spinner /> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <p style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</p>
                        <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>{u.email}</p>
                      </td>
                      <td><RoleBadge role={u.role} /></td>
                      <td style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                        {formatDate(u.createdAt)}
                      </td>
                    </tr>
                  ))}
                  {recentUsers.length === 0 && (
                    <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--gray-400)', padding: 24 }}>No users yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
