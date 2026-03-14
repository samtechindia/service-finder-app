import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard if role doesn't match
    if (user.role === 'CUSTOMER') {
      return <Navigate to="/customer/dashboard" replace />;
    } else if (user.role === 'PROVIDER') {
      return <Navigate to="/provider/dashboard" replace />;
    } else {
      // Fallback to home if role is not recognized
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
