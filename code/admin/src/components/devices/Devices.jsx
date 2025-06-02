import React, { useState, useEffect } from 'react';
import './devices.css';
import { Axios } from '../../AxiosBuilder';
import UpdateDevice from './UpdateDevice';  // Import the UpdateDevice modal component
  // Import the UpdateDevice modal component

const Device = ({ activeTab }) => {
  const [devices, setDevices] = useState([]);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [deviceToEdit, setDeviceToEdit] = useState({}); // Store the device to be edited

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await Axios.get("/getAllDevices");
        setDevices(response.data);
      } catch (error) {
        console.log(error);
        if (error.response?.data?.message) {
          alert(error.response.data.message);
        }
      }
    };
    fetchDevices();
  }, []);

  // Function to delete the device
  const handleDelete = async (id) => {
    try {
      const response = await Axios.delete(`/deleteDevice/${id}`);
      setDevices(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Opens the modal and sets the device data to be edited
  const handleEdit = (device) => {
    setDeviceToEdit(device);  // Set the device to be edited
    setIsAddDeviceModalOpen(true); // Open the modal
  };

  // Handle saving the edited device data
  const handleSave = async () => {
    try {
      const response = await Axios.put(`/updateDevice/${deviceToEdit.id}`, deviceToEdit);
      setDevices(response.data);  // Update the devices list after successful update
      setIsAddDeviceModalOpen(false);  // Close the modal after saving
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="device-container">
      <div className="device-content">
        
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
                {devices.map((device) => (
                  <tr key={device.id}>
                    <td>{device?.id}</td>
                    <td>{device?.name}</td>
                    <td>{device?.mac}</td>
                    <td>{device?.location}</td>
                    <td>{device?.zoneName}</td>
                    <td>{device?.addedAt}</td>
                    <td>{device?.user?.name || 'Unassigned'}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(device)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDelete(device.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
      </div>

      {/* Show the modal for updating device details */}
      <UpdateDevice
        isOpen={isAddDeviceModalOpen}
        onClose={() => setIsAddDeviceModalOpen(false)}
        onSave={handleSave}
        device={deviceToEdit}
        setDevice={setDeviceToEdit}
      />
    </div>
  );
};

export default Device;
