import React, { useState } from 'react';
import './editProfile.css';

const EditProfile = ({ user, onSave }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [contactNo, setContactNo] = useState(user?.phoneNumber || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  const handleSave = () => {
    // Handle the save functionality, passing the updated data back
    onSave({ name, email, contactNo, profileImage });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Update the profile image preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="edit-profile-modal">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <div className="edit-profile-image-container">
          <h2>Edit Profile</h2>
            <img
              src={profileImage || require('../../assets/profile_picture.webp')}
              alt="Profile"
              className="edit-profile-image"
              onClick={() => document.getElementById('image-upload').click()} // Trigger file input on image click
            />
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }} // Hide file input
            />
            
          </div>
          
        </div>

        <div className="edit-profile-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="edit-profile-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="edit-profile-field">
          <label>Contact No</label>
          <input
            type="text"
            value={contactNo}
            onChange={(e) => setContactNo(e.target.value)}
          />
        </div>

        <div className="edit-profile-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={() => window.location.reload()}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
