import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole, selectIsInitialized } from '../features/auth/authSlice.js';
import { Spinner } from '../components/ui/index.jsx';

// Show spinner until auth is initialized (app load)
export function AuthGuard({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectIsInitialized);
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

// Role-based guard
export function RoleGuard({ children, roles = [] }) {
  const role = useSelector(selectUserRole);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const HIERARCHY = { student: 1, content_editor: 2, instructor: 2, admin: 3, super_admin: 4 };
  const userLevel = HIERARCHY[role] ?? 0;
  const required = Math.min(...roles.map((r) => HIERARCHY[r] ?? 99));

  if (userLevel < required && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Guest-only guard (redirect if already logged in)
export function GuestGuard({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  if (isAuthenticated) return <Navigate to={redirect} replace />;
  return children;
}
