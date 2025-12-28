// src/components/common/Input/Input.jsx
import React, { forwardRef, useState } from "react";
import "./Input.css";

const Input = forwardRef(
  (
    {
      type = "text",
      label,
      error,
      helperText,
      disabled = false,
      required = false,
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      className = "",
      size = "medium",
      fullWidth = false,
      icon,
      iconPosition = "left",
      addonBefore,
      addonAfter,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputClasses = [
      "input",
      `input-${size}`,
      error ? "input-error" : "",
      disabled ? "input-disabled" : "",
      isFocused ? "input-focused" : "",
      icon ? `input-with-icon input-icon-${iconPosition}` : "",
      fullWidth ? "input-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const renderInput = () => (
      <div className="input-wrapper">
        {icon && iconPosition === "left" && (
          <span className="input-icon input-icon-left">{icon}</span>
        )}

        <input
          ref={ref}
          type={type}
          className={inputClasses}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          {...props}
        />

        {icon && iconPosition === "right" && (
          <span className="input-icon input-icon-right">{icon}</span>
        )}
      </div>
    );

    const renderWithAddons = () => (
      <div className="input-addon-group">
        {addonBefore && (
          <span className="input-addon input-addon-before">{addonBefore}</span>
        )}
        {renderInput()}
        {addonAfter && (
          <span className="input-addon input-addon-after">{addonAfter}</span>
        )}
      </div>
    );

    return (
      <div className="input-container">
        {label && (
          <label className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        {addonBefore || addonAfter ? renderWithAddons() : renderInput()}

        {error && <div className="input-error-message">{error}</div>}
        {helperText && !error && (
          <div className="input-helper">{helperText}</div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
