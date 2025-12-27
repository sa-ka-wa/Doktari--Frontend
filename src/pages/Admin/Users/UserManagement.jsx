import React from "react";
import UserManagementComponent from "../../../components/admin/UserManagement/UserManagement";
import "./UserManagement.css";

const UserManagement = () => {
  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage customer accounts and permissions</p>
      </div>
      <UserManagementComponent />
    </div>
  );
};

export default UserManagement;
