import React, { useState, useEffect } from 'react';

const UpdateUser = ({ isOpen, onClose, onSave, user, setUser }) => {

  if (!isOpen) return null;

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    let phoneNumber = null;
    if (name === "phoneNumber") {
      phoneNumber = Number(value);
      setUser((prevState) => ({
        ...prevState,
        [name]: phoneNumber,
      }));
    } else {
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };


  return (
    <>
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

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#e6f0ea',
          color: '#40916c',
          padding: '40px',
          borderRadius: '25px',
          zIndex: 1001,
          width: '400px',
          maxWidth: '90%',
        }}
      >
        <h2 style={{ marginBottom: '15px', textAlign:'center' }}>Update User</h2>

        <div style={{ marginBottom: '15px' }}>
          <strong>Name:</strong>
          <input
            type="text"
            name="name"
            value={user?.name}
            onChange={(e) => handleChange(e)}
            style={{ marginLeft: '2px',  padding: '8px 5px', width: '95%', borderRadius: '5px', border: '1px solid #aaa' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Contact No:</strong>
          <input
            type="number"
            name="phoneNumber"
            value={user?.phoneNumber}
            onChange={(e) => handleChange(e)}
            style={{ marginLeft: '2px',  padding: '8px 5px', width: '95%', borderRadius: '5px', border: '1px solid #aaa' }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onSave}
            style={{
              backgroundColor: 'hsl(136, 63%, 25%)',
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

export default UpdateUser;
