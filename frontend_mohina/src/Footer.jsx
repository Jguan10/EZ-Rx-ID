import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from './image.jpg'; 

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleDisclaimerClick = () => {
    const disclaimer = document.getElementById("disclaimer");
    const text = disclaimer?.querySelector(".disclaimer-text");
    if (disclaimer && text) {
      disclaimer.scrollIntoView({ behavior: "smooth" });
  
      text.classList.add("text-blue-500", "scale-110");
  
      setTimeout(() => {
        text.classList.remove("text-blue-500", "scale-110");
      }, 1500);
    }
  };
  

  
  
  

  return (
    <footer className="bg-white border-t mt-16 px-6 py-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-900 text-base">
        {/* Logo and Description */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img src={logo} alt="EZ-Rx-ID Logo" className="w-10 h-10" />
            <h3 className="text-2xl font-bold text-gray-900">EZ-Rx-ID</h3>
          </div>
          <p className="text-md text-gray-600 max-w-sm">
            Advanced pill identification using AI to help identify medications quickly and accurately.
          </p>

        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2">

          <li>
            <Link
                to="/"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="text-gray-600 hover:text-blue-600"
            >
                Home
            </Link>
          </li>

            
            

            <li><a href="/#how-it-works" className="text-gray-600 hover:text-blue-600">How it Works</a></li>
            <li>
                <Link to="/chat" 
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-gray-600 hover:text-blue-600"
                    >
                        AI Chat
                </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Legal</h4>
          <ul className="space-y-2">
          <li>
            <button onClick={handleDisclaimerClick} className="text-gray-600 hover:text-blue-600">
                Disclaimer
            </button>
          </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact</h4>
          <a
            href="https://github.com/Jguan10/EZ-Rx-ID"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.38 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2.01-3.2.7-3.88-1.54-3.88-1.54-.53-1.33-1.3-1.68-1.3-1.68-1.06-.72.08-.71.08-.71 1.18.08 1.8 1.21 1.8 1.21 1.04 1.79 2.73 1.27 3.4.97.1-.75.41-1.27.74-1.56-2.56-.29-5.25-1.28-5.25-5.71 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.46.12-3.04 0 0 .98-.31 3.2 1.18a11.1 11.1 0 012.92-.39c.99.01 1.99.13 2.92.39 2.22-1.49 3.2-1.18 3.2-1.18.64 1.58.24 2.75.12 3.04.75.81 1.2 1.84 1.2 3.1 0 4.44-2.7 5.41-5.27 5.69.42.36.8 1.1.8 2.22 0 1.6-.01 2.88-.01 3.27 0 .31.21.68.8.56A10.51 10.51 0 0023.5 12c0-6.27-5.23-11.5-11.5-11.5z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t mt-12 pt-6 text-center text-sm text-gray-500">
        © 2025 EZ-Rx-ID. All rights reserved.

        <div
            id="disclaimer"
            className="text-center text-xs text-gray-500 mt-2 space-y-1 transition-all duration-500 transform"
            >
            <p className="disclaimer-text text-sm transition-all duration-700 transform">
                Disclaimer: This tool is for informational purposes only. Always consult a healthcare professional for medical advice.</p>
            
        </div>

      </div>
    </footer>
  );
};

export default Footer;
