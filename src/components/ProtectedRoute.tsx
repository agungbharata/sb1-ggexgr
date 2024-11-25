import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, userRole, loading } = useAuth();

  // Debug information
  console.log('[Route] Current state:', {
    path: location.pathname,
    hasUser: !!user,
    userRole,
    loading,
    requiredRole,
    userEmail: user?.email,
    timestamp: new Date().toISOString()
  });

  // Show loading state
  if (loading) {
    console.log('[Route] Showing loading state');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <div className="text-gray-600">Loading...</div>
        {user && (
          <div className="text-sm text-gray-400 mt-2">
            {user.email}
          </div>
        )}
      </div>
    );
  }

  // Check authentication
  if (!user) {
    console.log('[Route] No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && userRole !== requiredRole) {
    console.log('[Route] Invalid role:', {
      required: requiredRole,
      current: userRole,
      user: user.email
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // Grant access
  console.log('[Route] Access granted:', {
    user: user.email,
    role: userRole
  });
  return <>{children}</>;
};
