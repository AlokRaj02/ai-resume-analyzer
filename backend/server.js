import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import Anthropic from '@anthropic-ai/sdk';
import { connectDB } from './db.js';
import Analysis from './models/Analysis.js';

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

// Initialize Gemini and Claude API clients
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });

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
        const { job_description, model } = req.body;
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
        let aiText = '';
        if (model === 'claude') {
            const msg = await anthropic.messages.create({
                model: "claude-3-haiku-20240307",
                max_tokens: 1500,
                temperature: 0.1,
                system: AI_PROMPT,
                messages: [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": `RESUME:\n${resume_text}\n\nJOB DESCRIPTION:\n${job_description}`
                            }
                        ]
                    }
                ]
            });
            aiText = msg.content[0].text;
        } else {
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
            aiText = response.text;
        }

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
            resume_text,
            job_description,
            score: aiResult.score,
            missing_skills: aiResult.missing_skills,
            feedback: aiResult.feedback,
            ai_model: model === 'claude' ? 'claude' : 'gemini'
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;
