import React, { useState, useEffect } from "react";
import { useUsers } from "../../../context/UserContext";
import { useAuth } from "../../../context/AuthContext";
import "./UserForm.css";

const UserForm = ({ user, brands, currentUser, onSuccess }) => {
  const { createUser, updateUser, loading, error } = useUsers();
  const { hasRole } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    brand_id: "",
    phone: "",
    location: "",
    preferences: {},
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
        role: user.role || "customer",
        brand_id: user.brand_id || "",
        phone: user.phone || "",
        location: user.location || "",
        preferences: user.preferences || {},
      });
    }
  }, [user]);

  // Available roles based on current user's role
  const getAvailableRoles = () => {
    const allRoles = [
      { value: "customer", label: "Customer" },
      { value: "brand_staff", label: "Brand Staff" },
      { value: "brand_admin", label: "Brand Admin" },
      { value: "admin", label: "Admin" },
      { value: "super_admin", label: "Super Admin" },
    ];

    if (hasRole(["super_admin"])) {
      return allRoles;
    } else if (hasRole(["admin"])) {
      return allRoles.filter((role) => role.value !== "super_admin");
    } else if (hasRole(["brand_admin"])) {
      return allRoles.filter((role) =>
        ["customer", "brand_staff", "brand_admin"].includes(role.value)
      );
    }

    return allRoles.filter((role) => role.value === "customer");
  };

  // Available brands for assignment
  const getAvailableBrands = () => {
    if (hasRole(["super_admin", "admin"])) {
      return brands || [];
    } else if (hasRole(["brand_admin"])) {
      return brands?.filter((brand) => brand.id === currentUser.brand_id) || [];
    }
    return [];
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!user && !formData.password) {
      errors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    // Brand is required for brand_admin and brand_staff roles
    if (
      ["brand_admin", "brand_staff"].includes(formData.role) &&
      !formData.brand_id
    ) {
      errors.brand_id = "Brand is required for this role";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        brand_id: formData.brand_id || null,
        phone: formData.phone,
        location: formData.location,
        preferences: formData.preferences,
      };

      if (formData.password && !user) {
        userData.password = formData.password;
      }

      if (user) {
        await updateUser(user.id, userData);
      } else {
        await createUser(userData);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="name">
            Full Name <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={formErrors.name ? "error" : ""}
            disabled={loading}
          />
          {formErrors.name && (
            <span className="error-message">{formErrors.name}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={formErrors.email ? "error" : ""}
            disabled={loading || user} // Can't change email for existing users
          />
          {formErrors.email && (
            <span className="error-message">{formErrors.email}</span>
          )}
        </div>

        {!user && (
          <>
            <div className="form-group">
              <label htmlFor="password">
                Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={formErrors.password ? "error" : ""}
                disabled={loading}
              />
              {formErrors.password && (
                <span className="error-message">{formErrors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password <span className="required">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={formErrors.confirmPassword ? "error" : ""}
                disabled={loading}
              />
              {formErrors.confirmPassword && (
                <span className="error-message">
                  {formErrors.confirmPassword}
                </span>
              )}
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="role">
            Role <span className="required">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={formErrors.role ? "error" : ""}
            disabled={loading}
          >
            <option value="">Select a role</option>
            {getAvailableRoles().map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
          {formErrors.role && (
            <span className="error-message">{formErrors.role}</span>
          )}
        </div>

        {(formData.role === "brand_admin" ||
          formData.role === "brand_staff") && (
          <div className="form-group">
            <label htmlFor="brand_id">
              Brand <span className="required">*</span>
            </label>
            <select
              id="brand_id"
              name="brand_id"
              value={formData.brand_id}
              onChange={handleChange}
              className={formErrors.brand_id ? "error" : ""}
              disabled={loading}
            >
              <option value="">Select a brand</option>
              {getAvailableBrands().map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {formErrors.brand_id && (
              <span className="error-message">{formErrors.brand_id}</span>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={loading}
            placeholder="City, Country"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : user ? "Update User" : "Create User"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onSuccess}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
