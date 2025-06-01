const orderShippedNotificationTemplate = (buyerName, bookTitle, trackingId) => {
  const trackingLink = `${process.env.FRONTEND_BASE_URL}/track-order/${trackingId}`;

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
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
          color: #2196F3;
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
          border-left: 4px solid #2196F3;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          margin: 10px 0;
          background-color: #2196F3;
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
        <h2>Your Book is On Its Way! 📦</h2>
        <p>Dear ${buyerName},</p>

        <p>We're excited to let you know that the seller has shipped your book. You can now track your delivery using the button below.</p>

        <div class="book-info">
          <strong>Book Title:</strong> ${bookTitle}<br />
          <strong>Tracking ID:</strong> ${trackingId}
        </div>

        <p style="text-align: center;">
          <a href="${trackingLink}" class="button">Track Your Order</a>
        </p>

        <p>If you face any issues, feel free to reach out through the support section in your dashboard.</p>

        <div class="footer">
          ReBook Hub · Sammaiah Guguloth<br />
          This is an automated message. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = orderShippedNotificationTemplate;
