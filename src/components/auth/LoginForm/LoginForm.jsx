import React, { useState } from "react";
import "./LoginForm.css";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import Modal from "../../common/Modal/Modal";
import { Link } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onLogin(formData);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("🔗 Redirecting to Google login...");
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const url = apiBase.startsWith("http")
      ? `${apiBase}/auth/google`
      : `http://localhost:5000${apiBase}/auth/google`;
    window.location.href = url;
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>JENGA Street</h1>
          <p>Feel the vibe. Sign in to your flow.</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <Modal onClose={() => setError("")}>
              <p>{error}</p>
            </Modal>
          )}

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="small" /> : "Sign In"}
          </Button>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Sign in with Google
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don’t have an account?{" "}
            <Link to="/register" className="link">
              Create one here
            </Link>
          </p>
        </div>

        <div className="demo-credentials">
          <p>
            <strong>Demo Credentials:</strong>
          </p>
          <p>Email: demo@example.com</p>
          <p>Password: any password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
