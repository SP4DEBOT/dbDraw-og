# DbDraw

## Project Description

**DbDraw** is an AI-powered visual database design and code generation platform developed as an MCA academic project. It allows developers, database architects, and students to visually model relational database schemas, configure entity relationships, generate SQL/ORM scripts, and inspect database structures seamlessly.

This repository contains the **Backend Foundation (Phase 1)** of DbDraw. The backend provides a secure, modular REST API architecture with user authentication, role-based authorization, MongoDB database integration with Mongoose, and user management capabilities.

---

## Technology Stack

The backend foundation is built using the Node.js ecosystem with clean separation of concerns:

- **Runtime Environment:** Node.js (v18+)
- **Web Framework:** Express.js (v4)
- **Database:** MongoDB (via Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Environment Management:** dotenv
- **Cross-Origin Security:** cors
- **Development Tooling:** nodemon

---

## Backend Setup

### Prerequisites

Ensure the following tools are installed on your workstation:

1. **Node.js**: `v18.0.0` or later ([Download Node.js](https://nodejs.org/))
2. **MongoDB**: Local MongoDB Community Server running on port 27017 or a free cloud cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
3. **API Client**: [Postman](https://www.postman.com/) or any HTTP REST client

---

## Environment Variables

All configuration is managed through environment variables to ensure zero hardcoded secrets.

Create a `.env` file in the `server/` directory following the structure below:

```env
# Server Port
PORT=5000

# MongoDB Connection String
# Local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/dbdraw
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbdraw?retryWrites=true&w=majority

# JWT Authentication Secret & Lifespan
JWT_SECRET=your_jwt_secret_key_dbdraw_2026
JWT_EXPIRE=7d

# Initial Administrator Account (Used by seed script)
ADMIN_NAME=DbDraw Admin
ADMIN_EMAIL=admin@dbdraw.com
ADMIN_PASSWORD=Admin@DbDraw2026!
```

> **Security Note:** Never commit your `.env` file to version control. The `.gitignore` file is configured to exclude it.

---

## Installation

1. Clone your repository:
   ```bash
   git clone <YOUR_ACTUAL_REPOSITORY_LINK_HERE>
   cd dbDraw
   ```

2. Navigate to the `server/` directory:
   ```bash
   cd server
   ```

3. Install all dependencies:
   ```bash
   npm install
   ```

---

## Running the Server

### 1. Seed the Initial Administrator

To maintain security, the public signup endpoint does not allow administrative account registration. Run the idempotent database seeder to create your initial admin account:

```bash
npm run seed:admin
```

This will safely read `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env` file and create the admin record with `role: "admin"`.

### 2. Start in Development Mode (with hot-reloading)

```bash
npm run dev
```

### 3. Start in Production Mode

```bash
npm start
```

The server will initialize on `http://localhost:5000`.

---

## API Endpoints

All endpoints return uniform JSON responses adhering to the format:
- **Success:** `{ "success": true, "message": "...", ...data }`
- **Error:** `{ "success": false, "message": "..." }`

### Authentication Routes (`/api/auth`)

| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Public | Register standard user (forces `role: "user"`) |
| `POST` | `/api/auth/login` | Public | Authenticate credentials and return signed JWT |
| `POST` | `/api/auth/logout` | Authenticated | Stateless logout (client discards JWT token) |
| `GET` | `/api/auth/profile` | Authenticated | Get current authenticated user profile |
| `GET` | `/api/auth/check-user` | Authenticated User | Verify active standard user credentials |
| `GET` | `/api/auth/check-admin` | Authenticated Admin | Verify administrator privileges |

### User Management Routes (`/api/users`)

| HTTP Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/users/profile` | Authenticated | Get current authenticated user details |
| `GET` | `/api/users` | Admin Only | Get list of all registered users (passwords excluded) |

---

## Authentication & Authorization Architecture

### 1. Authentication Flow ("Who are you?")
- Users register via `/api/auth/signup`. Passwords are encrypted before persisting using `bcryptjs` with 10 salt rounds.
- During login (`/api/auth/login`), credentials are authenticated. Upon success, a signed JWT containing `{ userId, role }` is returned with a 7-day expiration.
- The `protect` middleware validates the Bearer token on protected endpoints, verifies signature/expiration, checks if the account is `active`, and populates `req.user`.

### 2. Role-Based Authorization ("What are you allowed to do?")
- The `authorizeRoles(...roles)` middleware restricts route access by role.
- If a standard `user` attempts to access an endpoint protected with `authorizeRoles('admin')`, the server immediately terminates the request with `403 Forbidden`:
  ```json
  {
    "success": false,
    "message": "Forbidden: User role 'user' is not authorized to access this resource."
  }
  ```

---

## User Roles & Status

- **Roles:**
  - `user`: Standard platform user with access to their own profile and design workflows.
  - `admin`: Platform administrator with access to user management, metrics, and administrative verification endpoints.
  - `moderator`: Reserved in model enum for upcoming moderation extensions.
- **Statuses:**
  - `active`: Account in good standing; authorized to authenticate.
  - `suspended`: Account temporarily or permanently deactivated; all authenticated requests are rejected with `403 Forbidden`.

---

## Postman Testing

A ready-to-use Postman Collection is provided in the repository root:
`DbDraw_Authentication_API.postman_collection.json`

### How to Import and Test:
1. Open Postman.
2. Click **Import** and select `DbDraw_Authentication_API.postman_collection.json`.
3. The collection is pre-configured with two folders:
   - **Authentication**: Contains User Signup, Login, Profile, Check User, and Logout.
   - **Admin**: Contains Admin Login, Admin Profile, Check Admin, Admin Get Users, and Authorization Test.
4. The test scripts automatically extract and store `userToken` and `adminToken` in collection variables upon login, allowing you to test all endpoints seamlessly.

---

## License

This project is developed for educational and academic purposes under the MCA curriculum.

## MongoDB + JWT setup

The app now uses MongoDB for project persistence and JWT for authentication. Project data is no longer persisted in browser localStorage; only the JWT session token and theme preference are kept client-side.

1. Create a MongoDB database (local MongoDB or MongoDB Atlas).
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI` and a random `JWT_SECRET` of at least 32 characters.
4. Install dependencies with `npm install`.
5. Start the app with `npm run dev`.

Authentication endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Project endpoints require `Authorization: Bearer <JWT>`:

- `POST /api/projects`
- `GET /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

Regular users can only access projects they own. Moderator/Administrator RBAC middleware is available in `backend/middleware/roleMiddleware.js` for future protected management routes.
