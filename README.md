# API Documentation

## Routes

### POST /register

- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "firstName": "John", // min length 3, required
    "email": "john@example.com", // required, valid email format
    "password": "password123", // min length 6, required
    "address": {
      "street": "123 Main St", // required
      "village": "Sample Village", // required
      "city": "Sample City", // required
      "pincode": "123456" // required, exactly 6 digits
    },
    "phoneNumber": "9876543210" // required, valid 10-digit Indian mobile number
  }
  ```
- **Responses**:
  - **201 Created**: User registered successfully.
    ```json
    {
      "message": "User registered successfully",
      "user": {
        "firstName": "John",
        "email": "john@example.com"
      }
    }
    ```
  - **400 Bad Request**: Validation errors.
    ```json
    {
      "errors": {
        "firstName": ["First name must be at least 3 characters long"],
        "email": ["Email is required", "Invalid Email"],
        "password": ["Password must be at least 6 characters long"],
        "address": {
          "street": ["Street is required"],
          "village": ["Town is required"],
          "city": ["City is required"],
          "pincode": [
            "Pincode must be exactly 6 digits long",
            "Pincode must be a number"
          ]
        },
        "phoneNumber": [
          "Phone number must be a valid 10-digit Indian mobile number starting with 6-9"
        ]
      }
    }
    ```

### POST /send-otp

- **Description**: Sends an OTP to the user's email.
- **Request Body**:
  ```json
  {
    "email": "john@example.com" // required, valid email format
  }
  ```
- **Responses**:
  - **200 OK**: OTP sent successfully.
    ```json
    {
      "message": "OTP sent to email"
    }
    ```
  - **400 Bad Request**: Validation errors.
    ```json
    {
      "errors": {
        "email": ["Email is required", "Invalid Email"]
      }
    }
    ```

## Status Codes

- **201**: Created
- **200**: OK
- **400**: Bad Request
