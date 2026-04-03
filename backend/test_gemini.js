import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            { text: "Reply with 'Hello'" }
        ]
    });
    console.log("Success:", response.text);
  } catch (err) {
    console.error("Gemini Error:", err);
  }
}
test();
