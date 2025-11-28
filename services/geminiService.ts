import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartSearchResponse = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an AI assistant built into a web browser. The user typed: "${query}". 
      If this looks like a factual question, answer it concisely (max 2 sentences). 
      If it looks like a navigation intent (e.g., "youtube", "news"), suggest the best URL.
      If it is a general chat, respond briefly and friendly.
      Keep it short and plain text.`,
    });
    return response.text || "No response available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not reach AI services.";
  }
};

export const analyzePageContent = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following web page content in 3 bullet points:\n\n${text.substring(0, 5000)}`,
    });
    return response.text || "Could not analyze page.";
  } catch (error) {
    return "Analysis failed.";
  }
};