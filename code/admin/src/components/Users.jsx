import React, { useState, useEffect } from 'react';
import AddUser from './AddUser'; // Import AddUser modal
import { Link } from 'react-router-dom';

const Users = ({ activeTab }) => {
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const handleAddUserClick = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleSaveUser = (userDetails) => {
    // Logic to save the user
    setUsers((prevUsers) => [...prevUsers, userDetails]);
  };

  useEffect(() => {
    setUsers([
      {
        id: 2,
        name: "Technician 1",
        email: "tech1@green.com",
        phoneNumber: 1234567890,
        role: "TECHNICIAN",
        createdAt: "2024-04-01T12:30:00Z"
      },
      {
        id: 3,
        name: "Admin",
        email: "admin@green.com",
        phoneNumber: 9876543210,
        role: "ADMIN",
        createdAt: "2024-01-10T09:00:00Z"
      }
    ]);
  }, []);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)' }}>
      {/* Main Content */}
      <div style={{ marginLeft: '260px', padding: '30px 20px', flex: 1, overflowX: 'auto' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>User Management</h2>
        
        <button
          onClick={handleAddUserClick}
          style={{
            backgroundColor: 'darksalmon',
            color: '#fff',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px',
          }}
        >
          Add User
        </button>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd', height: '40px' }}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0', height: '50px', padding: '10px 0' }}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button style={{ backgroundColor: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      <AddUser
        isOpen={isAddUserModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default Users;
