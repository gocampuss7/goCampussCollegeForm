import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../assets/goCampuss.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [islogin, setIslogin] = useState(false);

  const handleLogout = () => {
    console.log("logout");
    localStorage.removeItem("authenticated");
    localStorage.removeItem("authTimestamp");
    window.location.reload();
  };

  useEffect(() => {
  const checkLogin = () => {
    setIslogin(localStorage.getItem("authenticated") === "true");
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
          {/* Logo or Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              <img src={logo} alt="Logo" className="h-16 w-50" />
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Form
            </Link>
            <Link
              to="/all-colleges"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              All Colleges
            </Link>
            {islogin && (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <HiX className="h-6 w-6" />
              ) : (
                <HiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 font-medium"
          >
            Form
          </Link>
          <Link
            to="/all-colleges"
            onClick={() => setIsOpen(false)}
            className="block text-gray-700 hover:text-blue-600 font-medium"
          >
            All Colleges
          </Link>
          {islogin && (
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Logout
              </button>
            )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
