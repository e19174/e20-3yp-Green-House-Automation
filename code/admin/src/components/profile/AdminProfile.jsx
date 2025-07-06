import React, { useState } from 'react';
import './adminProfile.css';
import { UserAuth } from '../../Context/UserContext';
import EditProfile from './EditProfile'; // Import the EditProfile component

const AdminProfile = () => {
  const { user } = UserAuth();
  const [showEditProfile, setShowEditProfile] = useState(false); // Manage modal visibility

  const handleEditProfileSave = async (updatedUser) => {
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
              src={ user?.profileImageData ? `data:${user?.profileImageType};base64,${user?.profileImageData}` : require('../../assets/profile_picture.webp')} // Fallback to default image if user has no profile image
              alt="Profile"
            />
          </div>
          <button className="edit-profile-button" onClick={() => setShowEditProfile(true)}>
            Edit Profile
          </button>
          <div className="admin-profile-field">
            <div className="field-label">Name</div>
            <div className="field-value">: {user?.name}</div>
          </div>
          <div className="admin-profile-field">
            <div className="field-label">Email</div>
            <div className="field-value">: {user?.email}</div>
          </div>
          <div className="admin-profile-field">
            <div className="field-label">Contact No</div>
            <div className="field-value">: {user?.phoneNumber}</div>
          </div>

          
        </div>
      </div>

      {/* Conditionally render the EditProfile modal */}
      {showEditProfile && <EditProfile onSave={handleEditProfileSave} />}
    </div>
  );
};

export default AdminProfile;
