const paymentConfirmationToBuyerTemplate = (bookTitle, orderId) => {
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
            background-color: #fff;
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
          .order-info {
            background-color: #f0f0f0;
            padding: 15px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
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
          <h2>Payment Successful! ✅</h2>
          <p>Hi there,</p>
          <p>Thank you for placing an order on <strong>ReBook Hub</strong>. Your payment has been received successfully. We're now waiting for the seller to confirm the order.</p>
          
          <div class="order-info">
            <strong>Book Title:</strong> ${bookTitle}<br />
            <strong>Order ID:</strong> ${orderId}
          </div>
  
          <p>We'll notify you as soon as the seller accepts or rejects your order.</p>
          <p>In the meantime, you can view your order status in your ReBook Hub account.</p>
  
          <div class="footer">
            ReBook Hub · Sammaiah Guguloth<br />
            This is an automated message. Please do not reply.
          </div>
        </div>
      </body>
      </html>
    `;
};

module.exports = paymentConfirmationToBuyerTemplate;
