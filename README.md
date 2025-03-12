# API Documentation

## User Routes

### POST /user/send-otp

- **Description**: Sends an OTP to the user's email for registration.
- **Request Body**:
  ```json
  {
    "email": "string" // User's email (required, must be a valid email format)
  }
  ```
- **Comments**:
  - If the email is missing: "Email is required".
- **Status Codes**:
  - **200 OK**: OTP sent successfully.
  - **500 Internal Server Error**: Error sending OTP.

### POST /user/register

- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "firstName": "string", // User's first name (required, must be at least 3 characters long)
    "lastName": "string", // User's last name (optional)
    "email": "string", // User's email (required, must be a valid email format)
    "password": "string", // User's password (required, minimum length of 6 characters)
    "address": {
      // User's address details (required)
      "street": "string", // Street address (required)
      "village": "string", // Village or town (required)
      "city": "string", // City (required)
      "pincode": "string" // Pincode (required, must be exactly 6 digits)
    },
    "phoneNumber": "string", // User's phone number (required, must be a valid 10-digit Indian mobile number)
    "otp": "string" // otp sent to user's email (required)
  }
  ```
- **Status Codes**:
  - **201 Created**: User registered successfully.
  - **400 Bad Request**: Validation errors.
  - **409 Conflict**: User with this email already exists.
  - **500 Internal Server Error**: Error while registering user.

### POST /user/login

- **Description**: Authenticates a user and logs them in.
- **Request Body**:
  ```json
  {
    "email": "string", // User's email (required, must be a valid email format)
    "password": "string" // User's password (required, minimum length of 6 characters)
  }
  ```
- **Status Codes**:
  - **200 OK**: User logged in successfully.
  - **404 Not Found**: User not found.
  - **401 Unauthorized**: Invalid password.

### POST /user/logout

- **Description**: Logs out a user and clears the authentication token.
- **Middleware**: `authUser` (ensures the user is authenticated).
- **Status Codes**:
  - **200 OK**: User logged out successfully.
  - **401 Unauthorized**: Unauthorized (if the token is invalid or missing).
