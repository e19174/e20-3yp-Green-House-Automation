import React, { useState, useEffect } from 'react';
import './devices.css';
import { Axios } from '../../AxiosBuilder';

const Device = ({ activeTab }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await Axios.get("/getAllDevices");
        setDevices(response.data);
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
    <div className="device-container">
      <div className="device-content">
        {activeTab !== 'devices' && (
          <div>
            <h2 className="device-heading">Device Management</h2>
            <table className="device-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>MAC</th>
                  <th>Location</th>
                  <th>Zone</th>
                  <th>Added At</th>
                  <th>User</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(device => (
                  <tr key={device.id}>
                    <td>{device?.id}</td>
                    <td>{device?.name}</td>
                    <td>{device?.mac}</td>
                    <td>{device?.location}</td>
                    <td>{device?.zoneName}</td>
                    <td>{device?.addedAt}</td>
                    <td>{device?.user?.name || 'Unassigned'}</td>
                    <td>
                      <button className="edit-button">Edit</button>
                      <button className="delete-button">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'dashboard' && <div>Dashboard content goes here.</div>}
        {activeTab === 'settings' && <div>Settings content goes here.</div>}
      </div>
    </div>
  );
};

export default Device;
