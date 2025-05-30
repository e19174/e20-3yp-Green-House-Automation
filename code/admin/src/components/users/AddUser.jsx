import React, { useState } from 'react';

const AddUser = ({ isOpen, onClose, onSave }) => {
  // Ensure the useState is not inside any conditional block
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phoneNumber: '',
  });

  // Don't return early before hooks, always call them first
  if (!isOpen) return null; // The modal won't open unless isOpen is true

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(userDetails);
    onClose(); // Close the modal after saving
  };

  return (
    <>
      {/* Modal backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
      ></div>

      {/* Modal content */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#01694D',
          color: 'white',
          padding: '40px',
          borderRadius: '25px',
          zIndex: 1001,
          width: '400px',
          maxWidth: '90%',
        }}
      >
        <h2 style={{ marginBottom: '15px', textAlign:'center' }}>Add User</h2>

        {/* Name input */}
        <div style={{ marginBottom: '15px' }}>
          <strong>Name:</strong>
          <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleChange}
            style={{ marginLeft: '2px', padding: '5px', width: '95%' }}
          />
        </div>

        {/* Email input */}
        <div style={{ marginBottom: '15px' }}>
          <strong>Email:</strong>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleChange}
            style={{ marginLeft: '2px', padding: '5px', width: '95%' }}
          />
        </div>

        {/* Phone number input */}
        <div style={{ marginBottom: '15px' }}>
          <strong>Contact No:</strong>
          <input
            type="text"
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleChange}
            style={{ marginLeft: '2px', padding: '5px', width: '95%' }}
          />
        </div>

        {/* Buttons */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: '#4559fd',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#e74c3c',
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
      </div>
    </>
  );
};

export default AddUser;
