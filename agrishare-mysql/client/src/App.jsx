import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import './styles/globals.css';

// ── Layout & Guards ───────────────────────────────────────────────────────────
import AppLayout      from './components/common/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// ── Auth ──────────────────────────────────────────────────────────────────────
import AuthPage from './pages/auth/AuthPage';

// ── Farmer pages ──────────────────────────────────────────────────────────────
import FarmerDashboard  from './pages/farmer/FarmerDashboard';
import BrowseEquipment  from './pages/farmer/BrowseEquipment';
import MyBookings       from './pages/farmer/MyBookings';

// ── Owner pages ───────────────────────────────────────────────────────────────
import OwnerDashboard   from './pages/owner/OwnerDashboard';
import MyEquipment      from './pages/owner/MyEquipment';
import BookingRequests  from './pages/owner/BookingRequests';
import AddEquipment     from './pages/owner/AddEquipment';

// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminDashboard   from './pages/admin/AdminDashboard';
import ManageUsers      from './pages/admin/ManageUsers';
import ManageEquipment  from './pages/admin/ManageEquipment';
import ManageBookings   from './pages/admin/ManageBookings';

// ── Shared pages ──────────────────────────────────────────────────────────────
import ProfilePage from './pages/ProfilePage';

// ── 404 ───────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      background: 'var(--green-50)',
    }}>
      <span style={{ fontSize: 72 }}>🌾</span>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, color: 'var(--green-900)' }}>
        404
      </h1>
      <p style={{ color: 'var(--gray-500)', fontSize: 16 }}>
        Oops! This field is empty.
      </p>
      <a href="/" className="btn btn-primary" style={{ marginTop: 8 }}>
        Go Home
      </a>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14,
              borderRadius: 10,
              boxShadow: '0 4px 20px rgba(5,46,22,0.15)',
            },
            success: {
              style: {
                background: 'var(--green-50)',
                color: 'var(--green-900)',
                border: '1.5px solid var(--green-300)',
              },
              iconTheme: { primary: 'var(--green-600)', secondary: 'white' },
            },
            error: {
              style: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1.5px solid #fecaca',
              },
            },
          }}
        />

        <Routes>
          {/* ── Public ── */}
          <Route path="/login"    element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/"         element={<Navigate to="/login" replace />} />

          {/* ══════════════════════════════════════
              FARMER ROUTES
          ══════════════════════════════════════ */}
          <Route element={<ProtectedRoute allowedRoles={['farmer']} />}>
            <Route element={<AppLayout />}>
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/equipment" element={<BrowseEquipment />} />
              <Route path="/farmer/bookings"  element={<MyBookings />} />
              <Route path="/farmer/profile"   element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ══════════════════════════════════════
              OWNER ROUTES
          ══════════════════════════════════════ */}
          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route element={<AppLayout />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/owner/equipment" element={<MyEquipment />} />
              <Route path="/owner/bookings"  element={<BookingRequests />} />
              <Route path="/owner/add"       element={<AddEquipment />} />
              <Route path="/owner/profile"   element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ══════════════════════════════════════
              ADMIN ROUTES
          ══════════════════════════════════════ */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users"     element={<ManageUsers />} />
              <Route path="/admin/equipment" element={<ManageEquipment />} />
              <Route path="/admin/bookings"  element={<ManageBookings />} />
            </Route>
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
