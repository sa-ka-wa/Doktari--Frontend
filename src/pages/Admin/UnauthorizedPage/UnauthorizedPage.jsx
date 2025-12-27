// src/pages/UnauthorizedPage.jsx
import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>403 - Unauthorized</h1>
    <p>You don’t have permission to access this page.</p>
    <Link to="/">Go back home</Link>
  </div>
);

export default UnauthorizedPage;
