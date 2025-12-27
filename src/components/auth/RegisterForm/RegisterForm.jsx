import React, { useState } from "react";
import "./RegisterForm.css";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import LoadingSpinner from "../../common/LoadingSpinner/LoadingSpinner";
import Modal from "../../common/Modal/Modal";
import { Link } from "react-router-dom";

const RegisterForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Function to get brand_id based on current URL
  const getBrandId = () => {
    // For localhost development, use brand_id 1 (your default brand)
    // In production, you might want to detect from subdomain
    const hostname = window.location.hostname;

    if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
      return 1; // Your default brand ID for development
    }

    // For production with subdomains, you could map subdomains to brand IDs
    // For now, return default
    return 1;
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const brandId = getBrandId();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      // ✅ Capture backend response
      const res = await onRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "customer",
      });

      // ✅ Store token in localStorage
      if (res?.access_token) {
        localStorage.setItem("token", res.access_token);
      }
      if (res?.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
      }

      setSuccess("Account created successfully! Redirecting...");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      // ✅ Navigate to profile (optional)
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    console.log("🔗 Redirecting to Google signup...");
    window.location.href = "http://localhost:5000/api/auth/google"; // adjust backend route
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Join JENGA Street</h1>
          <p>Create your account and start your flow.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && (
            <Modal onClose={() => setError("")}>
              <p>{error}</p>
            </Modal>
          )}
          {success && (
            <Modal onClose={() => setSuccess("")}>
              <p>{success}</p>
            </Modal>
          )}

          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

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

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? <LoadingSpinner size="small" /> : "Create Account"}
          </Button>

          <button
            type="button"
            className="google-btn"
            onClick={handleGoogleRegister}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
            />
            Sign up with Google
          </button>
        </form>

        <div className="register-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
