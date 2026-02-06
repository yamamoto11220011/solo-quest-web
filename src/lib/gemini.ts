import { GoogleGenerativeAI } from "@google/generative-ai";
import type { QuestLog } from "./db";

export async function generateWeeklyReport(apiKey: string, logs: QuestLog[]) {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using gemini-1.5-flash for speed/cost balance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Role: You are a hard-boiled military tactician/instructor (Solider style).
    Task: Analyze the user's quest logs for the past week and provide feedback.
    
    Data:
    ${JSON.stringify(logs.map(l => ({
        title: l.title,
        duration: l.durationMinutes,
        exp: l.earnedExp,
        reflection: l.reflection,
        date: l.completedAt
    })))}
    
    Instructions:
    1. Be strict but motivating. Use military terminologies.
    2. Analyze the 'reflection' specifically if provided.
    3. Output in Markdown format with headers.
    
    Format:
    ## Mission Status Report
    (Summary of performance)
    
    ## Tactical Analysis
    (Strengths and Weaknesses observed)
    
    ## Next Directives
    (Actionable advice)
  `;

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Generation Error", error);
        throw error;
    }
}
