import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";

const App = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Get current path to determine if we should show navbar
  const path = window.location.pathname;
  const isAuthPage = path === '/login' || path === '/register';

  return (
    <div className="p-6 w-full">
      {!isAuthPage && <Navbar />}
      <Outlet />
    </div>
  );
};
export default App;