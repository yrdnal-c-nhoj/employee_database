import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <div className="p-6 w-full">
        <Navbar />
        <Outlet />
      </div>
    </AuthProvider>
  );
};
export default App;