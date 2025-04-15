import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOwner?: boolean;
}

const ProtectedRoute = ({ children, requireOwner = false }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOwner && !currentUser.isOwner) {
    // If owner access is required but user is not an owner,
    // redirect to the first step with an error state
    // Redirect non-owners trying to access owner routes to the main scanner page
    return (
      <Navigate
        to="/scanner"
        state={{ error: 'Owner access required' }}
        replace
      />
    );
  }

  // If we have a user and they meet the owner requirement (if any),
  // render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;