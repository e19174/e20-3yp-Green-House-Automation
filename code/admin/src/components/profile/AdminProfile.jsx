import React from 'react';
import './adminProfile.css';
import { UserAuth } from '../../Context/UserContext';

const AdminProfile = () => {
  const {user} = UserAuth();

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-content">
        <h2 className="admin-profile-title">Admin Profile</h2>
        <div className="admin-profile-card">
          <div className="admin-profile-field">
            <span className="field-label">Name</span>
            <span className="field-value">: {user?.name}</span>
          </div>
          <div className="admin-profile-field">
            <span className="field-label">Email</span>
            <span className="field-value">: {user?.email}</span>
          </div>
          <div className="admin-profile-field">
            <span className="field-label">Contact No</span>
            <span className="field-value">: {user?.phoneNumber}</span>
          </div>
          <button className="edit-profile-button">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
