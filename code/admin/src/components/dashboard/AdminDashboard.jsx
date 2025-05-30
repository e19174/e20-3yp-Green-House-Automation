import React from 'react';
import './adminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">
        <h2 className="admin-dashboard-title">Admin Dashboard</h2>
        <p className="admin-dashboard-description">
          Welcome to the Admin Dashboard. Here you can manage devices, users, and view system statistics.
        </p>
        {/* Additional content can be added here */}
      </div>
    </div>
  );
};

export default AdminDashboard;
