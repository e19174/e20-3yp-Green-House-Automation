import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div style={{
      width: '220px',
      background: 'linear-gradient(to bottom, #1b4332, #14532d)',
      color: 'white',
      padding: '20px',
      height: 'calc(100vh - 100px)',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.3)',
      position: 'fixed',
      left: 0,
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '30px', fontSize: '20px', fontWeight: 'bold' }}>
        🌿 Admin Menu
      </div>
      <div 
        style={{ opacity: 0.8, marginBottom: '20px', cursor: 'pointer', fontWeight: activeTab === 'dashboard' ? 'bold' : 'normal' }}
        onClick={() => handleTabClick('dashboard')}
      >
        Dashboard
      </div>
      <div 
        style={{ opacity: 0.8, marginBottom: '20px', cursor: 'pointer', fontWeight: activeTab === 'devices' ? 'bold' : 'normal' }}
        onClick={() => handleTabClick('devices')}
      >
        Devices
      </div>
      <div 
        style={{ opacity: 0.8, marginBottom: '20px', cursor: 'pointer', fontWeight: activeTab === 'users' ? 'bold' : 'normal' }}
        onClick={() => handleTabClick('users')}
      >
        Users
      </div>
      <div 
        style={{ opacity: 0.8, marginBottom: '20px', cursor: 'pointer', fontWeight: activeTab === 'settings' ? 'bold' : 'normal' }}
        onClick={() => handleTabClick('settings')}
      >
        Settings
      </div>
    </div>
  );
};

export default Sidebar;