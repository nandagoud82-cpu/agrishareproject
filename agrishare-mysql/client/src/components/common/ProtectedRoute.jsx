import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from './Spinner';

/**
 * Protects routes by role.
 * - If not authenticated → redirect to /login
 * - If wrong role       → redirect to their own dashboard
 */
export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isLoggedIn, authChecked } = useAuth();

  // Still verifying token
  if (!authChecked) return <Spinner fullPage />;

  // Not logged in
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  // Role check
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    const redirectMap = { farmer: '/farmer/dashboard', owner: '/owner/dashboard', admin: '/admin/dashboard' };
    return <Navigate to={redirectMap[user.role] || '/login'} replace />;
  }

  return <Outlet />;
}
