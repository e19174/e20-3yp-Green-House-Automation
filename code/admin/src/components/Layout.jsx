import Header from './Common/header/Header';
import Footer from './Common/footer/Footer';
import Sidebar from './Common/sidebar/Sidebar';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <>
      <Header />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
