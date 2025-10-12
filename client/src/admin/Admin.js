// client/src/admin/Admin.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css"; // ✅ now relative to the same folder

const ADMIN_PASSWORD = "wakiee@2025"; // 🔒 change this to your secret

export default function Admin() {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = sessionStorage.getItem("adminAuth") === "true";
    if (loggedIn) setIsAuthorized(true);
  }, []);

  const handleLogin = () => {
    if (enteredPassword === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setIsAuthorized(true);
      setError("");
    } else {
      setError("❌ Incorrect password. Try again.");
      setEnteredPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthorized(false);
    navigate("/"); // back to home
  };

  if (!isAuthorized) {
    return (
      <div className="admin-login">
        <h2>🔐 Admin Login</h2>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={enteredPassword}
          onChange={(e) => setEnteredPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-text">{error}</p>}
      </div>
    );
  }

  // ✅ Logged-in dashboard
  return (
    <div className="admin-dashboard">
      <h1>🛠️ Wakiee Admin Dashboard</h1>
      <p>Welcome, owner! You are logged in as Admin.</p>

      <div className="admin-actions">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
