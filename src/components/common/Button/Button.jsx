// // src/components/common/Button/Button.jsx
// import React from "react";
// import "./Button.css";

// const Button = ({
//   children,
//   variant = "primary",
//   size = "medium",
//   type = "button",
//   disabled = false,
//   loading = false,
//   icon,
//   iconPosition = "left",
//   onClick,
//   className = "",
//   ...props
// }) => {
//   const buttonClasses = [
//     "btn",
//     `btn-${variant}`,
//     `btn-${size}`,
//     disabled ? "btn-disabled" : "",
//     loading ? "btn-loading" : "",
//     className,
//   ]
//     .filter(Boolean)
//     .join(" ");

//   return (
//     <button
//       type={type}
//       className={buttonClasses}
//       onClick={onClick}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {loading && (
//         <span className="btn-spinner">
//           <svg className="spinner" viewBox="0 0 50 50">
//             <circle
//               className="path"
//               cx="25"
//               cy="25"
//               r="20"
//               fill="none"
//               strokeWidth="5"
//             ></circle>
//           </svg>
//         </span>
//       )}

//       {!loading && icon && iconPosition === "left" && (
//         <span className="btn-icon btn-icon-left">{icon}</span>
//       )}

//       <span className="btn-content">{children}</span>

//       {!loading && icon && iconPosition === "right" && (
//         <span className="btn-icon btn-icon-right">{icon}</span>
//       )}
//     </button>
//   );
// };

// export default Button;
import React from "react";
import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  fullWidth = false,
  ...props
}) => {
  // Filter out props that shouldn't go to DOM
  const domProps = { ...props };
  delete domProps.fullWidth;

  const buttonClass = `btn btn-${variant} btn-${size} ${
    fullWidth ? "btn-full" : ""
  } ${className}`.trim();

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      type={type}
      disabled={disabled}
      {...domProps}
    >
      {children}
    </button>
  );
};

export default Button;