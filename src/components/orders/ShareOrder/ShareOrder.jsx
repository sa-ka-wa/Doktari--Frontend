import React, { useState } from "react";
import { motion } from "framer-motion";
import "./ShareOrder.css";

const ShareOrder = ({ order }) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/orders/${order.id}`;
  const shareText = `I just ordered from AfroChic! Check out my order #${order.order_number}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (platform) => {
    const urls = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        shareText + " " + shareUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      email: `mailto:?subject=${encodeURIComponent(
        "My AfroChic Order"
      )}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    };

    if (platform === "email") {
      window.location.href = urls.email;
    } else {
      window.open(urls[platform], "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="share-order">
      <motion.button
        className="share-button"
        onClick={() => setShowShareOptions(!showShareOptions)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="icon">📤</span>
        <span className="text">Share Order</span>
      </motion.button>

      {showShareOptions && (
        <motion.div
          className="share-options"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="share-header">
            <h4>Share Order #{order.order_number}</h4>
            <button
              className="close-btn"
              onClick={() => setShowShareOptions(false)}
            >
              ×
            </button>
          </div>

          <div className="share-platforms">
            <button
              className="platform-btn whatsapp"
              onClick={() => handleShare("whatsapp")}
              title="Share on WhatsApp"
            >
              <span className="icon">💬</span>
              WhatsApp
            </button>

            <button
              className="platform-btn twitter"
              onClick={() => handleShare("twitter")}
              title="Share on Twitter"
            >
              <span className="icon">🐦</span>
              Twitter
            </button>

            <button
              className="platform-btn facebook"
              onClick={() => handleShare("facebook")}
              title="Share on Facebook"
            >
              <span className="icon">👥</span>
              Facebook
            </button>

            <button
              className="platform-btn email"
              onClick={() => handleShare("email")}
              title="Share via Email"
            >
              <span className="icon">✉️</span>
              Email
            </button>
          </div>

          <div className="copy-link">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="link-input"
            />
            <button
              onClick={handleCopyLink}
              className={`copy-btn ${copied ? "copied" : ""}`}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ShareOrder;
