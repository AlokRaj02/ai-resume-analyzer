import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { connectDB } from './db.js';
import Analysis from './models/Analysis.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
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
 * Endpoint to analyze resume and job description
 */
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
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
        } else {
            // Basic fallback for pure text (doc extraction needs deeper libs, let's limit to PDF/Text here)
            resume_text = file.buffer.toString('utf8');
        }

        // 2. Call AI API
        const response = await ai.models.generateContent({
             model: 'gemini-2.5-flash',
             contents: [
                 { text: AI_PROMPT },
                 { text: `RESUME:\\n${resume_text}\\n\\nJOB DESCRIPTION:\\n${job_description}` }
             ],
             config: {
                 responseMimeType: 'application/json'
             }
        });

        const aiText = response.text;
        let aiResult;
        try {
            aiResult = JSON.parse(aiText);
        } catch (e) {
            return res.status(500).json({ error: "AI returned invalid JSON", details: aiText });
        }

        // 3. Save to database
        const newAnalysis = await Analysis.create({
            resume_text,
            job_description,
            score: aiResult.score,
            missing_skills: aiResult.missing_skills,
            feedback: aiResult.feedback
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
        res.status(500).json({ error: "An error occurred during analysis" });
    }
});

/**
 * Endpoint to get history
 */
app.get('/api/history', async (req, res) => {
    try {
        const history = await Analysis.find().sort({ created_at: -1 }).limit(20);
        
        // Map History to match previous shape if needed
        const result = history.map(item => ({
            id: item._id,
            score: item.score,
            missing_skills: item.missing_skills,
            created_at: item.created_at
        }));
        
        res.json(result);
    } catch (err) {
        console.error("History Error:", err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
