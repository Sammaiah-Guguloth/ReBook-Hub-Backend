const orderAcceptedNotificationToBuyerTemplate = (
  buyerName,
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
            color: #4CAF50;
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
            border-left: 5px solid #4CAF50;
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
          <h2>Your Order Has Been Accepted ✅</h2>
  
          <p>Hi ${buyerName},</p>
  
          <p>Good news! The seller has accepted your order for the following book:</p>
  
          <div class="info-box">
            <strong>Book Title:</strong> ${bookTitle}<br />
            <strong>Order ID:</strong> ${orderId}
          </div>
  
          <p>📦 The seller will now prepare and ship the book. You will receive a tracking link once the shipping details are provided.</p>
  
          <p>Thank you for shopping with <strong>ReBook Hub</strong>!</p>
  
          <div class="footer">
            ReBook Hub · Sammaiah Guguloth<br />
            This is an automated message. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `;
};

module.exports = orderAcceptedNotificationToBuyerTemplate;
