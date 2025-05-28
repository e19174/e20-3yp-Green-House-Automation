import React from 'react';

const AdminProfile = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null; // Do not render if modal is closed

  return (
    <>
      {/* Modal backdrop */}
      <div
        onClick={onClose} // Close modal on clicking outside content
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
      />

      {/* Modal content */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#01694D',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 1001,
          width: '400px',
          maxWidth: '90%',
        }}
      >
        <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#fff' }}>
          Admin Profile
        </h2>
        <div style={{ marginBottom: '15px' }}>
          <strong>Name:</strong> <span style={{ marginLeft: '10px' }}>{user.name}</span>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Email:</strong> <span style={{ marginLeft: '10px' }}>{user.email}</span>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <strong>Contact No:</strong> <span style={{ marginLeft: '10px' }}>{user.phoneNumber}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default AdminProfile;
