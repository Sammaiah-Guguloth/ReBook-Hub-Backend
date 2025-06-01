const payoutRequestNotificationToAdminTemplate = (
  orderId,
  trackingId,
  sellerName,
  method,
  upi,
  accountNumber,
  ifsc
) => {
  const payoutDetails =
    method === "upi"
      ? `
          <tr>
            <td><strong>Payment Method:</strong></td>
            <td>UPI</td>
          </tr>
          <tr>
            <td><strong>UPI ID:</strong></td>
            <td>${upi}</td>
          </tr>
        `
      : `
          <tr>
            <td><strong>Payment Method:</strong></td>
            <td>Bank Transfer</td>
          </tr>
          <tr>
            <td><strong>Account Number:</strong></td>
            <td>${accountNumber}</td>
          </tr>
          <tr>
            <td><strong>IFSC Code:</strong></td>
            <td>${ifsc}</td>
          </tr>
        `;

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              background-color: #ffffff;
              max-width: 600px;
              margin: 30px auto;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h2 {
              color: #28a745;
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            td {
              padding: 8px 12px;
              vertical-align: top;
              border-bottom: 1px solid #eaeaea;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #777;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>📦 Book Delivered – Seller Payout Requested</h2>
  
            <p>Hi Admin,</p>
  
            <p>The following order has been marked as <strong>Delivered</strong>. Please proceed with the seller's payout using the provided details:</p>
  
            <table>
              <tr>
                <td><strong>Order ID:</strong></td>
                <td>${orderId}</td>
              </tr>
              <tr>
                <td><strong>Tracking ID:</strong></td>
                <td>${trackingId}</td>
              </tr>
              <tr>
                <td><strong>Seller Name:</strong></td>
                <td>${sellerName}</td>
              </tr>
              ${payoutDetails}
            </table>
  
            <p>Thank you for managing payouts promptly.</p>
  
            <div class="footer">
              ReBook Hub · Sammaiah Guguloth<br />
              This is an automated email – please do not reply.
            </div>
          </div>
        </body>
      </html>
    `;
};

module.exports = payoutRequestNotificationToAdminTemplate;
