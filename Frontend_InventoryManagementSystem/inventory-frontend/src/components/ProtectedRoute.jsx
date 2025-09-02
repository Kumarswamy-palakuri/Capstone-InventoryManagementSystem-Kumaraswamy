import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectCurrentUser, selectIsAuthenticated } from '../store/authSlice';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }
if (allowedRoles.length > 0 && user) {
    // Create a mapping for numeric roles
    const roleMapping = {
      1: 'Staff',
      2: 'Manager', 
      3: 'Admin'
    };
    
    const userRoleString = typeof user.role === 'number' 
      ? roleMapping[user.role] 
      : user.role;
    
    if (!allowedRoles.includes(userRoleString)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;
