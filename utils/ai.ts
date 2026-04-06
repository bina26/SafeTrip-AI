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

export interface RiskZone {
  id: string;
  title: string;
  description: string;
  risk: "high" | "medium" | "low";
  lat: number;
  lng: number;
  radius: number;
}

export async function getRiskZones(lat: number, lng: number): Promise<RiskZone[]> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview",
    });

    const prompt = `Return a raw JSON array of exactly 4 safety zones near the coordinates lat: ${lat}, lng: ${lng}.
Do not use any markdown formatting, code blocks or fences like \`\`\`json. Just return the JSON array.
Each object must have the following properties:
- id (string)
- title (string)
- description (string)
- risk (string: exactly one of "high", "medium", or "low")
- lat (number: latitude near the given coordinates)
- lng (number: longitude near the given coordinates)
- radius (number: between 200 and 600)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Strip markdown code fences if present
    text = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

    return JSON.parse(text) as RiskZone[];
  } catch (error) {
    console.error("Error fetching risk zones:", error);
    return [
      {
        id: "fallback-1",
        title: "High Risk Zone",
        description: "Increased incidents reported in this vicinity",
        risk: "high",
        lat: lat + 0.015,
        lng: lng + 0.01,
        radius: 400
      },
      {
        id: "fallback-2",
        title: "Risk Advisory",
        description: "Stay on well-lit main streets tonight",
        risk: "medium",
        lat: lat - 0.02,
        lng: lng - 0.015,
        radius: 600
      }
    ];
  }
}
