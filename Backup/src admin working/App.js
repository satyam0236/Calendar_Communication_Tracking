// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminProvider } from './contexts/AdminContext';
import Layout from './components/Layout';
import AdminDashboard from './components/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <AdminProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </AdminProvider>
    </Router>
  );
}

export default App;