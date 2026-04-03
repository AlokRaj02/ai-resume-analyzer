import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import Analysis from './models/Analysis.js';

dotenv.config();

const run = async () => {
    await connectDB();
    await Analysis.create({
        resume_text: "Mock Claude Resume Content",
        job_description: "Mock Job Description",
        score: 95,
        missing_skills: ["AWS", "Docker"],
        feedback: { suggestions: ["Add AWS exp"], ats_tips: ["Use action verbs"] },
        ai_model: "claude"
    });
    console.log("Inserted Claude mock");
    process.exit(0);
};

run();
