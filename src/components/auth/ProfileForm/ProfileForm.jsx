import React, { useState, useEffect, useRef } from "react";
import "./ProfileForm.css";

// Helper function to get full image URL safely
const getImageUrl = (imagePath, type = "avatar") => {
  // If we have a valid backend image URL
  if (imagePath && imagePath.startsWith("/")) {
    return `http://localhost:5000${imagePath}`;
  }
  if (imagePath && imagePath.startsWith("http")) {
    return imagePath;
  }

  // Safe inline placeholder SVG for avatar or banner
  if (type === "avatar") {
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZGRkZCIvPjwvc3ZnPg==";
  } else {
    // banner
    return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2NlY2VlY2UiLz48L3N2Zz4=";
  }
};

const ProfileForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    brand_name: user?.brand_name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    phone: user?.phone || "",
    preferences: user?.preferences || {},
  });

  const [bannerImage, setBannerImage] = useState(user?.banner_url || "");
  const [avatarImage, setAvatarImage] = useState(user?.avatar_url || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  useEffect(() => {
    console.log("🔄 User prop updated:", user);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
      brand_name: user?.brand_name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      phone: user?.phone || "",
      preferences: user?.preferences || {},
    });
    setBannerImage(user?.banner_url || "");
    setAvatarImage(user?.avatar_url || "");
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`📝 Field changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file, type) => {
    if (!file) return;

    try {
      setIsLoading(true);
      console.log(`🖼️ Starting ${type} upload...`);

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);

      const res = await fetch(
        `http://localhost:5000/api/users/${user.id}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      console.log(`📥 ${type} upload response status:`, res.status);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to upload image: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log(`✅ ${type} upload successful:`, data);

      if (type === "avatar") {
        setAvatarImage(data.imageUrl);
        console.log("🔄 Avatar image state updated to:", data.imageUrl);
      } else {
        setBannerImage(data.imageUrl);
        console.log("🔄 Banner image state updated to:", data.imageUrl);
      }

      alert("✅ Image uploaded successfully");
    } catch (err) {
      console.error("❌ Image upload error:", err);
      alert(`❌ Error uploading image: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    console.log("👆 Avatar click - opening file picker");
    fileInputRef.current?.click();
  };

  const handleBannerClick = () => {
    console.log("👆 Banner click - opening file picker");
    bannerInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log("📁 Avatar file selected:", file?.name);
    if (file) {
      handleImageUpload(file, "avatar");
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    console.log("📁 Banner file selected:", file?.name);
    if (file) {
      handleImageUpload(file, "banner");
    }
  };

  const handleCancel = () => {
    console.log("❌ Cancel button clicked - resetting form");
    // Reset form data to original user data
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
      brand_name: user?.brand_name || "",
      bio: user?.bio || "",
      location: user?.location || "",
      website: user?.website || "",
      phone: user?.phone || "",
      preferences: user?.preferences || {},
    });
    setBannerImage(user?.banner_url || "");
    setAvatarImage(user?.avatar_url || "");
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔄 Form submission started");
    setIsLoading(true);

    // // Enhanced change detection with detailed logging
    // const hasFormChanges = Object.keys(formData).some(
    //   (key) => formData[key] !== (user[key] ?? "")
    // );

    // const hasImageChanges =
    //   avatarImage !== user?.avatar_url || bannerImage !== user?.banner_url;

    // console.log("📊 Changes analysis:", {
    //   hasFormChanges,
    //   hasImageChanges,
    //   avatarImage,
    //   originalAvatar: user?.avatar_url,
    //   bannerImage,
    //   originalBanner: user?.banner_url,
    // });

    // if (!hasFormChanges && !hasImageChanges) {
    //   console.log("⚠️ No changes detected - cancelling update");
    //   alert("⚠️ No changes detected to update");
    //   setIsEditing(false);
    //   return;
    // }

    // console.log("✅ Changes detected - proceeding with update");
    // setIsLoading(true);
    // console.log("🚀 Sending update request...");

    try {
      const token = localStorage.getItem("token");
      const updateData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        phone: formData.phone,
        preferences: formData.preferences,
        avatar_url: avatarImage,
        banner_url: bannerImage,
      };

      console.log("📤 Sending update data:", updateData);

      const res = await fetch(`http://localhost:5000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      console.log("📥 Update response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Server error response:", errorText);
        throw new Error(`Failed to update profile: ${res.status} ${errorText}`);
      }

      const updatedUser = await res.json();
      console.log("✅ Update successful, received:", updatedUser);

      onUpdate(updatedUser);
      setIsEditing(false);
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert(`❌ Error updating profile: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-avatar.png";
    if (imagePath.startsWith("http")) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  // Helper to display field value or placeholder
  const displayValue = (value, placeholder = "Not provided") => {
    return value && value.trim() !== "" ? value : placeholder;
  };
  const goToRoleApp = () => {
    if (!user) return;
    const role = user.role.toLowerCase().trim(); // normalize
    const token = localStorage.getItem("token");
    let url = "";

    switch (user.role) {
      case "admin":
        url = "http://localhost:3001";
        break;
      case "prolific":
        url = "http://localhost:3004";
        break;
      case "doktari":
        url = "http://localhost:3003";
        break;
      default:
        alert("No app for your role");
        return;
    }

    // Append token as query param so the new tab can read it
    if (token) url += `?token=${token}`;

    // Open the role-specific app in a new tab
    window.open(url, "_blank");
  };

  return (
    <div className="profile-form">
      {/* Banner Section */}
      <div className="banner-section">
        <div
          className="banner-image"
          style={{
            backgroundImage: `url(${getImageUrl(bannerImage)})`,
            cursor: isEditing ? "pointer" : "default",
          }}
          onClick={isEditing ? handleBannerClick : undefined}
        >
          {isEditing && (
            <div className="banner-overlay">
              <span>Click to change banner</span>
            </div>
          )}
          <input
            type="file"
            ref={bannerInputRef}
            onChange={handleBannerChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>

        {/* Avatar Section */}
        <div className="avatar-section">
          <div
            className="avatar-container"
            style={{ cursor: isEditing ? "pointer" : "default" }}
            onClick={isEditing ? handleAvatarClick : undefined}
          >
            <img
              src={getImageUrl(avatarImage, "avatar")}
              alt="Profile Avatar"
              className="avatar-image"
              onError={(e) => {
                console.log("❌ Image load error, using placeholder");
                // Replace with safe placeholder that will never 404
                e.target.onerror = null; // stop looping
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZGRkZCIvPjwvc3ZnPg==";
              }}
            />
            {isEditing && (
              <div className="avatar-overlay">
                <span>Change</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: "none" }}
          />

          <div className="user-basic-info">
            <h1>{displayValue(formData.name, "No Name")}</h1>
            <p className="user-role">
              {displayValue(formData.role, "No Role")}
            </p>
            {formData.brand_name && (
              <p className="user-brand">@{formData.brand_name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Profile Information - Only show when NOT editing */}
      {!isEditing && (
        <div className="profile-details">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="info-grid">
              <div className="info-group">
                <label>Full Name</label>
                <div className="info-value">{displayValue(formData.name)}</div>
              </div>

              <div className="info-group">
                <label>Email Address</label>
                <div className="info-value">{displayValue(formData.email)}</div>
              </div>

              <div className="info-group">
                <label>Phone Number</label>
                <div className="info-value">{displayValue(formData.phone)}</div>
              </div>

              <div className="info-group">
                <label>Location</label>
                <div className="info-value">
                  {displayValue(formData.location)}
                </div>
              </div>

              <div className="info-group full-width">
                <label>Website</label>
                <div className="info-value">
                  {formData.website && formData.website.trim() !== "" ? (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formData.website}
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </div>
              </div>

              <div className="info-group full-width">
                <label>Bio</label>
                <div className="info-value bio-text">
                  {displayValue(formData.bio)}
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Account Information</h3>
            <div className="info-grid">
              <div className="info-group">
                <label>Role</label>
                <div className="info-value">
                  {displayValue(formData.role)}
                  <button
                    type="button"
                    onClick={goToRoleApp}
                    style={{
                      marginLeft: "8px",
                      padding: "2px 6px",
                      cursor: "pointer",
                    }}
                  >
                    Go
                  </button>
                </div>
              </div>

              <div className="info-group">
                <label>Brand</label>
                <div className="info-value">
                  {displayValue(formData.brand_name)}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <div className="form-actions">
            <button
              type="button"
              className="edit-btn"
              onClick={() => {
                console.log("✏️ Edit Profile button clicked");
                setIsEditing(true);
              }}
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}

      {/* Edit Form - Only show when editing */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h3>Edit Basic Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Website</label>
              <input
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
