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
      "street": "string", // Street address (required)
      "village": "string", // Village or town (required)
      "city": "string", // City (required)
      "pincode": "string" // Pincode (required, must be exactly 6 digits)
    },
    "phoneNumber": "string" // User's phone number (required, must be a valid 10-digit Indian mobile number)
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

### GET /user/profile

- **Description**: Retrieves the authenticated user's profile information.
- **Request Body**: None
- **Status Codes**:
  - **200 OK**: User profile retrieved successfully.
  - **401 Unauthorized**: Unauthorized (if the token is missing or invalid).

### GET /all-books

- **Description**: Retrieves a list of all books available on the platform.
- **Request Body**: None
- **Response Body**:
  ```json
  {
    "books": [
      {
        "title": "string", // The title of the book
        "genre": "string", // The genre of the book
        "language": "string", // The language in which the book is written
        "description": "string", // A brief description of the book
        "price": "number", // The price of the book
        "author": "string", // The author of the book
        "publication": {
          "date": "string", // The publication date of the book
          "publisher": "string" // The publisher of the book
        },
        "coverImage": "string", // URL of the book's cover image
        "trueImages": ["string"], // Array of URLs of actual second-hand book images
        "rating": "number", // The book's rating (if applicable)
        "owner": "string" // The ID of the user who posted the book
      }
    ]
  }
  ```
  **Status Codes**:
  - **200 OK**: Books retrieved successfully.
  - **500 Internal Server Error**: An error occurred on the server.

### GET /book-by-id/:bookId

- **Description**: Retrieves a specific book by its ID.
- **Method**: GET
- **Parameters**:
  - `bookId` (string): The ID of the book to retrieve.
- **Response**:
  - **Status Codes**:
    - **200 OK**: Book retrieved successfully.
    - **404 Not Found**: Book not found.
    - **500 Internal Server Error**: An error occurred on the server.
  - **Response Body**:
  ```json
  {
    "book": {
      "title": "string",
      "genre": "string",
      "language": "string",
      "description": "string",
      "price": "number",
      "author": "string",
      "publication": {
        "date": "string",
        "publisher": "string"
      },
      "coverImage": "string",
      "trueImages": ["string"],
      "rating": "number",
      "owner": "string"
    }
  }
  ```
