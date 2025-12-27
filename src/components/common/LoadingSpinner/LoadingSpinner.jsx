// import React from "react";

// const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
//   const sizeClass =
//     size === "sm"
//       ? "w-5 h-5 border-2"
//       : size === "lg"
//       ? "w-12 h-12 border-4"
//       : "w-8 h-8 border-4";

//   return (
//     <div className="flex flex-col items-center justify-center py-8">
//       <div
//         className={`border-t-transparent border-blue-500 rounded-full animate-spin ${sizeClass}`}
//       ></div>
//       <span className="mt-3 text-gray-600 text-sm">{text}</span>
//     </div>
//   );
// };

// export default LoadingSpinner;
import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = ({ size = "medium" }) => {
  return <div className={`spinner spinner-${size}`}></div>;
};

export default LoadingSpinner;
