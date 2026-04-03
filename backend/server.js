import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { connectDB } from './db.js';
import Analysis from './models/Analysis.js';
import User from './models/User.js';
import { protect, optionalAuth } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// File upload setup (store in memory for quick processing)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System prompt for structured AI response
const AI_PROMPT = `You are an expert ATS (Applicant Tracking System) and senior recruiter.
Given a candidate's resume text and a job description, analyze how well they match.
You must return only a valid JSON response with the following structure, and nothing else (no markdown wrappers like \`\`\`json):
{
  "score": <number between 0 and 100 representing the match percentage>,
  "missing_skills": ["skill1", "skill2"],
  "feedback": {
    "suggestions": ["suggestion1", "suggestion2"],
    "ats_tips": ["tip1", "tip2"]
  }
}
`;

/**
 * Authentication Routes
 */
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email and password required" });
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User already exists" });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_cyber_ai', { expiresIn: '30d' });
        res.status(201).json({ token, id: user._id, email: user.email });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Registration failed" });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_cyber_ai', { expiresIn: '30d' });
            res.json({ token, id: user._id, email: user.email });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    } catch (e) {
        res.status(500).json({ error: "Login failed" });
    }
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = await bcrypt.hash(otp, 10);
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({ error: "Email provider not configured on server." });
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'RESUME AI: Password Reset OTP',
            text: `SYSTEM OVERRIDE INITIATED.\n\nYour Authorization OTP is: ${otp}\n\nThis OTP expires in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent to email" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to send email" });
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });
        
        if (!user || !user.resetOtp || !user.otpExpiry) return res.status(400).json({ error: "Invalid request" });
        if (Date.now() > user.otpExpiry) return res.status(400).json({ error: "OTP expired" });

        const isMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!isMatch) return res.status(400).json({ error: "Invalid OTP" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetOtp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (e) {
        res.status(500).json({ error: "Password reset failed" });
    }
});

/**
 * Endpoint to analyze resume and job description
 */
app.post('/api/analyze', optionalAuth, upload.single('resume'), async (req, res) => {
    try {
        const { job_description } = req.body;
        const file = req.file;

        if (!file || !job_description) {
            return res.status(400).json({ error: "Missing resume or job description" });
        }

        // 1. Extract text from PDF
        let resume_text = '';
        if (file.mimetype === 'application/pdf') {
            const pdfData = await pdfParse(file.buffer);
            resume_text = pdfData.text;
        } else if (file.originalname && file.originalname.toLowerCase().endsWith('.docx')) {
            const docxData = await mammoth.extractRawText({ buffer: file.buffer });
            resume_text = docxData.value;
        } else {
            // Basic fallback for pure text
            resume_text = file.buffer.toString('utf8');
        }

        // 2. Call AI API
        const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: [
                 { text: AI_PROMPT },
                 { text: `RESUME:\n${resume_text}\n\nJOB DESCRIPTION:\n${job_description}` }
             ],
             config: {
                 responseMimeType: 'application/json'
             }
        });
        const aiText = response.text;

        let aiResult;
        try {
            const startIdx = aiText.indexOf('{');
            const endIdx = aiText.lastIndexOf('}');
            if (startIdx !== -1 && endIdx !== -1) {
                aiResult = JSON.parse(aiText.substring(startIdx, endIdx + 1));
            } else {
                aiResult = JSON.parse(aiText);
            }
        } catch (e) {
            console.error("JSON Parsing Error from AI:", e);
            return res.status(500).json({ error: "AI returned invalid JSON", details: aiText });
        }

        // 3. Save to database
        const newAnalysis = await Analysis.create({
            userId: req.user ? req.user._id : undefined,
            resume_text,
            job_description,
            score: aiResult.score,
            missing_skills: aiResult.missing_skills,
            feedback: aiResult.feedback,
            ai_model: 'gemini'
        });
        
        // 4. Return result
        res.json({
            id: newAnalysis._id,
            score: newAnalysis.score,
            missing_skills: newAnalysis.missing_skills,
            feedback: newAnalysis.feedback,
            created_at: newAnalysis.created_at
        });

    } catch (err) {
        console.error("Analysis Error:", err);
        res.status(500).json({ error: err.message || "An error occurred during analysis" });
    }
});

/**
 * Endpoint to get history
 */
app.get('/api/history', protect, async (req, res) => {
    try {
        const history = await Analysis.find({ userId: req.user._id }).sort({ created_at: -1 }).limit(20);
        
        // Map History to match previous shape if needed
        const result = history.map(item => ({
            id: item._id,
            score: item.score,
            missing_skills: item.missing_skills,
            created_at: item.created_at,
            resume_text: item.resume_text,
            job_description: item.job_description,
            ai_model: item.ai_model || 'gemini'
        }));
        
        res.json(result);
    } catch (err) {
        console.error("History Error:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;
