const orderRejectedNotificationToSellerTemplate = (
  sellerName,
  bookTitle,
  orderId
) => {
  return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f9f9f9;
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
              color: #FF6347;
              text-align: center;
            }
            p {
              font-size: 16px;
              color: #333;
            }
            .info-box {
              background-color: #f1f1f1;
              padding: 15px;
              margin: 20px 0;
              border-left: 5px solid #FF6347;
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
            <h2>Order Rejected & Refund Initiated ❌</h2>
    
            <p>Hi ${sellerName},</p>
    
            <p>We regret to inform you that the order for the following book has been rejected and refund to the buyer has been initiated:</p>
    
            <div class="info-box">
              <strong>Book Title:</strong> ${bookTitle}<br />
              <strong>Order ID:</strong> ${orderId}
            </div>
    
            <p>💰 The buyer will receive their refund shortly. Please contact us if you need further assistance.</p>
    
            <p>Thank you for selling with <strong>ReBook Hub</strong>.</p>
    
            <div class="footer">
              ReBook Hub · Sammaiah Guguloth<br />
              This is an automated message. Please do not reply.
            </div>
          </div>
        </body>
        </html>
      `;
};

module.exports = orderRejectedNotificationToSellerTemplate;
