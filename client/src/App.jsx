import { Outlet, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading..</div>
      </div>
    );
  }

  // Get current path to determine if we should show navbar
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Centralized Auth Guard: Redirect to login if not authenticated
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if already authenticated and trying to access login/register
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="p-6 w-full">
      {!isAuthPage && <Navbar />}
      <Outlet />
    </div>
  );
};
export default App;