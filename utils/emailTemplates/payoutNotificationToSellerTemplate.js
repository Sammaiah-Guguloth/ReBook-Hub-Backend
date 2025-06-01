const payoutNotificationToSellerTemplate = (
  sellerName,
  bookTitle,
  orderId,
  payoutMethod,
  payoutAmount
) => {
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
            <h2>💰 Payout for Your Delivered Order</h2>
  
            <p>Hi ${sellerName},</p>
  
            <p>We’re happy to inform you that your order for the following book has been delivered and the payment has been processed:</p>
  
            <table>
              <tr>
                <td><strong>Book Title:</strong></td>
                <td>${bookTitle}</td>
              </tr>
              <tr>
                <td><strong>Order ID:</strong></td>
                <td>${orderId}</td>
              </tr>
              <tr>
                <td><strong>Payment Method:</strong></td>
                <td>${payoutMethod}</td>
              </tr>
              <tr>
                <td><strong>Payout Amount:</strong></td>
                <td>${payoutAmount}</td>
              </tr>
            </table>
  
            <p>The amount has been transferred to your payout account. Thank you for selling with ReBook Hub!</p>
  
            <div class="footer">
              ReBook Hub · Sammaiah Guguloth<br />
              This is an automated message – please do not reply.
            </div>
          </div>
        </body>
      </html>
    `;
};

module.exports = payoutNotificationToSellerTemplate;
