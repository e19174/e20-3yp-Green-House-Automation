import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import AdminPanel from './pages/AdminPanel';
import Sidebar from './components/Sidebar';
import AdminProfile from './components/AdminProfile';

function AppContent() {
  const [activeTab, setActiveTab] = useState('devices');
  const location = useLocation();
  const navigate = useNavigate();

  // Sync activeTab with the current route
  React.useEffect(() => {
    const path = location.pathname.slice(1) || 'devices'; // Default to 'devices' if path is '/'
    if (path !== 'profile') setActiveTab(path); // Do not override activeTab for profile page
  }, [location]);

  // Update URL when activeTab changes (e.g., via Sidebar click)
  React.useEffect(() => {
    if (activeTab !== 'profile') navigate(`/${activeTab}`);
  }, [activeTab, navigate]);

  return (
    <>
      <Header />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Routes>
        <Route path="/:tab?" element={<AdminPanel activeTab={activeTab} />} />
        <Route path="/profile" element={<AdminProfile />} />
      </Routes>
      <Footer />
    </>
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