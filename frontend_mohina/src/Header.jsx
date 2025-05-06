import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from './image.jpg';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate("/");
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Logo and Website Name */}
      <div onClick={handleHomeClick} className="flex items-center space-x-2 cursor-pointer">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">EZ-Rx-ID</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex items-center space-x-6">
        <button onClick={handleHomeClick} className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </button>

        <button
          onClick={() => {
            if (location.pathname !== "/") {
              navigate("/");
              setTimeout(() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            } else {
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          How it Works
        </button>

        <Link to="/chat" className="text-gray-700 hover:text-blue-600 font-medium">
          AI Chat
        </Link>
      </nav>

      {/* GitHub Button */}
      <a
        href="https://github.com/Jguan10/EZ-Rx-ID"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-100 border border-gray-300 text-sm px-4 py-1.5 rounded-full text-gray-800 font-medium hover:bg-gray-200 transition"
      >
        GitHub
      </a>
    </header>
  );
};

export default Header;
