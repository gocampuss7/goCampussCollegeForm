import { useState, useEffect } from "react";
import axios from "axios";
import Login from "../components/Login";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkJwtAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_backendUrl}/login`, {
        withCredentials: true,
      });
      setIsAuthenticated(res.status === 200);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkJwtAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={checkJwtAuth} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
