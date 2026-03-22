import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Tractor, CalendarDays, User,
  LogOut, ShieldCheck, Users, ListChecks, PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';

// ── Nav config per role ────────────────────────────────────────────────────────
const FARMER_NAV = [
  { to: '/farmer/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/farmer/equipment',  icon: Tractor,         label: 'Browse Equipment' },
  { to: '/farmer/bookings',   icon: CalendarDays,    label: 'My Bookings' },
  { to: '/farmer/profile',    icon: User,            label: 'Profile' },
];

const OWNER_NAV = [
  { to: '/owner/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/owner/equipment',   icon: Tractor,         label: 'My Equipment' },
  { to: '/owner/bookings',    icon: ListChecks,      label: 'Booking Requests' },
  { to: '/owner/add',         icon: PlusCircle,      label: 'Add Equipment' },
  { to: '/owner/profile',     icon: User,            label: 'Profile' },
];

const ADMIN_NAV = [
  { to: '/admin/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',       icon: Users,           label: 'Users' },
  { to: '/admin/equipment',   icon: Tractor,         label: 'Equipment' },
  { to: '/admin/bookings',    icon: CalendarDays,    label: 'Bookings' },
];

export default function Sidebar() {
  const { user, logout, isFarmer, isOwner, isAdmin } = useAuth();
  const navigate = useNavigate();

  const navItems = isAdmin ? ADMIN_NAV : isOwner ? OWNER_NAV : FARMER_NAV;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🌿</div>
        <div className="sidebar-logo-text">
          <h2>AgriShare</h2>
          <p>Farm Equipment Rental</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-section">
        {isAdmin && (
          <p className="sidebar-section-label">Admin Panel</p>
        )}

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">
              <Icon size={17} />
            </span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {getInitials(user.name)}
            </div>
            <div className="sidebar-user-info">
              <p className="name">{user.name}</p>
              <p className="role">{user.role}</p>
            </div>
          </div>
        )}
        <button className="nav-item" onClick={handleLogout} style={{ color: '#fca5a5' }}>
          <span className="nav-icon"><LogOut size={16} /></span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
