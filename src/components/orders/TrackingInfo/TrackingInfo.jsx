import React, { useState, useEffect } from "react";
import "./TrackingInfo.css";

const TrackingInfo = ({
  trackingNumber,
  carrier,
  status,
  estimatedDelivery,
  lastUpdate,
}) => {
  const [trackingEvents, setTrackingEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const carriers = {
    dhl: { name: "DHL Express", icon: "✈️", color: "#FFCC00" },
    fedex: { name: "FedEx", icon: "📦", color: "#4D148C" },
    ups: { name: "UPS", icon: "🚚", color: "#FFB500" },
    usps: { name: "USPS", icon: "📮", color: "#0072CE" },
    aramex: { name: "Aramex", icon: "🌍", color: "#FF6600" },
    standard: { name: "Standard Shipping", icon: "📦", color: "#6B7280" },
  };

  const currentCarrier = carriers[carrier] || {
    name: carrier,
    icon: "📦",
    color: "#6B7280",
  };

  const trackingStatus = {
    label: status,
    color:
      status === "delivered"
        ? "#10b981"
        : status === "shipped"
        ? "#3b82f6"
        : status === "out_for_delivery"
        ? "#f59e0b"
        : "#6b7280",
  };

  // Mock tracking events (in a real app, this would come from an API)
  useEffect(() => {
    if (!trackingNumber) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockEvents = [
        {
          id: 1,
          status: "Order Created",
          location: "Nairobi, Kenya",
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          description: "Order has been created and is being processed",
        },
        {
          id: 2,
          status: "Package Received",
          location: "Nairobi Hub",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          description: "Package received at sorting facility",
        },
        {
          id: 3,
          status: "In Transit",
          location: "In Transit",
          timestamp: new Date(Date.now() - 43200000).toISOString(),
          description: "Package is on its way to delivery hub",
        },
        {
          id: 4,
          status: "Out for Delivery",
          location: "Local Delivery Hub",
          timestamp: new Date().toISOString(),
          description: "Package is out for delivery today",
        },
      ];

      // Only show events up to current status
      let statusIndex = mockEvents.findIndex((e) =>
        e.status.toLowerCase().includes(status)
      );
      if (statusIndex === -1) statusIndex = mockEvents.length;

      setTrackingEvents(mockEvents.slice(0, statusIndex + 1));
      setLoading(false);
    }, 1000);
  }, [trackingNumber, status]);

  const handleTrackPackage = () => {
    const trackingUrls = {
      dhl: `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
      fedex: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
      ups: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      usps: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      aramex: `https://www.aramex.com/track/results?mode=0&ShipmentNumber=${trackingNumber}`,
    };

    const url = trackingUrls[carrier];
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert(
        `Visit ${currentCarrier.name} website and enter tracking number: ${trackingNumber}`
      );
    }
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    alert(`Tracking number copied: ${trackingNumber}`);
  };

  return (
    <div className="tracking-info">
      <div className="tracking-header">
        <div className="tracking-number-section">
          <h3 className="section-title">Tracking Information</h3>
          <div className="tracking-number-display">
            <span className="number-label">Tracking Number:</span>
            <div className="number-value-container">
              <code className="tracking-number">{trackingNumber}</code>
              <button
                onClick={handleCopyTracking}
                className="copy-btn"
                title="Copy tracking number"
              >
                📋
              </button>
            </div>
          </div>
        </div>

        <div className="carrier-info">
          <div
            className="carrier-badge"
            style={{ backgroundColor: currentCarrier.color }}
          >
            <span className="carrier-icon">{currentCarrier.icon}</span>
            <span className="carrier-name">{currentCarrier.name}</span>
          </div>
        </div>
      </div>

      <div className="tracking-status">
        <div className="status-indicator">
          <div
            className="status-dot"
            style={{ backgroundColor: trackingStatus.color }}
          >
            <div className="status-pulse"></div>
          </div>
          <div className="status-details">
            <h4 className="current-status">{trackingStatus.label}</h4>
            {lastUpdate && (
              <p className="last-update">
                Last updated: {new Date(lastUpdate).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {estimatedDelivery && (
          <div className="estimated-delivery">
            <span className="delivery-label">Estimated Delivery:</span>
            <span className="delivery-date">
              {new Date(estimatedDelivery).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
      </div>

      <div className="tracking-timeline">
        <h4 className="timeline-title">Tracking History</h4>

        {loading ? (
          <div className="loading-timeline">
            <div className="loading-spinner"></div>
            <p>Loading tracking information...</p>
          </div>
        ) : error ? (
          <div className="error-timeline">
            <p>Unable to load tracking history. Please try again later.</p>
          </div>
        ) : trackingEvents.length === 0 ? (
          <div className="no-events">
            <p>No tracking events available yet.</p>
          </div>
        ) : (
          <div className="timeline">
            {trackingEvents.map((event, index) => (
              <div
                key={event.id}
                className={`timeline-event ${
                  index === trackingEvents.length - 1 ? "current" : ""
                }`}
              >
                <div className="event-marker">
                  <div className="marker-dot"></div>
                  {index !== trackingEvents.length - 1 && (
                    <div className="marker-line"></div>
                  )}
                </div>
                <div className="event-content">
                  <div className="event-header">
                    <h5 className="event-status">{event.status}</h5>
                    <span className="event-time">
                      {new Date(event.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="event-location">{event.location}</p>
                  <p className="event-description">{event.description}</p>
                  <span className="event-date">
                    {new Date(event.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tracking-actions">
        <button onClick={handleTrackPackage} className="track-btn primary">
          Track on {currentCarrier.name} Website
        </button>
        <button onClick={() => window.print()} className="track-btn secondary">
          Print Tracking Information
        </button>
      </div>
    </div>
  );
};

export default TrackingInfo;
