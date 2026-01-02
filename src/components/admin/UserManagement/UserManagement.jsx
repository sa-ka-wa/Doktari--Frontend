import React, { useState, useEffect } from "react";
import { useUsers } from "../../../context/UserContext";
import { useAuth } from "../../../context/AuthContext";
import { useBrand } from "../../../context/BrandContext"; // Changed to useBrand (singular)
import UserForm from "../../auth/UserForm/UserForm";
import UserDetails from "./UserDetails";
import SearchBar from "../../common/SearchBar/SearchBar";
import Modal from "../../../components/common/Modal/Modal";
import Card from "../../../components/common/Card/Card";
import LoadingSpinner from "../../../components/common/LoadingSpinner/LoadingSpinner";
import "./UserManagement.css";

const UserManagement = () => {
  const {
    users,
    loading: usersLoading,
    error,
    fetchUsers,
    deleteUser,
    updateUserRole,
  } = useUsers();
  const { user: currentUser, hasRole, hasPermission } = useAuth();

  // This gets the current brand context
  const { brand: currentBrand } = useBrand();

  // For getting ALL brands, we'll use a different approach
  const [allBrands, setAllBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    byRole: {},
    byBrand: {},
  });

  // Function to fetch all brands
  const fetchAllBrands = async () => {
    try {
      setBrandsLoading(true);
      // You'll need to import brandService or use an API call
      const response = await fetch("http://localhost:5000/api/brands");
      const data = await response.json();
      setAllBrands(data.brands || data || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    } finally {
      setBrandsLoading(false);
    }
  };

  const loading = usersLoading || brandsLoading;

  useEffect(() => {
    fetchUsers();
    fetchAllBrands();
  }, [fetchUsers]);

  useEffect(() => {
    if (users.length > 0) {
      const statsData = {
        total: users.length,
        byRole: {},
        byBrand: {},
      };

      users.forEach((user) => {
        // Count by role
        statsData.byRole[user.role] = (statsData.byRole[user.role] || 0) + 1;

        // Count by brand
        const brandName = user.brand_name || "No Brand";
        statsData.byBrand[brandName] = (statsData.byBrand[brandName] || 0) + 1;
      });

      setStats(statsData);
    }
  }, [users]);

  // Check permissions
  const canCreateUser = hasPermission("manage_users");
  const canEditUser = (user) => {
    if (hasRole(["super_admin"])) return true;
    if (hasRole(["admin"]) && user.role !== "super_admin") return true;
    if (hasRole(["brand_admin"]) && user.brand_id === currentUser.brand_id)
      return true;
    return false;
  };

  const canDeleteUser = (user) => {
    if (!hasRole(["super_admin", "admin"])) return false;
    if (user.id === currentUser.id) return false; // Can't delete self
    if (hasRole(["admin"]) && user.role === "super_admin") return false;
    return true;
  };

  const canChangeRole = (user) => {
    if (!hasPermission("manage_users")) return false;
    if (user.id === currentUser.id) return false; // Can't change own role
    if (hasRole(["admin"]) && user.role === "super_admin") return false;
    return true;
  };

  // Available roles for dropdown
  const getAvailableRoles = () => {
    const allRoles = [
      "customer",
      "brand_staff",
      "brand_admin",
      "admin",
      "super_admin",
    ];

    if (hasRole(["super_admin"])) {
      return allRoles;
    } else if (hasRole(["admin"])) {
      return allRoles.filter((role) => role !== "super_admin");
    } else if (hasRole(["brand_admin"])) {
      return ["customer", "brand_staff", "brand_admin"];
    }

    return [];
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    // Search filter
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase());

    // Role filter
    const matchesRole = filterRole === "all" || user.role === filterRole;

    // Brand filter
    const matchesBrand =
      filterBrand === "all" ||
      user.brand_id?.toString() === filterBrand ||
      user.brand_name === filterBrand;

    return matchesSearch && matchesRole && matchesBrand;
  });

  // Handle user actions
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleEditUser = (user) => {
    if (!canEditUser(user)) {
      alert("You don't have permission to edit this user");
      return;
    }
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDeleteClick = (user) => {
    if (!canDeleteUser(user)) {
      alert("You don't have permission to delete this user");
      return;
    }
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const handleRoleChangeClick = (user) => {
    if (!canChangeRole(user)) {
      alert("You don't have permission to change this user's role");
      return;
    }
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const updateRole = async () => {
    try {
      await updateUserRole(selectedUser.id, { role: newRole });
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole("");
    } catch (err) {
      console.error("Failed to update role:", err);
    }
  };

  // Get role display name
  const getRoleDisplay = (role) => {
    const roleMap = {
      super_admin: "Super Admin",
      admin: "Admin",
      brand_admin: "Brand Admin",
      brand_staff: "Brand Staff",
      customer: "Customer",
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  if (error) {
    return (
      <Card className="error-card">
        <h3>Error Loading Users</h3>
        <p>{error}</p>
        <button onClick={() => fetchUsers()} className="btn btn-primary">
          Retry
        </button>
      </Card>
    );
  }

  return (
    <div className="user-management">
      {/* Header Section */}
      <div className="section-header">
        <div className="header-content">
          <h2>User Management</h2>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Users</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.byRole.customer || 0}</span>
              <span className="stat-label">Customers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.byRole.admin || 0}</span>
              <span className="stat-label">Admins</span>
            </div>
          </div>
        </div>

        {canCreateUser && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <i className="fas fa-user-plus"></i> Add New User
          </button>
        )}
      </div>

      {/* Filters Section */}
      <Card className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search users by name, email, or role..."
            />
          </div>

          <div className="filter-group">
            <label>Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="form-select"
            >
              <option value="all">All Roles</option>
              {Object.keys(stats.byRole).map((role) => (
                <option key={role} value={role}>
                  {getRoleDisplay(role)} ({stats.byRole[role]})
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Brand</label>
            <select
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className="form-select"
            >
              <option value="all">All Brands</option>
              {Object.keys(stats.byBrand).map((brand) => (
                <option key={brand} value={brand}>
                  {brand} ({stats.byBrand[brand]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No users found. {searchTerm && "Try a different search term."}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className={user.id === currentUser.id ? "current-user" : ""}
                >
                  <td>
                    <div className="user-cell">
                      {user.avatar_url ? (
                        <img
                          src={`http://localhost:5000${user.avatar_url}`}
                          alt={user.name}
                          className="user-avatar"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        {user.id === currentUser.id && (
                          <span className="you-badge">You</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {getRoleDisplay(user.role)}
                    </span>
                  </td>
                  <td>
                    {user.brand_name ? (
                      <span className="brand-badge">{user.brand_name}</span>
                    ) : (
                      <span className="no-brand">No Brand</span>
                    )}
                  </td>
                  <td>
                    <span className="status active">Active</span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="btn btn-sm btn-secondary"
                        title="View details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>

                      {canEditUser(user) && (
                        <button
                          onClick={() => handleEditUser(user)}
                          className="btn btn-sm btn-primary"
                          title="Edit user"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                      )}

                      {canChangeRole(user) && (
                        <button
                          onClick={() => handleRoleChangeClick(user)}
                          className="btn btn-sm btn-warning"
                          title="Change role"
                        >
                          <i className="fas fa-user-tag"></i>
                        </button>
                      )}

                      {canDeleteUser(user) && (
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="btn btn-sm btn-danger"
                          title="Delete user"
                          disabled={user.id === currentUser.id}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? "Edit User" : "Create New User"}
      >
        <UserForm
          user={selectedUser}
          brands={allBrands}
          currentUser={currentUser}
          onSuccess={() => {
            setShowForm(false);
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      </Modal>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetails}
        onClose={() => {
          setShowDetails(false);
          setSelectedUser(null);
        }}
        title="User Details"
      >
        <UserDetails user={selectedUser} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setSelectedUser(null);
        }}
        title="Confirm Delete"
        size="sm"
      >
        <div className="delete-confirm">
          <p>Are you sure you want to delete this user?</p>
          <div className="user-to-delete">
            <strong>{selectedUser?.name}</strong>
            <br />
            <small>{selectedUser?.email}</small>
          </div>
          <p className="warning-text">
            <i className="fas fa-exclamation-triangle"></i>
            This action cannot be undone.
          </p>
          <div className="modal-actions">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button onClick={confirmDelete} className="btn btn-danger">
              Delete User
            </button>
          </div>
        </div>
      </Modal>

      {/* Role Change Modal */}
      <Modal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
          setNewRole("");
        }}
        title="Change User Role"
      >
        <div className="role-change-form">
          <p>
            Change role for <strong>{selectedUser?.name}</strong>
          </p>
          <div className="form-group">
            <label>Current Role</label>
            <div className="current-role">
              <span className={`role-badge role-${selectedUser?.role}`}>
                {getRoleDisplay(selectedUser?.role)}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>New Role</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="form-select"
            >
              <option value="">Select a role</option>
              {getAvailableRoles().map((role) => (
                <option key={role} value={role}>
                  {getRoleDisplay(role)}
                </option>
              ))}
            </select>
          </div>

          <div className="role-permissions">
            <h4>Role Permissions:</h4>
            {newRole && (
              <ul>
                {newRole === "super_admin" && <li>Full system access</li>}
                {newRole === "admin" && <li>Manage all brands and users</li>}
                {newRole === "brand_admin" && (
                  <li>Manage specific brand only</li>
                )}
                {newRole === "brand_staff" && (
                  <li>View and update brand orders</li>
                )}
                {newRole === "customer" && <li>Place and view own orders</li>}
              </ul>
            )}
          </div>

          <div className="modal-actions">
            <button
              onClick={() => {
                setShowRoleModal(false);
                setNewRole("");
              }}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={updateRole}
              className="btn btn-primary"
              disabled={!newRole || newRole === selectedUser?.role}
            >
              Update Role
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
