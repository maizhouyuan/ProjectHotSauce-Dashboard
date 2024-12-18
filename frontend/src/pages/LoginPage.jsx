import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

/**
 * Admin account details
 * Username: 225Terry
 */
const LoginPage = () => {
    const navigate = useNavigate();

    // navigate to DashboardPage
    const handleVisitorMode = () => {
      navigate("/dashboard"); 
    };

    return (
      <div className="login-page">
        <div className="login-bg"></div>
        <div className="nu-logo"></div>
        <div className="login-card">
          <h1 className="welcome-text">Welcome</h1>
          <form>
            <div className="input-group">
              <div className="input-container">
                <label htmlFor="username">UserName</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input-container">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <button type="submit" className="login-button">Log in</button>
          </form>
          <button onClick={handleVisitorMode} className="visitor-button">
          Visitor
        </button>
        </div>
      </div>
    );
  };
  
  export default LoginPage;
  