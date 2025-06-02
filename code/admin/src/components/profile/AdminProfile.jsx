import React, { useState } from 'react';
import './adminProfile.css';
import { UserAuth } from '../../Context/UserContext';
import EditProfile from './EditProfile'; // Import the EditProfile component

const AdminProfile = () => {
  const { user } = UserAuth();
  const [showEditProfile, setShowEditProfile] = useState(false); // Manage modal visibility

  const handleEditProfileSave = (updatedUser) => {
    // Logic to update user profile (could be API call or local update)
    console.log(updatedUser);
    setShowEditProfile(false); // Close modal after saving
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-content">
        <div className="admin-profile-card">
          <h2 className="admin-profile-title">Admin Profile</h2>
          <div className="admin-profile-image">
            <img
              src={user?.profileImage || require('../../assets/profile_picture.webp')} // Fallback to default image if user has no profile image
              alt="Profile"
            />
          </div>
          <button className="edit-profile-button" onClick={() => setShowEditProfile(true)}>
            Edit Profile
          </button>
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

          
        </div>
      </div>

      {/* Conditionally render the EditProfile modal */}
      {showEditProfile && <EditProfile user={user} onSave={handleEditProfileSave} />}
    </div>
  );
};

export default AdminProfile;
