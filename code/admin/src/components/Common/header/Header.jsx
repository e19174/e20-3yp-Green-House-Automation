import { UserAuth } from '../../../Context/UserContext';
import './header.css';
import profile from "../../../assets/profile_picture.webp"

const Header = () => {
  const {user} = UserAuth();
  
  return(
    <header className="header">
    <div className="header-container">
      <p className="header-brand">Green-Tech</p>
    </div>

    <div className="header-title">
      Greenhouse Admin Panel
    </div>

    <div className="header-profile">
      <img src={user?.imageData ? `data:${user.imageType};base64,${user.imageData}`: profile} alt="userImage" />
      <span className="profile-name">{user?.name}</span>
    </div>
  </header>
);
}

export default Header;
