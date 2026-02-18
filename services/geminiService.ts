
import { GoogleGenAI } from "@google/genai";
import { GenerationSettings } from "../types";
import { MODELS } from "../constants.tsx";

export const generateImage = async (prompt: string, settings: GenerationSettings): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API key is not configured.");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = settings.isPro ? MODELS.PRO : MODELS.FLASH;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: settings.aspectRatio,
          ...(settings.isPro && { imageSize: settings.imageSize }),
        },
      },
    });

    // Iterate through candidates and parts to find the image part
    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("No image generated.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response parts.");
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("PRO_KEY_REQUIRED");
    }
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
