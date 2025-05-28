import React, { useState } from 'react';
import logo from "../assets/logopng.png";
import AdminProfile from './AdminProfile';  // Your modal version of AdminProfile

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  const handleCloseModal = () => {
    setIsProfileOpen(false);
  };

  const adminUser = {
    name: "Admin",
    email: "admin@green.com",
    phoneNumber: 9876543210,
  };

  return (
    <>
      <header
        style={{
          width: "100vw",
          height: '60px',
          backgroundColor: '#1b4332',
          color: 'white',
          display: 'flex',
          padding: "0 40px",
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
          zIndex: 5,
        }}
      >
        {/* Left - logo */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src={logo}
            alt='logo'
            style={{
              width: "40px",
              height: "30px",
              objectFit: "fill",
            }}
          />
          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Green-Tech
          </p>
        </div>

        {/* Center - title */}
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          Greenhouse Admin Panel
        </div>

        {/* Right - admin profile */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            cursor: 'pointer',
          }}
          onClick={handleProfileClick}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#ffffff33',
              border: '2px solid #fff',
            }}
          ></div>
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Admin</span>
        </div>
      </header>

      {/* Admin Profile Modal */}
      <AdminProfile
        isOpen={isProfileOpen}
        onClose={handleCloseModal}
        user={adminUser}
      />
    </>
  );
};

export default Header;
