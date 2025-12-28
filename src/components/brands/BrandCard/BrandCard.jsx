// src/components/brands/BrandCard/BrandCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./BrandCard.css";
import { Card } from "../../common/Card";
import { Button } from "../../common/Button";

const BrandCard = ({ brand, showActions = false, onEdit, onDelete }) => {
  const {
    id,
    name,
    description,
    logo_url,
    category,
    established_year,
    products_count = 0,
  } = brand;

  return (
    <Card className="brand-card" hoverable>
      <div className="brand-card-header">
        {logo_url && (
          <div className="brand-logo">
            <img src={logo_url} alt={`${name} logo`} loading="lazy" />
          </div>
        )}
        <div className="brand-info">
          <h3 className="brand-name">{name}</h3>
          {category && <span className="brand-category">{category}</span>}
          {established_year && (
            <span className="brand-year">Est. {established_year}</span>
          )}
        </div>
      </div>

      {description && (
        <p className="brand-description">
          {description.length > 150
            ? `${description.substring(0, 150)}...`
            : description}
        </p>
      )}

      <div className="brand-stats">
        <div className="stat-item">
          <span className="stat-value">{products_count}</span>
          <span className="stat-label">Products</span>
        </div>
      </div>

      <div className="brand-card-footer">
        <Link to={`/brands/${id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>

        {showActions && (
          <div className="brand-actions">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit && onEdit(brand)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete && onDelete(id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default BrandCard;
