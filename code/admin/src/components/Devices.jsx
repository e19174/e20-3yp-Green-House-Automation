import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Users = ({ activeTab }) => {
  const [devices, setDevices] = useState([]);
  

  useEffect(() => {
    setDevices([
      {
        id: 1,
        mac: "00:1B:44:11:3A:B7",
        addedAt: "2024-05-20",
        zoneName: "Zone A",
        name: "Soil Sensor",
        location: "Greenhouse 1",
        user: null
      },
      {
        id: 2,
        mac: "00:1B:44:11:3A:C9",
        addedAt: "2024-05-21",
        zoneName: "Zone B",
        name: "Water Pump",
        location: "Greenhouse 2",
        user: null
      }
    ]);

    
  }, []);

  return (
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 100px)',
    }}>
      {/* Main Content */}
      <div style={{ marginLeft: '260px', padding: '30px 20px', flex: 1, overflowX: 'auto' }}>
        {/* Device Tab */}
        {activeTab !== 'devices' && (
          <div>
            <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>Device Management</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd', height: '40px' }}>
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
                  <tr key={device.id} style={{ borderBottom: '1px solid #f0f0f0', height: '50px', padding: '10px 0' }}>
                    <td>{device.id}</td>
                    <td>{device.name}</td>
                    <td>{device.mac}</td>
                    <td>{device.location}</td>
                    <td>{device.zoneName}</td>
                    <td>{device.addedAt}</td>
                    <td>{device.user?.name || 'Unassigned'}</td>
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
        )}

        

        <div>
          <Link to={"/"} >dfvsdvdfbvsdb</Link>
        </div>

        {/* Placeholder for other tabs */}
        {activeTab === 'dashboard' && <div>Dashboard content goes here.</div>}
        {activeTab === 'settings' && <div>Settings content goes here.</div>}
      </div>
    </div>
  );
};

export default Users;