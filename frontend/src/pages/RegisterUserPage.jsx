import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/RegisterUserPage.css";

const RegisterUserPage = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [registerMsg, setRegisterMsg] = useState("");
  const navigate = useNavigate();

  // Admin login state
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // New user registration state
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Check token on load
  useEffect(() => {
    if (adminToken) {
      try {
        const decoded = jwtDecode(adminToken);
        if (decoded.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setLoginError("Only admins can register new users.");
        }
      } catch (e) {
        setIsAdmin(false);
        setLoginError("Invalid token.");
      }
    }
  }, [adminToken]);

  // Handle admin login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        setAdminToken(data.token);
        setLoginError("");
      } else {
        setLoginError(data.message || "Login failed");
      }
    } catch {
      setLoginError("Server error");
    }
  };

  // Handle user registration
  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          role: "user",
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setRegisterMsg("User registered successfully!");
        setNewUsername("");
        setNewPassword("");

        //after create a new user, redirect to login page
        setTimeout(() => {
          navigate("/"); //back to login page
        }, 1500); // wait 1.5 seconds before redirecting
      } else {
        setRegisterMsg(`Error: ${data.message}`);
      }
    } catch {
      setRegisterMsg("Server error during registration.");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        {!isAdmin ? (
          <>
            <h2>Admin Login Required</h2>
            <form onSubmit={handleAdminLogin}>
              <input
                type="text"
                placeholder="Admin Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <button type="submit">Log in</button>
            </form>
            {loginError && <p>{loginError}</p>}
          </>
        ) : (
          <>
            <h2>Register New User</h2>
            <input
              type="text"
              placeholder="New Username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Register</button>
            {registerMsg && <p>{registerMsg}</p>}
          </>
        )}
      </div>
    </div>
  );  
};

export default RegisterUserPage;
