# 🏥 Hospital Backend API

A secure, modern, and production-ready REST API built with **Node.js**, **Express 5**, **TypeScript**, **Zod**, and **JSON Web Tokens (JWT)**. Designed with ES Modules (`import`/`export`), strict type checking, and modular architecture.

---

## 🚀 Features

- **Modern ES Modules**: Uses native ECMAScript Modules (`"type": "module"`) and TypeScript `NodeNext` resolution.
- **User Authentication**: Complete user registration and login flows with hashed passwords via `bcryptjs`.
- **JWT Authorization**: Stateless authorization protecting private hospital resources using Bearer tokens.
- **Request Validation**: Schema-based validation using **Zod v4** with clear, field-level error messages.
- **Security Hardening**:
  - `helmet`: Sets secure HTTP headers (CSP, HSTS, frame protection, MIME-sniffing prevention).
  - `cors`: Enables safe Cross-Origin Resource Sharing for frontend applications.
- **Global Error Handling**: Express 4-argument error-handling middleware + process-level catches (`uncaughtException`, `unhandledRejection`).
- **Fast Developer Experience**: Powered by `tsx` for near-instant TypeScript execution with file watching.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+ recommended)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Security**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [helmet](https://helmetjs.github.io/), [cors](https://github.com/expressjs/cors)
- **Dev Runner**: [tsx](https://github.com/privatenumber/tsx)

---

## 📁 Project Structure

```
hospital_backend/
├── src/
│   ├── config/
│   │   └── env.ts                 # Typed environment variables and defaults
│   ├── controllers/
│   │   ├── auth.controller.ts     # User register, login, and profile handlers
│   │   └── hospital.controller.ts # Protected hospital resource handlers
│   ├── middlewares/
│   │   ├── auth.ts                # JWT verification & req.user injector
│   │   ├── error.ts               # Global error handler and 404 handler
│   │   └── validate.ts            # Generic Zod validation middleware
│   ├── models/
│   │   └── user.model.ts          # User repository & password hashing
│   ├── routes/
│   │   ├── auth.routes.ts         # /api/auth routes
│   │   └── hospital.routes.ts     # /api/hospital protected routes
│   ├── schemas/
│   │   └── auth.schema.ts         # Zod schemas for register & login
│   ├── types/
│   │   └── auth.types.ts          # TypeScript interfaces for User and JWT
│   └── index.ts                   # Express server entry point & middlewares
├── dist/                          # Compiled JavaScript production build
├── .env                           # Environment configuration
├── .gitignore                     # Git ignored files
├── package.json                   # Project scripts and dependencies
├── tsconfig.json                  # TypeScript compiler settings
└── README.md                      # Project documentation
```

---

## ⚙️ Getting Started

### 1. Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) (version 18.x, 20.x, or 22.x)
- `npm` (bundled with Node.js)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd hospital_backend
npm install
```

### 3. Environment Configuration

Create or update the `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=1d
```

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PORT` | `3000` | Port number on which the server listens |
| `NODE_ENV` | `development` | Environment mode (`development` / `production`) |
| `JWT_SECRET` | - | Secret key used to sign and verify JWT tokens |
| `JWT_EXPIRES_IN` | `1d` | Expiration time for generated JWT tokens (e.g. `1d`, `7d`, `12h`) |

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `tsx watch src/index.ts` | Runs the server with live reload on file changes |
| `npm run build` | `tsc` | Compiles TypeScript source to production JavaScript in `dist/` |
| `npm start` | `node dist/index.js` | Runs the compiled production build from `dist/` |
| `npm run typecheck` | `tsc --noEmit` | Checks types across the project without emitting files |
| `npm run watch` | `tsc --watch` | Watches for TypeScript compilation changes |

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000
```

---

### 1. Health Check
Checks if the server is healthy and accepting requests.

- **URL**: `/health`
- **Method**: `GET`
- **Auth Required**: No
- **Response (`200 OK`)**:
  ```json
  {
    "status": "ok",
    "message": "Hospital Backend API is running!",
    "timestamp": "2026-09-18T17:35:04.148Z"
  }
  ```

---

### 2. User Registration
Registers a new user account with hashed password and generates a signed JWT.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "name": "Dr. Gregory House",
    "email": "house@hospital.com",
    "password": "SuperSecretPassword123!",
    "role": "doctor"
  }
  ```
- **Validation Rules**:
  - `name`: String, 2 to 50 characters (required)
  - `email`: Valid email format (required)
  - `password`: String, minimum 6 characters (required)
  - `role`: Optional, one of: `"patient"`, `"doctor"`, `"admin"` (defaults to `"patient"`)

- **Response (`201 Created`)**:
  ```json
  {
    "status": "success",
    "message": "Account created successfully",
    "data": {
      "user": {
        "id": "usr_1789752948241_m2136",
        "name": "Dr. Gregory House",
        "email": "house@hospital.com",
        "role": "doctor",
        "createdAt": "2026-09-18T17:35:48.241Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

- **Error Responses**:
  - `400 Bad Request`: Payload failed validation (returns array of field errors).
  - `409 Conflict`: An account with that email already exists.

---

### 3. User Login
Authenticates an existing user and issues a signed JWT.

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth Required**: No
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "email": "house@hospital.com",
    "password": "SuperSecretPassword123!"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "Logged in successfully",
    "data": {
      "user": {
        "id": "usr_1789752948241_m2136",
        "name": "Dr. Gregory House",
        "email": "house@hospital.com",
        "role": "doctor",
        "createdAt": "2026-09-18T17:35:48.241Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password.

---

### 4. Authenticated User Profile
Retrieves the profile of the currently logged-in user.

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Auth Required**: **Yes** (`Bearer <token>`)
- **Headers**: `Authorization: Bearer <your_token>`
- **Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": "usr_1789752948241_m2136",
        "name": "Dr. Gregory House",
        "email": "house@hospital.com",
        "role": "doctor",
        "createdAt": "2026-09-18T17:35:48.241Z"
      }
    }
  }
  ```

---

### 5. Protected Hospital Patients
Fetches patient medical records. Only accessible to registered users holding a valid JWT.

- **URL**: `/api/hospital/patients`
- **Method**: `GET`
- **Auth Required**: **Yes** (`Bearer <token>`)
- **Headers**: `Authorization: Bearer <your_token>`
- **Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "message": "Welcome, house@hospital.com! Here are the protected hospital patient records.",
    "requestedBy": {
      "userId": "usr_1789752948241_m2136",
      "email": "house@hospital.com",
      "role": "doctor",
      "iat": 1789752948,
      "exp": 1789839348
    },
    "data": {
      "total": 3,
      "records": [
        {
          "id": "rec_101",
          "patientName": "Jane Doe",
          "age": 34,
          "condition": "Acute Appendicitis - Post-Op Recovery",
          "doctorAssigned": "Dr. Sarah Smith",
          "roomNumber": "302-B"
        }
      ]
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Token missing, malformed, or expired.

---

### 6. Hospital Overview Statistics
Fetches general facility metrics (occupied beds, wait times, etc.).

- **URL**: `/api/hospital/overview`
- **Method**: `GET`
- **Auth Required**: **Yes** (`Bearer <token>`)
- **Headers**: `Authorization: Bearer <your_token>`
- **Response (`200 OK`)**:
  ```json
  {
    "status": "success",
    "data": {
      "hospitalName": "General Care Medical Center",
      "occupiedBeds": 142,
      "availableBeds": 58,
      "activeDoctors": 24,
      "emergencyWaitTimeMinutes": 12
    }
  }
  ```

---

## 🔒 Security Architecture

1. **Password Safety**: Passwords are cryptographically salted and hashed using `bcryptjs` with a cost factor of 10. Raw passwords are never stored or logged.
2. **JWT Authentication**: Protected routes require a signed Bearer token in the `Authorization` header. Expired or altered tokens are rejected automatically.
3. **Data Sanitization & Validation**: Incoming requests must match strict Zod schemas before hitting any controller or service logic.
4. **Header Protection (`helmet`)**: Defends against clickjacking, cross-site scripting (XSS), MIME sniffing, and disables the `X-Powered-By: Express` signature.
5. **CORS Configuration (`cors`)**: Protects your endpoints from unauthorized third-party origins while enabling cross-origin communication for your frontend.
6. **Error Masking**: Internal server stack traces are only visible in `development` mode and masked in `production`.

---

## 💡 Connecting a Database (Next Steps)

The project currently uses a modular in-memory user store located in [`src/models/user.model.ts`](file:///c:/Users/Varun%20C%20M/OneDrive/Desktop/hospital_backend/src/models/user.model.ts).

To connect a persistent database:
- **Prisma / PostgreSQL**: Install `@prisma/client` and replace the methods in `UserModel` (`create`, `findByEmail`, `findById`) with `prisma.user.create`, etc.
- **MongoDB / Mongoose**: Install `mongoose` and define a schema/model replacing the in-memory `Map`.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
