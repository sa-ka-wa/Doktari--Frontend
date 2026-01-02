import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import CartIcon from "../../CartIcon/CartIcon";
import "./Header.css";

const Header = ({ brand = "Prolific" }) => {
  const { user, logout, hasRole, hasPermission } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const brandName = typeof brand === "string" ? brand : brand?.name || "";
  const isProlific = brandName.toLowerCase() === "prolific";
  const isDoktari = brandName.toLowerCase() === "doktari";

  // Role-based navigation
  const getAdminLinks = () => {
    const links = [];

    if (hasRole(["super_admin", "admin"])) {
      links.push({ to: "/admin", label: "Admin Dashboard" });
    }

    if (hasRole(["brand_admin", "brand_staff"])) {
      links.push({ to: "/brand-admin", label: "Brand Dashboard" });
    }

    return links;
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Get role display name
  const getRoleDisplay = () => {
    if (!user) return "";
    const roleMap = {
      super_admin: "Super Admin",
      admin: "Admin",
      brand_admin: "Brand Admin",
      brand_staff: "Staff",
      customer: "Customer",
    };
    return roleMap[user.role] || user.role;
  };

  return (
    <header
      className={`header ${isProlific ? "prolific-header" : ""} ${
        isDoktari ? "doktari-header" : ""
      }`}
    >
      <div className="header-container">
        {/* Brand Logo */}
        <div className="brand-section">
          <h1 className="logo">
            <Link to="/">
              {brandName}{" "}
              <span>
                {isProlific ? "Artwear" : isDoktari ? "T-Shirts" : ""}
              </span>
            </Link>
          </h1>

          {/* Brand badge for logged-in users */}
          {user?.brand_name && (
            <span className="brand-badge">{user.brand_name}</span>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav">
          {/* Common Links */}
          <Link to="/">Home</Link>
          <Link to="/brands">Brands</Link>

          {isProlific ? (
            <>
              <Link to="/artists">Artists</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/about">About</Link>
            </>
          ) : (
            <>
              <Link to="/products/catalog">Products</Link>
              <Link to="/design">Custom Design</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </>
          )}

          {/* Role-Based Admin Links */}
          {getAdminLinks().map((link) => (
            <Link key={link.to} to={link.to} className="admin-link">
              {link.label}
            </Link>
          ))}

          {/* User Menu */}
          {user ? (
            <div
              className="profile-dropdown-container"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className="profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
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
                <span className="user-name">{user.name || "User"}</span>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="user-info-dropdown">
                    <div className="user-email">{user.email}</div>
                    <div className="user-role-badge">{getRoleDisplay()}</div>
                  </div>
                  <hr />
                  <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" onClick={() => setDropdownOpen(false)}>
                    My Orders
                  </Link>
                  {hasRole(["customer"]) && (
                    <Link to="/cart" onClick={() => setDropdownOpen(false)}>
                      Shopping Cart
                    </Link>
                  )}
                  <hr />
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="action-btn">
                Login
              </Link>
              <Link to="/register" className="action-btn register-btn">
                Register
              </Link>
            </div>
          )}

          {/* Cart Icon */}
          <div className="cart-container">
            <CartIcon />
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="nav-links mobile-nav">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/brands" onClick={() => setMobileMenuOpen(false)}>
            Brands
          </Link>

          {isProlific ? (
            <>
              <Link to="/artists" onClick={() => setMobileMenuOpen(false)}>
                Artists
              </Link>
              <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/products/catalog"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link to="/design" onClick={() => setMobileMenuOpen(false)}>
                Custom Design
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                Contact
              </Link>
            </>
          )}

          {/* Role-Based Admin Links for Mobile */}
          {getAdminLinks().map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="admin-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* User Menu for Mobile */}
          {user ? (
            <>
              <hr />
              <div className="mobile-user-info">
                <img
                  src={
                    user.avatar_url
                      ? `http://localhost:5000${user.avatar_url}`
                      : "/default-avatar.png"
                  }
                  alt={user.name || "User"}
                  className="profile-avatar-mobile"
                />
                <div>
                  <div className="user-name-mobile">{user.name}</div>
                  <div className="user-email-mobile">{user.email}</div>
                  <div className="user-role-mobile">{getRoleDisplay()}</div>
                </div>
              </div>
              <hr />
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                Profile
              </Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                My Orders
              </Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                Shopping Cart
              </Link>
              <hr />
              <button onClick={handleLogout} className="logout-btn-mobile">
                Logout
              </button>
            </>
          ) : (
            <div className="mobile-auth-buttons">
              <Link
                to="/login"
                className="action-btn mobile-action-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="action-btn register-btn mobile-action-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
