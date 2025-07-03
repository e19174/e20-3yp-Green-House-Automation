import React from 'react';

const DeletePlant = ({ isOpen, onClose, onDelete, plant }) => {
  if (!isOpen || !plant) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>Delete Plant</h3>
        <p style={styles.text}>Are you sure you want to delete <strong>{plant.name}</strong>?</p>

        <div style={styles.buttonRow}>
          <button style={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button
            style={styles.deleteButton}
            onClick={() => {
              onDelete(plant.id);
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px 20px',
    borderRadius: '10px',
    width: '350px',
    boxShadow: '0 0 12px rgba(0,0,0,0.2)',
    textAlign: 'center'
  },
  title: {
    fontSize: '22px',
    color: '#2e7d32',
    marginBottom: '10px',
    marginTop: '5px',
  },
  text: {
    fontSize: '16px',
    marginBottom: '20px',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '4px'
  },
  cancelButton: {
    backgroundColor: '#ccc',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default DeletePlant;
