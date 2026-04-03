import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    resume_text: {
        type: String,
        required: true
    },
    job_description: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    missing_skills: {
        type: [String],
        default: []
    },
    feedback: {
        type: Object,
        default: {}
    },
    ai_model: {
        type: String,
        default: 'gemini'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;
