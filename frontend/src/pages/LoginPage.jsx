import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");


    // visitor mode
    const handleVisitorMode = () => {
      navigate("/dashboard"); 
    };

    //login form submit
    const handleLogin = async (e) => {
      e.preventDefault();
  
      try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        });
  
        const data = await res.json();
  
        if (res.ok) {
          //save token (localStorage or context)
          localStorage.setItem("token", data.token);
          navigate("/dashboard");
        } else {
          setError(data.message || "Login failed");
        }
      } catch (err) {
        setError("Server error, please try again later.");
      }
    };

    return (
      <div className="login-page">
        <div className="login-bg"></div>
        <div className="nu-logo"></div>
        <div className="login-card">
          <h1 className="welcome-text">Welcome</h1>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <div className="input-container">
                <label htmlFor="username">UserName</label>
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="error-msg">{error}</p>}

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
  