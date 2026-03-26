import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are an expert Teaching Assistant for 2nd Year, 2nd Semester Engineering students.
Your name is 'LabBot'.
You specialize in Computer Science topics like Algorithms, Operating Systems, Databases, and Digital Logic.
Provide clear, concise, and academic explanations.
If asked for code, provide clean, commented examples in C++, Java, Python, or SQL as appropriate.
Be encouraging and helpful.
`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    if (!apiKey) {
      return "Error: API Key is missing. Please check your environment configuration.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the lab server (Gemini API). Please try again.";
  }
};
