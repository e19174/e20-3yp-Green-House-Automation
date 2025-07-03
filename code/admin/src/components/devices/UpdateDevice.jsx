import React from 'react';

const UpdateDevice = ({ isOpen, onClose, onSave, device, setDevice }) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevice((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
        <h2 style={{ marginBottom: '15px', textAlign: 'center' }}>Update Device</h2>

        <div style={{ marginBottom: '15px' }}>
          <strong>Name:</strong>
          <input
            type="text"
            name="name"
            value={device?.name || ''}
            onChange={handleChange}
            style={{ marginLeft: '2px', padding: '8px 5px', width: '95%', borderRadius: '5px', border: '1px solid #aaa' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Location:</strong>
          <input
            type="text"
            name="location"
            value={device?.location || ''}
            onChange={handleChange}
            style={{ marginLeft: '2px',  padding: '8px 5px', width: '95%', borderRadius: '5px', border: '1px solid #aaa' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <strong>Zone:</strong>
          <input
            type="text"
            name="zoneName"
            value={device?.zoneName || ''}
            onChange={handleChange}
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

export default UpdateDevice;
