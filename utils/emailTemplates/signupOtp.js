const signupOtpTemplate = (otp) => {
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
                max-width: 500px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #4CAF50;
                text-align: center;
            }
            p {
                font-size: 16px;
                line-height: 1.6;
                color: #333;
            }
            .otp {
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                font-size: 20px;
                letter-spacing: 2px;
                margin: 15px 0;
                color: #333;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Welcome to ReBook Hub !! 🔄📖 — Where books find new homes</h2>
            <p>Hello,</p>
            <p>Thank you for signing up on <strong>RebookHub</strong>. To complete your registration, please use the following OTP:</p>
            
            <div class="otp">${otp}</div>
            
            <p>If you didn't request this, please ignore this email.</p>
            <div class="footer">
                From,<br>
                Sammaiah Guguloth - RebookHub
            </div>
        </div>
    </body>
    </html>
    `;
};

module.exports = signupOtpTemplate;
