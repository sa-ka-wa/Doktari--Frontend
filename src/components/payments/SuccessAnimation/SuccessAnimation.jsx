import React from "react";
import { motion } from "framer-motion";
import "./SuccessAnimation.css";

const SuccessAnimation = () => {
  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.5 },
      },
    },
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const sparkVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: [0, 1.2, 0],
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,
        delay: i * 0.1,
        repeat: Infinity,
        repeatDelay: 2,
      },
    }),
  };

  return (
    <div className="success-animation">
      <motion.div
        className="animation-container"
        initial="hidden"
        animate="visible"
      >
        <motion.div className="success-circle" variants={circleVariants}>
          <svg className="checkmark" width="80" height="80" viewBox="0 0 80 80">
            <motion.path
              d="M25 40 L35 50 L55 30"
              fill="transparent"
              strokeWidth="6"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={checkmarkVariants}
            />
          </svg>
        </motion.div>

        {/* Spark effects */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="spark"
            custom={i}
            variants={sparkVariants}
            style={{
              top: `${Math.sin((i * 45 * Math.PI) / 180) * 60 + 50}%`,
              left: `${Math.cos((i * 45 * Math.PI) / 180) * 60 + 50}%`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default SuccessAnimation;
