import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Header from './components/Common/header/Header';
import Footer from './components/Common/footer/Footer';
import Devices from './components/Devices';
import Sidebar from './components/Common/sidebar/Sidebar';
import AdminProfile from './components/AdminProfile';
import AdminDashboard from './components/AdminDashboard';
import Users from './components/Users';

function App() {
  const [activeTab, setActiveTab] = useState('devices');
  // const location = useLocation();
  // const navigate = useNavigate();

  // // Sync activeTab with the current route
  // React.useEffect(() => {
  //   const path = location.pathname.slice(1) || 'devices'; // Default to 'devices' if path is '/'
  //   if (path !== 'profile') setActiveTab(path); // Do not override activeTab for profile page
  // }, [location]);

  // // Update URL when activeTab changes (e.g., via Sidebar click)
  // React.useEffect(() => {
  //   if (activeTab !== 'profile') navigate(`/${activeTab}`);
  // }, [activeTab, navigate]);

  return (
    <Router>
      <Header />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Routes>
        <Route path="/" element={<AdminDashboard/>} />
        <Route path="/devices" element={<Devices />} />
        <Route path="/users" element={<Users />} />
        <Route path="/profile" element={<AdminProfile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;