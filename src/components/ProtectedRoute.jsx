// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ roles  }) => {
  const { isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles
  if (roles && roles.length > 0) {
    const hasRequiredRoles = hasRole(roles);
      
       
    
    if (!hasRequiredRoles) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

 
  return <Outlet /> ;
};

export default ProtectedRoute;