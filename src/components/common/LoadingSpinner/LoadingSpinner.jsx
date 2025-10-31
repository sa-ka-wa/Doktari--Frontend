import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  return (
    <div className="loading-spinner">
      <div className={`spinner ${size}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
