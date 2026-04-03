import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
dotenv.config();

const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY });
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

async function test() {
    try {
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
                            "text": `RESUME:\nTest Resume Content React Node.js AWS\n\nJOB DESCRIPTION:\nSenior React Developer`
                        }
                    ]
                }
            ]
        });
        console.log("Claude Response Length:", msg.content[0].text.length);
        console.log("Claude Response Text:", msg.content[0].text);
    } catch(err) {
        console.error("Claude API Error:", err.message);
        if (err.error) console.error(err.error);
    }
}
test();
