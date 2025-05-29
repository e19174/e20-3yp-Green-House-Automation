import React, { useState, useEffect } from 'react';

const AdminPanel = ({ activeTab }) => {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);

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
    <div style={{
      display: 'flex',
      height: 'calc(100vh - 100px)',
      width:"calc(100vw - )"
    }}>
      {/* Main Content */}
      <div style={{ marginLeft: '260px', padding: '30px 20px', flex: 1, overflowX: 'auto' }}>
        {/* Device Tab */}
        {activeTab === 'devices' && (
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

        {/* User Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ fontSize: '22px', marginBottom: '15px' }}>User Management</h2>
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
        )}

        {/* Placeholder for other tabs */}
        {activeTab === 'dashboard' && <div>Dashboard content goes here.</div>}
        {activeTab === 'settings' && <div>Settings content goes here.</div>}
      </div>
    </div>
  );
};

export default AdminPanel;