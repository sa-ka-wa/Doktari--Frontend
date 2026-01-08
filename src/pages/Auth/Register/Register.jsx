import React from "react";
import RegisterForm from "../../../components/auth/RegisterForm/RegisterForm";
import authService from "../../../services/api/authService"; // ✅ handle API logic here
import { useNavigate } from "react-router-dom";
import "../../../components/auth/RegisterForm/RegisterForm.css";
import { useBrand } from "../../../context/BrandContext";
import { useAuth } from "../../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { brand } = useBrand();
  const { login } = useAuth();
  const handleRegister = async (formData) => {
    if (!brand?.id) {
      alert(
        "Brand not detected. Please check your subdomain or refresh the page."
      );
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      brand_id: brand.id,
      role: "customer",
    };

    try {
      const res = await authService.register(payload);
      console.log("Registered user:", res);
      if (res.user && res.token) {
        login(res.user, res.token);
        navigate("/profile");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      console.error("Response data:", err.response?.data);
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed."
      );
    }
  };

  // const handleRegister = async (formData) => {
  //   try {
  //     // ✅ include brand_id in payload
  //     const payload = {
  //       ...formData,
  //       brand_id: brand?.id,
  //       role: "customer", // default role for registration
  //     };
  //     console.log("📦 Sending registration data:", payload);
  //     // ✅ Call your backend service
  //     const res = await authService.register(payload);

  //     // ✅ Check what the backend returned
  //     if (res?.access_token) {
  //       localStorage.setItem("token", res.access_token);
  //     }
  //     if (res?.user) {
  //       localStorage.setItem("user", JSON.stringify(res.user));
  //     }

  //     // ✅ Option 1: Go straight to profile
  //     // navigate("/profile");

  //     // ✅ Option 2 (optional): Redirect to login
  //     navigate("/login");
  //   } catch (err) {
  //     console.error("Registration failed:", err);
  //     alert(
  //       err.response?.data?.message || "Registration failed. Please try again."
  //     );
  //   }
  // };

  return (
    <div className="register-page">
      {/* Pass the handler down to the form */}
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
};

export default Register;
