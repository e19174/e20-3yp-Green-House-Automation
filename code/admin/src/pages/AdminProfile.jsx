import React from 'react';
import profileImage from '../assets/jega1.png'; // Replace with actual image path

const AdminProfile = () => {
  const user = {
    name: 'Jegatheesan',
    email: 'user@gmail.com',
    phoneNumber: '760832337',
  };

  return (
    <div
      style={{
        backgroundColor: '',
        minHeight: '100vh',
        color: 'white',
        paddingTop: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Header */}
      <h2 style={{ marginBottom: '40px' }}>Profile</h2>

      {/* Profile Image */}
      <img
        src={profileImage}
        alt="Admin Profile"
        style={{
          width: 130,
          height: 130,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '4px solid white',
          marginBottom: '15px',
        }}
      />

      {/* Edit Button */}
      <button
        style={{
          backgroundColor: '#fff',
          color: '#014635',
          border: 'none',
          padding: '8px 16px',
          borderRadius: 5,
          cursor: 'pointer',
          marginBottom: '30px',
          fontWeight: 'bold',
          fontSize: '14px',
        }}
      >
        Edit Profile
      </button>

      {/* Info Section */}
      <div
        style={{
          backgroundColor: '#01694D',
          width: '90%',
          maxWidth: 350,
          padding: '20px',
          borderRadius: '10px',
          boxSizing: 'border-box',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        }}
      >
        {/* Info Rows */}
        {[
          { label: 'Name', value: user.name },
          { label: 'Email', value: user.email },
          { label: 'Contact No', value: user.phoneNumber },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            <span>{label}:</span>
            <span style={{ fontWeight: '400' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProfile;
