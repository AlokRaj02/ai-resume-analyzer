# AI Resume Analyzer Authentication & Tokens Documentation

This document describes the authentication mechanisms, API routes, token systems, and configuration variables used in the **AI Resume Analyzer** project.

---

## 1. Authentication Mechanisms

The project implements a custom authentication system with JSON Web Tokens (JWT) and a secure Password Reset mechanism utilizing One-Time Passwords (OTP).

### Flow Architecture

1. **User Registration & Login**:
   - Passwords are encrypted before database insertion using **bcryptjs** (with salt factor 10).
   - Upon successful credentials verification, a **JSON Web Token (JWT)** is issued to the client.
2. **Session Persistence**:
   - The token is stored in the browser's `localStorage` (via React context) and injected into the default headers of all outgoing Axios requests:
     ```javascript
     Authorization: Bearer <token>
     ```
3. **Route Protection & Guest Mode**:
   - Backend API endpoints use Express middleware (`optionalAuth` and `protect`) to authenticate requests.
   - `/api/analyze` uses `optionalAuth`: it links the generated report to the user's account if a valid token is provided, but still permits guest/unauthenticated analysis.
   - `/api/history` uses `protect`: it strictly demands a valid token and denies access with a `401 Unauthorized` code otherwise.

---

## 2. API Authentication Endpoints

All authentication endpoints are prefixed with `/api/auth` and handled in [server.js](file:///Users/alok/Desktop/ai-resume-analyzer/backend/server.js):

| Endpoint | Method | Protected? | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | No | Registers a new user. Expects `{ username, email, dob, password, phone_number }`. Returns a JWT token. |
| `/api/auth/login` | `POST` | No | Authenticates credentials. Expects `{ email, password }`. Returns a JWT token. |
| `/api/auth/forgot-password` | `POST` | No | Generates a 6-digit verification OTP and emails it via Nodemailer. Stores the hashed OTP and expiration timestamp on the user document. |
| `/api/auth/reset-password` | `POST` | No | Validates the OTP against the stored hash and sets a new password if valid and not expired. |

---

## 3. Tokens & Cryptographic Keys

The application depends on the following secrets and tokens, configured in [backend/.env](file:///Users/alok/Desktop/ai-resume-analyzer/backend/.env):

### A. JWT_SECRET
* **Purpose**: Used by the backend to sign JWT payloads during user registration/login, and to verify the signature of tokens attached to request headers.
* **Fallback Behavior**: If not configured in `.env`, the system defaults to `'fallback_secret_cyber_ai'`.
* **Example Generation**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### B. GEMINI_API_KEY
* **Purpose**: Authenticates the backend to the Google Gemini AI API via the `@google/genai` library (specifically targeting `gemini-2.5-flash`).
* **Usage Location**: Initialized in [server.js](file:///Users/alok/Desktop/ai-resume-analyzer/backend/server.js#L38):
  ```javascript
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  ```

### C. MONGODB_URI
* **Purpose**: Connection string to the MongoDB cluster.
* **Local Fallback**: `mongodb://127.0.0.1:27017/resume_analyzer`
* **Production/Atlas**: Remote Cluster URI containing authentication credentials (e.g., username, password, and host).

### D. EMAIL_USER & EMAIL_PASS
* **Purpose**: Authentication credentials (SMTP Username and App Password) for Gmail, used to send password reset OTPs.
* **Required Action**: If deploying, you must enable **2-Step Verification** on Gmail and generate an **App Password** to use as `EMAIL_PASS`.

---

## 4. Frontend Authentication Context

Authentication state is managed globally on the frontend using [AuthContext.jsx](file:///Users/alok/Desktop/ai-resume-analyzer/frontend/src/context/AuthContext.jsx).

- It exports an `AuthContext` providing `user`, `login()`, `logout()`, and `register()`.
- It monitors the state of `localStorage.getItem('token')`.
- On state change, it configures Axios default headers:
  ```javascript
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  ```
