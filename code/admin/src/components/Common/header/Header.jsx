import React from 'react';
import logo from "../../../assets/logopng.png"

const Header = () => (
  <header style={{
    width: "vw",
    height: '60px',
    backgroundColor: '#1b4332',
    color: 'white',
    display: 'flex',
    padding: "0 40px",
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    zIndex: 5
  }}>
    {/* Left - spacer (optional logo) */}
    <div className='header-container' style={{
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "10px"
    }}>
      <img src={logo} alt='logo'
        style={{
          width: "40px",
          height: "30px",
          objectFit: "fill"
        }} />
      <p style={{
        fontSize: "1.2rem",
        fontWeight: "bold"
      }}>
        Green-Tech
      </p>
    </div>

    {/* Center - title */}
    <div style={{
      flex: 1,
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap'
    }}>
      Greenhouse Admin Panel
    </div>

    {/* Right - admin profile */}
    <div style={{
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '10px',
      flexShrink: 0,
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#ffffff33',
        border: '2px solid #fff'
      }}></div>
      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Admin</span>
    </div>
  </header>
);

export default Header;
