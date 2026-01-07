import React from "react";
import { motion } from "framer-motion";
import "./DownloadReceipt.css";

const DownloadReceipt = ({ order }) => {
  const handleDownload = () => {
    if (!order) {
      alert("Order information not available");
      return;
    }

    const receiptContent = generateReceiptContent(order);
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order.order_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const receiptContent = generateReceiptContent(order, true);
    printWindow.document.write(receiptContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const generateReceiptContent = (order, isHtml = false) => {
    if (!isHtml) {
      return `
=========================================
         AFROCHIC STORE
=========================================

Order Receipt
-------------
Order Number: ${order.order_number}
Date: ${new Date(order.created_at).toLocaleString()}
Status: ${order.status}

Customer Information
-------------------
Name: ${order.customer_name}
Email: ${order.customer_email}
Phone: ${order.customer_phone}

Shipping Address
----------------
${order.shipping_address}
${order.shipping_city}, ${order.shipping_state}
${order.shipping_zip}
${order.shipping_country}

Order Items
-----------
${order.items
  ?.map(
    (item) => `
${item.product_title}
  Quantity: ${item.quantity}
  Price: KSh ${item.product_price.toLocaleString()}
  Total: KSh ${(item.product_price * item.quantity).toLocaleString()}
  ${item.size ? `Size: ${item.size}` : ""}
  ${item.color ? `Color: ${item.color}` : ""}
`
  )
  .join("\n")}

Order Summary
-------------
Subtotal: KSh ${order.subtotal?.toLocaleString()}
Shipping: KSh ${order.shipping_cost?.toLocaleString()}
Tax: KSh ${order.tax_amount?.toLocaleString()}
-----------------------------------------
TOTAL: KSh ${order.total_amount?.toLocaleString()}

Payment Information
-------------------
Method: ${order.payment_method}
Status: ${order.payment_status}

Thank you for your purchase!
============================
Support: support@afrochic.com
Phone: +254 700 000 000
      `;
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Receipt - ${order.order_number}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
    .section { margin-bottom: 25px; }
    h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background-color: #f5f5f5; }
    .total-row { font-weight: bold; background-color: #f9f9f9; }
    .footer { margin-top: 50px; text-align: center; color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <div class="header">
    <h1>AFROCHIC STORE</h1>
    <h2>Order Receipt</h2>
    <p><strong>Order #:</strong> ${order.order_number}</p>
    <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
  </div>
  
  <div class="section">
    <h2>Customer Information</h2>
    <p><strong>Name:</strong> ${order.customer_name}</p>
    <p><strong>Email:</strong> ${order.customer_email}</p>
    <p><strong>Phone:</strong> ${order.customer_phone}</p>
  </div>
  
  <div class="section">
    <h2>Shipping Address</h2>
    <p>${order.shipping_address}</p>
    <p>${order.shipping_city}, ${order.shipping_state} ${order.shipping_zip}</p>
    <p>${order.shipping_country}</p>
  </div>
  
  <div class="section">
    <h2>Order Items</h2>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          ?.map(
            (item) => `
          <tr>
            <td>${item.product_title}</td>
            <td>${item.quantity}</td>
            <td>KSh ${item.product_price.toLocaleString()}</td>
            <td>KSh ${(
              item.product_price * item.quantity
            ).toLocaleString()}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  </div>
  
  <div class="section">
    <h2>Order Summary</h2>
    <table>
      <tr>
        <td>Subtotal:</td>
        <td>KSh ${order.subtotal?.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Shipping:</td>
        <td>KSh ${order.shipping_cost?.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Tax:</td>
        <td>KSh ${order.tax_amount?.toLocaleString()}</td>
      </tr>
      <tr class="total-row">
        <td>Total:</td>
        <td>KSh ${order.total_amount?.toLocaleString()}</td>
      </tr>
    </table>
  </div>
  
  <div class="footer">
    <p>Thank you for your purchase!</p>
    <p>AFROCHIC STORE • support@afrochic.com • +254 700 000 000</p>
  </div>
</body>
</html>
    `;
  };

  return (
    <motion.div
      className="download-receipt"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <button onClick={handleDownload} className="download-btn">
        <span className="icon">📄</span>
        <span className="text">Download Receipt</span>
      </button>
      <button onClick={handlePrint} className="print-btn">
        <span className="icon">🖨️</span>
        <span className="text">Print Receipt</span>
      </button>
    </motion.div>
  );
};

export default DownloadReceipt;
