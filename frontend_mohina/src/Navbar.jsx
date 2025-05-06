import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <aside className="w-48 min-h-screen bg-gray-100 px-6 py-8 shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-6">My Sidebar</h2>
      <ul className="space-y-4">
        <li><Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link></li>
        <li><Link to="/search" className="text-gray-700 hover:text-blue-600">Image Search</Link></li>
        <li><Link to="/mansearch" className="text-gray-700 hover:text-blue-600">Manual Search</Link></li>
      </ul>
    </aside>
  );
};

export default Navbar;
