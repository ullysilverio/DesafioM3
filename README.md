# DinDin - API Project

**DinDin** is a RESTful API developed for managing user authentication and transactions. This project was created using Node.js, Express.js, and PostgreSQL. It allows users to register, log in, and manage their profiles and transactions securely.

## Technologies Used
- **Node.js**: JavaScript runtime for server-side scripting.
- **Express.js**: Web framework for Node.js to build the API.
- **PostgreSQL**: Relational database for storing user data and transactions.
- **bcrypt**: Library for hashing passwords.
- **JWT**: JSON Web Token for secure user authentication.

## Features
- **User Registration**: Allows new users to register with a secure password.
- **Login**: Authenticates users with a JWT token.
- **CRUD Operations**: Perform Create, Read, Update, and Delete actions for user profiles and transactions.
- **Secure Authentication**: Passwords are encrypted, and authentication is managed with JWT tokens.
- **Data Validation**: Ensures that user inputs are validated and errors are handled appropriately.

## Getting Started

### Prerequisites
Before running the project, you need to have the following installed:
- **Node.js**: [Download Node.js](https://nodejs.org/)
- **PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/download/)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ullysilverio/DesafioM3.git
    ```

2. Navigate into the project folder:
    ```bash
    cd DesafioM3
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file to store environment variables (for example, database connection string and JWT secret):
    ```bash
    DATABASE_URL=your_postgresql_connection_string
    JWT_SECRET=your_jwt_secret
    ```

5. Run the application:
    ```bash
    npm start
    ```

Your API should now be running at `http://localhost:3000`.

## Endpoints

- **POST** `/register`: Register a new user.
    - Request Body: `{ "username": "user", "password": "password" }`
    - Response: `{ "message": "User registered successfully." }`

- **POST** `/login`: Authenticate a user and get a JWT token.
    - Request Body: `{ "username": "user", "password": "password" }`
    - Response: `{ "token": "your_jwt_token" }`

- **GET** `/profile`: Get the authenticated user's profile.
    - Headers: `{ "Authorization": "Bearer <jwt_token>" }`
    - Response: `{ "username": "user", "transactions": [...] }`

- **POST** `/transaction`: Create a new transaction for the user.
    - Request Body: `{ "amount": 100, "description": "Transaction description" }`
    - Response: `{ "message": "Transaction created successfully." }`

## Contributing

If you would like to contribute to this project, feel free to fork the repository, make your changes, and submit a pull request. Please ensure that your code follows the existing coding standards and passes all tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
