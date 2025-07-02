import { useState, useEffect } from "react";
import Login from "../components/Login";

const EXPIRY_DURATION_MS = 60 * 1000;

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("authenticated");
    const timestamp = localStorage.getItem("authTimestamp");

    if (storedAuth === "true" && timestamp) {
      const now = Date.now();
      const age = now - parseInt(timestamp, 10);

      if (age < EXPIRY_DURATION_MS) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("authenticated");
        localStorage.removeItem("authTimestamp");
      }
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("authenticated", "true");
    localStorage.setItem("authTimestamp", Date.now().toString());
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;