const orderConfirmedShippingFormTemplate = (sellerName, bookTitle, orderId) => {
  const shippingFormLink = `${process.env.FRONTEND_BASE_URL}/seller/orders/${orderId}/shipping`;

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
          <h2>Order Confirmed – Next Step: Ship the Book 📮</h2>
          <p>Dear ${sellerName},</p>
          
          <p>You've successfully <strong>confirmed</strong> the buyer's order for your book. 🎉</p>
  
          <div class="book-info">
            <strong>Book Title:</strong> ${bookTitle}<br />
            <strong>Order ID:</strong> ${orderId}
          </div>
  
          <p>📦 <strong>Next Step:</strong> Please ship the book to the buyer using a reliable courier service.</p>
  
          <p>🚚 After shipping, click the button below to fill in the shipping form with courier and tracking details:</p>
  
          <p style="text-align: center;">
            <a href="${shippingFormLink}" class="button">Fill Shipping Form</a>
          </p>
  
          <p>This is required to notify the buyer and initiate the payment release process.</p>
  
          <div class="footer">
            ReBook Hub · Sammaiah Guguloth<br />
            This is an automated message. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `;
};

module.exports = orderConfirmedShippingFormTemplate;
