// src/Layout.jsx
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div>
      <Header />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ padding: '30px 20px', height: 'calc(100vh - 100px)' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
