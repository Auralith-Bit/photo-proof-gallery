# Frameora Backend

REST API for **Frameora** — a photo-studio client gallery platform. Built with Node.js, Express 5, MongoDB (Mongoose), JWT authentication, Cloudinary for image storage, and Nodemailer for email delivery.

## Features

- **Authentication** — register, login, logout, session via access/refresh tokens in HTTP-only cookies, forgot/reset password with email delivery
- **Albums** — CRUD, archive/restore, cover photo, password protection, share links with token regeneration, client-access toggle, download permission
- **Photos** — upload to Cloudinary (multer single-image), list by album, delete, set as cover
- **Clients** — CRUD and archive/restore
- **Client Access** — public gallery endpoints resolved by access token, with password verification
- **Analytics** — aggregated studio stats
- **Settings** — profile, branding, preferences, security (change password), storage stats, activity feed, image upload
- **Security** — rate limiting on auth routes, bcrypt password hashing, CORS, cookie-parser

## Tech Stack

| Package | Purpose |
|---|---|
| express 5 | HTTP framework |
| mongoose 9 | MongoDB ODM |
| jsonwebtoken | JWT sign/verify |
| bcryptjs | Password hashing |
| multer | File upload handling |
| cloudinary | Image storage |
| nodemailer | Email (password reset) |
| express-rate-limit | Brute-force protection |
| cookie-parser / cors / dotenv | Middleware & config |

## Project Structure

```
backend/
└── src/
    ├── server.js          # Entry point — connects DB, starts HTTP server
    ├── app.js             # Express app, CORS, routes, health check
    ├── config/            # env config, DB connection, Cloudinary setup
    ├── controllers/       # Request handlers (one per domain)
    ├── services/          # Business logic
    ├── models/            # Mongoose schemas (User, Album, Photo, Client)
    ├── routes/            # Route definitions
    ├── middlewares/       # auth (JWT) and upload (multer)
    └── utils/             # Helpers
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally (or an Atlas connection string)
- Cloudinary account (for image uploads)
- Gmail account + App Password (for email sending)

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` root:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/FRAMEORA
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
FRONTEND_URL=http://localhost:5173
```

### Run

```bash
# Development (nodemon)
npm run dev

# Production
npm start
```

The server connects to MongoDB first, then starts listening. Health check:

```bash
curl http://localhost:3000/api/health
```

## API Overview

Base paths: each domain is mounted on both `/api/v1/<domain>` and `/api/<domain>`.

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | – | Service health check |

### Auth — `/api/auth`

| Method | Endpoint | Rate Limit | Description |
|---|---|---|---|
| POST | `/register` | 5/hour/IP | Create account |
| POST | `/login` | 10/15min/IP | Login, sets cookies |
| POST | `/logout` | – | Clear auth cookies |
| GET | `/me` | JWT | Current user |
| POST | `/forgot-password` | 30/15min/IP | Send reset email |
| POST | `/reset-password` | – | Reset with token |

### Albums — `/api/albums` (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List albums |
| POST | `/` | Create album |
| GET | `/:id` | Album details |
| PATCH | `/:id` | Update album |
| DELETE | `/:id` | Delete album |
| POST | `/:id/archive` | Archive album |
| POST | `/:id/restore` | Restore album |
| PATCH | `/:id/access` | Enable/disable client access |
| PATCH | `/:id/downloads` | Toggle download permission |
| PUT | `/:id/password` | Set gallery password |
| DELETE | `/:id/password` | Remove password |
| POST | `/:id/regenerate-link` | New access token |
| GET | `/:albumId/photos` | List album photos |
| POST | `/:albumId/photos` | Upload photo (multipart, `image` field) |
| DELETE | `/:albumId/photos/:photoId` | Delete photo |
| PUT | `/:albumId/cover/:photoId` | Set cover photo |

### Clients — `/api/clients` (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List clients |
| POST | `/` | Create client |
| GET | `/:id` | Client details |
| PATCH | `/:id` | Update client |
| DELETE | `/:id` | Delete client |
| POST | `/:id/archive` | Archive client |
| POST | `/:id/restore` | Restore client |

### Client Access — `/api/a` (public)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/:accessToken` | Resolve album by token |
| POST | `/:accessToken/verify` | Verify gallery password |

### Analytics — `/api/analytics` (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Aggregated studio analytics |

### Settings — `/api/settings` (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | All settings |
| GET/PUT | `/profile` | Photographer profile |
| GET/PUT | `/branding` | Branding (logo, colors) |
| GET/PUT | `/preferences` | Preferences |
| GET/PUT | `/security` | Security options |
| POST | `/change-password` | Change password |
| GET | `/storage` | Storage usage |
| GET | `/activity` | Activity log |
| POST | `/upload-image` | Upload image (multipart, `image` field) |

## Authentication

JWT-based auth using HTTP-only cookies (requires `credentials: true` on the frontend fetch/axios config). Send cookies with requests after login.

## Notes

- CORS allows localhost origins (5173, 3000, 5000).
- No test suite yet — `npm test` is a placeholder.
