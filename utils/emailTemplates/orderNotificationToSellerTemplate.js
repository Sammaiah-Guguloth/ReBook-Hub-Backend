const orderNotificationToSellerTemplate = (bookTitle, orderId) => {
  const frontendLink = `${process.env.FRONTEND_BASE_URL}/seller/orders/${orderId}`;

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
            background-color: white;
            margin: 30px auto;
            padding: 20px;
            border-radius: 10px;
            max-width: 600px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h2 {
            color: #4CAF50;
            text-align: center;
          }
          p {
            font-size: 16px;
            color: #333;
          }
          .book-info {
            background-color: #f0f0f0;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 10px 0;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            text-align: center;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Order Received 📦</h2>
          <p>Hello,</p>
          <p>You’ve received a new order for the following book on <strong>ReBook Hub</strong>:</p>
          
          <div class="book-info">
            <strong>Book Title:</strong> ${bookTitle}<br />
            <strong>Order ID:</strong> ${orderId}
          </div>
  
          <p>Please review the order and either <strong>accept</strong> or <strong>reject</strong> it by clicking the button below:</p>
  
          <p style="text-align: center;">
            <a href="${frontendLink}" class="button">View and Process Order</a>
          </p>
  
          <p>If you do not take action, the order will remain pending.</p>
  
          <div class="footer">
            ReBook Hub · Sammaiah Guguloth<br />
            This is an automated message. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `;
};

module.exports = orderNotificationToSellerTemplate;
