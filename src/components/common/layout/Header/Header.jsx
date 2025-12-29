import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../../../context/AuthContext";

import "./Header.css";

const Header = ({ brand = "Prolific" }) => {
  const { user } = useContext(AuthContext);
  // Conditional branding logic
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const brandName = typeof brand === "string" ? brand : brand?.name || "";
  const isProlific = brandName.toLowerCase() === "prolific";
  const isDoktari = brandName.toLowerCase() === "doktari";

  useEffect(() => {
    const handleAuthUpdate = () => {
      console.log("🔁 Auth updated — refreshing header");
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      if (updatedUser) setCurrentUser(updatedUser);
    };

    window.addEventListener("authUpdated", handleAuthUpdate);
    return () => window.removeEventListener("authUpdated", handleAuthUpdate);
  }, []);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Map brand to its admin route
  const adminRoutes = {
    prolific: "/prolific-admin",
    doktari: "/doktari-admin",
  };
  const adminLink = adminRoutes[brandName.toLowerCase()] || "/admin";
  return (
    <header
      className={`header ${isProlific ? "prolific-header" : ""} ${
        isDoktari ? "doktari-header" : ""
      }`}
    >
      {/* Brand Logo */}
      <h1 className="logo">
        {brandName}{" "}
        <span>{isProlific ? "Artwear" : isDoktari ? "T-Shirts" : ""}</span>
      </h1>

      {/* Navigation */}
      <nav className="nav-links">
        {isProlific ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/brands">Brands</Link>
            <Link to="/artists">Artists</Link>
            <Link to="/gallery">Gallery</Link>
            <Link to="/about">About</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/brands">Brands</Link>
            <Link to="/products/catalog">Products</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </>
        )}

        {/* Auth Buttons or Profile */}
        {user ? (
          <div
            className="profile-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <img
              src={
                user.avatar_url
                  ? `http://localhost:5000${user.avatar_url}`
                  : "/default-avatar.png"
              }
              alt={user.name || "User"}
              className="profile-avatar"
            />
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile">Profile</Link>
                {["admin", "super_admin"].includes(user.role) && (
                  <Link to={adminLink}>Admin Dashboard</Link>
                )}
                <Link to="/logout">Logout</Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="action-btn">
              Login
            </Link>
            <Link to="/register" className="action-btn">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
