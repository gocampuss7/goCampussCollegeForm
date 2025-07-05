import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import axios from "axios";
import logo from "../assets/goCampuss.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_backendUrl}/logout`, {
        withCredentials: true,
      });
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_backendUrl}/login`, {
          withCredentials: true,
        });
        setIsLogin(res.status === 200);
      } catch {
        setIsLogin(false);
      }
    };

    checkLogin();

    window.addEventListener("authChanged", checkLogin);
    return () => {
      window.removeEventListener("authChanged", checkLogin);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              <img src={logo} alt="Logo" className="h-16 w-50" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Form</Link>
            <Link to="/all-colleges" className="text-gray-700 hover:text-blue-600 font-medium">All Colleges</Link>
            {isLogin && (
              <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600 font-medium">
                Logout
              </button>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-blue-600 font-medium">Form</Link>
          <Link to="/all-colleges" onClick={() => setIsOpen(false)} className="block text-gray-700 hover:text-blue-600 font-medium">All Colleges</Link>
          {isLogin && (
            <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600 font-medium">
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
