import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AdminPanel from './pages/AdminPanel';
import AdminProfile from './components/AdminProfile';

function AppContent() {
  const [activeTab, setActiveTab] = useState('devices');
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const path = location.pathname.slice(1) || 'devices';
    if (path !== 'profile') setActiveTab(path);
  }, [location]);

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