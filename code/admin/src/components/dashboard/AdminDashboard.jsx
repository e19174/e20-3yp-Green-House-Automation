import React from 'react';
import './adminDashboard.css';

const AdminDashboard = () => {
  // Example static data, replace with dynamic data if needed
  const userCount = 10;
  const deviceCount = 12;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">
        <h2 className="admin-dashboard-title">Admin Dashboard</h2>
        <div className="dashboard-cards-container">
          <div className="dashboard-card">
            <h3 className="card-title">Users Count</h3>
            <p className="card-count">{userCount}</p>
          </div>
          <div className="dashboard-card">
            <h3 className="card-title">Devices Count</h3>
            <p className="card-count">{deviceCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
