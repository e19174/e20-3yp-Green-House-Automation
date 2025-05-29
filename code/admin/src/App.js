import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import Layout from './Layout';
import AdminPanel from './pages/AdminPanel';
import AdminProfile from './pages/AdminProfile';

function AppContent() {
  const [activeTab, setActiveTab] = useState('devices');
  const location = useLocation();
  const navigate = useNavigate();

  // Sync activeTab with URL except when on /profile
  useEffect(() => {
    const path = location.pathname.slice(1) || 'devices';
    if (path !== 'profile') {
      setActiveTab(path);
    }
  }, [location]);

  // Update URL when activeTab changes (excluding profile)
  useEffect(() => {
    if (activeTab !== 'profile') {
      navigate(`/${activeTab}`, { replace: true });
    }
  }, [activeTab, navigate]);

  return (
    <Routes>
      {/* Profile route first */}
      <Route
        path="/Adminprofile"
        element={
          <Layout activeTab="Adminprofile" setActiveTab={() => {}}>
            <AdminProfile />
          </Layout>
        }
      />

      {/* Dynamic tabs route */}
      <Route
        path="/:tab"
        element={
          <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            <AdminPanel activeTab={activeTab} />
          </Layout>
        }
      />

      {/* Redirect root to devices */}
      <Route path="/" element={<Navigate to="/devices" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
