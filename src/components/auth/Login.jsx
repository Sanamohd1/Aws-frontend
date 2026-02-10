import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import { useNavigate, Link } from "react-router-dom";

import { PageHeader, Button } from "@primer/react";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";
import Alert from "../../Alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

   try {
  setLoading(true);

  const res = await axios.post("http://localhost:3002/login", {
    email,
    password,
  });

  console.log("=== LOGIN RESPONSE DEBUG ===");
  console.log("Full response:", res);
  console.log("Response data:", res.data);
  console.log("Token:", res.data.token);
  console.log("UserID:", res.data.userId);
  console.log("=== END DEBUG ===");

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("userId", res.data.userId);

  // ADD THIS VERIFICATION
  console.log("=== LOCALSTORAGE VERIFICATION ===");
  console.log("Saved token:", localStorage.getItem("token"));
  console.log("Saved userId:", localStorage.getItem("userId"));
  console.log("=== END VERIFICATION ===");

  setCurrentUser(res.data.userId);
  navigate("/dashboard");
} catch (err) {
  console.error("=== LOGIN ERROR DEBUG ===");
  console.error("Full error:", err);
  console.error("Error response:", err.response);
  console.error("Response data:", err.response?.data);
  console.error("Response status:", err.response?.status);
  console.error("Request data sent:", { email, password });
  console.error("=== END ERROR DEBUG ===");
  setErrorMessage("Login Failed! Please check your email or password.");
} finally {
  setLoading(false);
}};

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <PageHeader>
            <PageHeader.TitleArea variant="large">
              <PageHeader.Title>Sign In</PageHeader.Title>
            </PageHeader.TitleArea>
          </PageHeader>
        </div>

        {errorMessage && (
          <div style={{ marginBottom: "15px" }}>
            <Alert message={errorMessage} type="error" />
          </div>
        )}

        <div className="login-box">
          <div>
            <label className="label">Email address</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;