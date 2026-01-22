import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing (or spinner) while checking auth
  if (loading) return null;

  // Redirect to login if no user
  if (!user) return <Navigate to="/login" replace />;

  // If logged in, show the children
  return children;
};

export default ProtectedRoute;
