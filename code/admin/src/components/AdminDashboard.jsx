import React from 'react'

const AdminDashboard = () => {
  return (
    <div
      style={
        {
          height: 'calc(100vh - 100px)',
          width: "calc(100vw - 260px)",
          marginLeft: 'auto',
        }
      }
    >AdminDashboard
      <div style={{ flex: 1, padding: '30px 20px', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '15px', color: '#1b4332' }}>Admin Dashboard</h2>
        <p>Welcome to the Admin Dashboard. Here you can manage devices, users, and view system statistics.</p>
        {/* Additional content can be added here */}
      </div>
    </div>
  )
}

export default AdminDashboard