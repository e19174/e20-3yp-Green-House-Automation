import React, { useState, useEffect } from 'react';
import AddUser from './AddUser'; // Adjust path if needed
import './users.css';
import { Axios } from '../../AxiosBuilder';

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
    setUsers((prevUsers) => [...prevUsers, userDetails]);
  };

 useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get("/getAllUsers");
        setUsers(response.data);
      } catch (error) {
        console.log(error);
        if(error.response.data.message){
          alert("error.response.data.message");
        }
      }
    } 
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-main-content">
        <h2 className="users-header">User Management</h2>

        <button onClick={handleAddUserClick} className="add-user-btn">
          Add User
        </button>

        <table className="users-table">
          <thead>
            <tr>
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
              <tr key={user.id}>
                <td>{user?.id}</td>
                <td>{user?.name}</td>
                <td>{user?.email}</td>
                <td>{user?.phoneNumber}</td>
                <td>{user?.role}</td>
                <td>{new Date(user?.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUser
        isOpen={isAddUserModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default Users;
