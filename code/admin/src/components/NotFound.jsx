import React from 'react'

function NotFound() {
  return (
    <div style={{
        display: 'flex',
        height: 'calc(100vh - 90px)',
        width: 'calc(100vw - 240px)',
        marginLeft: '240px',
        backgroundColor: 'white',
        borderRadius: '15px 0 0 15px',
        justifyContent:"center",
        alignItems: "center"
    }}>
        <div style={{
            fontSize: "30px",
            fontWeight: "bold"
        }}>
            Page Not Found!!!
        </div>
    </div>
  )
}

export default NotFound