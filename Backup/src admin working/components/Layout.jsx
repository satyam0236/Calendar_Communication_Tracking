// src/components/Layout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">ENTNT</h1>
        </div>
        <nav className="mt-6">
          <Link to="/" className="flex items-center px-6 py-3 text-gray-700 bg-blue-50">
            <span className="material-icons mr-3">dashboard</span>
            Admin
          </Link>
          <Link to="/user" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <span className="material-icons mr-3">person</span>
            User
          </Link>
          <Link to="/reports" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50">
            <span className="material-icons mr-3">assessment</span>
            Reports
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;