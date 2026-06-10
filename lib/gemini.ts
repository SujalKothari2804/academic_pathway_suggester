import { GoogleGenerativeAI } from "@google/generative-ai";
import { FormData, Recommendation } from "@/types";

export async function generateAIReason(
  formData: FormData,
  recommendation: Recommendation
): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an academic counselor at a prestigious institution. A student has submitted their profile and you have recommended an academic pathway. Write a warm, personalized, and encouraging explanation (3-4 sentences) for why this recommendation fits them perfectly. Be specific about their background and how it connects to the recommendation.

Student Profile:
- Name: ${formData.fullName}
- Highest Qualification: ${formData.highestQualification}
- Years of Experience: ${formData.yearsOfExperience}
- Current Profession: ${formData.currentProfession}
- Career Goal: ${formData.careerGoal}
- Interested in Research: ${formData.interestedInResearch ? "Yes" : "No"}

Recommendation: ${recommendation}

Write the explanation in second person ("you", "your"). Do not include any headings, bullet points, or formatting — just flowing prose. Do not mention the specific rules or scoring — just explain why this path is right for them personally.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text.trim();
  } catch (error) {
    console.error("Gemini API error:", error);
    // Fallback reason if Gemini fails
    return `Based on your ${formData.yearsOfExperience} years of experience as a ${formData.currentProfession} and your goal to ${formData.careerGoal}, a ${recommendation} is the ideal next step to elevate your career and achieve your professional ambitions.`;
  }
}
