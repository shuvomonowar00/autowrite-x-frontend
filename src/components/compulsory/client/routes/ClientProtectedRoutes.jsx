import { Navigate } from 'react-router-dom';
import { useClientAuth } from '../contexts/ClientAuthContext';

const ClientProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useClientAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/client/login" replace />;
  }

  return children;
};

export default ClientProtectedRoute;
