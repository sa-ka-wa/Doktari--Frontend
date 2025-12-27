import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../../../components/auth/ProfileForm/ProfileForm";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleUpdate = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Always redirect to user-app home after update
    navigate("/");
  };

  return (
    <div className="profile-page">
      <ProfileForm user={user} onUpdate={handleUpdate} />
      {/* Button to navigate to role-specific app */}
    </div>
  );
};

export default Profile;
