import React from "react";
import LoginForm from "../../../components/auth/LoginForm/LoginForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (formData) => {
    try {
      await login(formData.email, formData.password);

      // ✅ AuthContext now has user + token
      navigate("/profile", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials, please try again.");
    }
  };

  return <LoginForm onLogin={handleLogin} />;
};

export default Login;
