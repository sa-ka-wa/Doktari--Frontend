// src/components/common/Card/Card.jsx
import React from "react";
import "./Card.css";

const Card = ({
  children,
  className = "",
  variant = "default",
  padding = "medium",
  hoverable = false,
  clickable = false,
  onClick,
  ...props
}) => {
  const cardClasses = [
    "card",
    `card-${variant}`,
    `card-padding-${padding}`,
    hoverable ? "card-hoverable" : "",
    clickable ? "card-clickable" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
