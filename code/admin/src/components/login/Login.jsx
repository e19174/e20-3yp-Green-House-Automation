import React, { useEffect, useState } from 'react';
import './login.css';
import { UserAuth } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import {Axios} from '../../AxiosBuilder';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {setUser} = UserAuth();
  const navigate = useNavigate()

  useEffect(() => {
    if(localStorage.getItem("token")){
        navigate("/");
    }
  },[navigate])

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email === "" || password === ""){
        alert("enter the credentials");
        return;
    }
    try {
        const response = await Axios.post("/login", {email, password});
        setUser(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/");
    } catch (error) {
        alert(error.response?.data.message || "Login failed. Please try again.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (email === "" || password === ""){
        alert("enter the credentials");
        return;
    }

    try {
        const response = await Axios.post("/register", {email, password});
        alert(response.data.message || "Registration successful.");
    } catch (error) {
        console.log(error);
        alert(error.response?.data.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="company-name">GreenTech</h1>
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">Log In</button>
          <div className="divider"></div>
          <button type="button" onClick={handleRegister} className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
