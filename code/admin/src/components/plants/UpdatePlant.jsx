import React from 'react';

const UpdatePlant = ({ isOpen, onClose, onSave, user, setUser }) => {
  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({
          ...prev,
          imageData: reader.result,
          imageName: file.name,
          imageType: file.type,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />

      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>Update Plant</h2>

        <label style={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            value={user.name || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Description:
          <textarea
            name="description"
            value={user.description || ''}
            onChange={handleChange}
            style={styles.textarea}
          />
        </label>

        <label style={styles.label}>
          Temperature 🌡️:
          <input
            type="text"
            name="temperature"
            value={user.temperature || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Humidity 💧:
          <input
            type="text"
            name="humidity"
            value={user.humidity || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Moisture 🌿:
          <input
            type="text"
            name="moisture"
            value={user.moisture || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Nitrogen:
          <input
            type="text"
            name="nitrogen"
            value={user.nitrogen || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Phosphorus:
          <input
            type="text"
            name="phosphorus"
            value={user.phosphorus || ''}
            onChange={handleChange}
            style={styles.input}
          />
        </label>

        <label style={styles.label}>
          Potassium:
          <input
            type="text"
            name="potassium"
            value={user.potassium || ''}
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

        {user.imageData && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <img
              src={user.imageData}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '6px' }}
            />
          </div>
        )}

        <div style={styles.buttonRow}>
          <button onClick={onSave} style={styles.saveButton}>Save</button>
          <button onClick={onClose} style={styles.cancelButton}>Cancel</button>
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
    marginTop: '6px',
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
  },
};

export default UpdatePlant;
