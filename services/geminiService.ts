
import { GoogleGenAI } from "@google/genai";

// Fix: Use process.env.API_KEY directly in constructor and handle text property correctly
export const generateProfessionalDescription = async (basicDesc: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Transform this simple logistics item description into a professional logistics entry for a Bilty (Lorry Receipt): "${basicDesc}". Keep it concise, under 10 words.`,
    });
    
    // Fix: Access .text property directly (it's not a method)
    return response.text?.trim() || basicDesc;
  } catch (error) {
    console.error("Gemini Error:", error);
    return basicDesc;
  }
};

export const suggestTerms = async (cargoType: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 2 professional transport terms or conditions for cargo type: "${cargoType}". Format as a short bulleted list.`,
    });
    
    // Fix: Access .text property directly (it's not a method)
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "";
  }
};
