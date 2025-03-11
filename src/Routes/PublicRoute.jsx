import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const currentUser = true

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
