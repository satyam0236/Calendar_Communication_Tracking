// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import Layout from './components/Layout';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';

function App() {
  return (
    <Router>
      <AdminProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/reports" element={<div>Reports Coming Soon</div>} />
          </Routes>
        </Layout>
      </AdminProvider>
    </Router>
  );
}

export default App;