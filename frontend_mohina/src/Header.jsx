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

  const handleHowItWorksClick = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "how-it-works" } });
    } else {
      const section = document.getElementById("how-it-works");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between relative z-50 sticky top-0">
      
      {/* Left: Logo */}
      <div onClick={handleHomeClick} className="flex items-center space-x-2 cursor-pointer">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">EZ-Rx-ID</span>
      </div>

      {/* Center: Nav Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
        <button onClick={handleHomeClick} className="text-gray-700 hover:text-blue-600 font-medium">
          Home
        </button>
        <button onClick={handleHowItWorksClick} className="text-gray-700 hover:text-blue-600 font-medium">
          How it Works
        </button>
        <Link to="/chat" className="text-gray-700 hover:text-blue-600 font-medium">
          AI Chat
        </Link>
      </div>

      {/* Right: GitHub Icon */}
      <a
        href="https://github.com/Jguan10/EZ-Rx-ID"
        target="_blank"
        rel="noopener noreferrer"
        className="transition transform hover:scale-110"
      >
        <div className="bg-gray-900 p-1.5 rounded-full shadow-md hover:bg-gray-850 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2.01-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.3-1.68-1.3-1.68-1.06-.72.08-.71.08-.71 1.18.08 1.8 1.21 1.8 1.21 1.04 1.79 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.12-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.64 1.58.24 2.75.12 3.04.75.81 1.2 1.84 1.2 3.1 0 4.44-2.7 5.41-5.27 5.69.42.36.8 1.1.8 2.22 0 1.6-.01 2.88-.01 3.27 0 .31.21.68.8.56A10.51 10.51 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
          </svg>
        </div>
      </a>
    </header>
  );
};

export default Header;
