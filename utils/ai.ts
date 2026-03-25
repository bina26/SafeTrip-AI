import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `You are a Tourist Safety Advisor specializing in localized, concise, and highly practical safety tips. 
Your goal is to help travelers stay safe by providing actionable advice about their surroundings, local scams, and best practices. 
Keep your responses brief and helpful.`;

export async function getSafetyAdvice(userMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview", // Using the specific model requested by the user
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching safety advice:", error);
    return "I'm having trouble connecting to my safety database right now. Please stay alert and stick to well-lit areas.";
  }
}
