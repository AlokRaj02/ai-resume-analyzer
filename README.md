# AI Resume Analyzer 🚀

AI Resume Analyzer is a semantic applicant tracking evaluation engine. Built using a Node.js/Express backend and a React/Vite frontend, it processes candidate resumes (PDF, DOCX) and matches them against target job descriptions using Google Gemini AI, calculating synergy probability and suggesting real-time ATS bypass tips.

---

## 🛠️ Tech Stack

* **Frontend**: React (v19), Vite, Vanilla CSS, Lucide Icons, html2pdf.js (for exporting results)
* **Backend**: Node.js, Express, Mongoose (MongoDB ODM)
* **AI Engine**: Google Gemini API (`gemini-2.5-flash` via `@google/genai`)
* **Parsing**: `pdf-parse` (PDF extraction), `mammoth` (Word/DOCX text extraction)
* **Authentication**: JWT (JSON Web Tokens), bcryptjs (password hashing), Nodemailer (Gmail SMTP for OTP password reset)

---

## 🔑 Environment Variables Reference

Create a `.env` file inside the `backend/` directory to configure the application locally:

```env
PORT=5001
MONGODB_URI="mongodb://127.0.0.1:27017/resume_analyzer"
GEMINI_API_KEY="your-gemini-api-key"
JWT_SECRET="your-secure-jwt-secret-key"

# Optional: Password Reset via Gmail SMTP
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-16-character-google-app-password"
```

---

## ⚙️ Local Setup Instructions

### 1. Clone the repository and navigate to the project
```bash
cd ai-resume-analyzer
```

### 2. Set Up the Backend
Navigate to the `backend` folder, install dependencies, and start the development server:
```bash
cd backend
npm install
npm start
```
*The backend server will run locally on `http://localhost:5001`.*

### 3. Set Up the Frontend
Open a new terminal window, navigate to the `frontend` folder, install dependencies, and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend interface will open on `http://localhost:5173`.*

---

## ☁️ Deployment Guide

### 📦 Backend (Render.com)
1. Create a new **Web Service** on Render and connect your GitHub repository.
2. Configure the settings:
   * **Root Directory**: `backend`
   * **Build Command**: `npm install`
   * **Start Command**: `npm start`
3. In the **Environment** tab, add your environment variables:
   * `MONGODB_URI` (remote MongoDB Atlas link)
   * `GEMINI_API_KEY`
   * `JWT_SECRET`
   * `EMAIL_USER` & `EMAIL_PASS` (optional, for OTP resets)

### 🎨 Frontend & API rewrites (Vercel)
The project includes a `vercel.json` configuration file at the root, enabling Vercel to build the static React frontend and route `/api/*` endpoints to the backend:
1. Import your project repository into Vercel.
2. In your Project Settings under **Environment Variables**, add the backend credentials:
   * `MONGODB_URI`
   * `GEMINI_API_KEY`
   * `JWT_SECRET`
   * `EMAIL_USER` & `EMAIL_PASS` (optional)
3. Deploy the project. Vercel will build the frontend assets and automatically run serverless routing for the backend API.
