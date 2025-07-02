import React, { useState } from 'react';

const AddPlant = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    temperature: '',
    humidity: '',
    moisture: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    imageData: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageData: reader.result,
          imageName: file.name,
          imageType: file.type,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if(onSave) onSave(formData);
    onClose();
  };

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />

      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 style={styles.title}>Add New Plant</h2>

        <label style={styles.label}>
          Plant Name:
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
          />
        </label>

        <label style={styles.label}>
          Temperature 🌡️:
          <input
            name="temperature"
            type="text"
            value={formData.temperature}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Humidity 💧:
          <input
            name="humidity"
            type="text"
            value={formData.humidity}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Moisture 🌿:
          <input
            name="moisture"
            type="text"
            value={formData.moisture}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Nitrogen:
          <input
            name="nitrogen"
            type="text"
            value={formData.nitrogen}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Phosphorus:
          <input
            name="phosphorus"
            type="text"
            value={formData.phosphorus}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Potassium:
          <input
            name="potassium"
            type="text"
            value={formData.potassium}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Upload Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.input}
          />
        </label>

        {formData.imageData && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <img
              src={formData.imageData}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '6px' }}
            />
          </div>
        )}


        <div style={styles.buttonRow}>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
          <button onClick={handleSave} style={styles.saveButton}>Save</button>
        </div>
      </div>
    </>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '30px 40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    zIndex: 1000,
    width: '400px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  title: {
    marginBottom: '20px',
    color: '#2e7d32',
    fontWeight: '700',
    fontSize: '24px',
    textAlign: 'center',
  },
  label: {
    display: 'block',
    marginBottom: '12px',
    color: '#555',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    marginTop: '6px',
    borderRadius: '6px',
    border: '1.5px solid #a5d6a7',
    fontSize: '16px',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    marginTop: '5px',
    borderRadius: '6px',
    border: '1.5px solid #a5d6a7',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '20px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '25px',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    marginRight: '10px',
    transition: 'background-color 0.3s ease',
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '10px 20px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    transition: 'background-color 0.3s ease',
  },
};

export default AddPlant;
