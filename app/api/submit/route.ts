import { NextRequest, NextResponse } from "next/server";
import { getRecommendation } from "@/lib/recommendation";
import { generateAIReason } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabase";
import { FormData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const formData: FormData = body;

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.highestQualification ||
      formData.yearsOfExperience === "" ||
      !formData.currentProfession ||
      !formData.careerGoal
    ) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Validate experience range
    const experience = Number(formData.yearsOfExperience);
    if (isNaN(experience) || experience < 0 || experience > 60) {
      return NextResponse.json(
        { success: false, error: "Years of experience must be between 0 and 60." },
        { status: 400 }
      );
    }

    // Step 1: Get deterministic recommendation
    const recommendation = getRecommendation(formData);

    // Step 2: Generate personalized AI explanation (Gemini)
    const aiReason = await generateAIReason(formData, recommendation);

    // Step 3: Save to Supabase
    const supabase = supabaseAdmin();
    const { error: dbError } = await supabase.from("submissions").insert({
      full_name: formData.fullName,
      email: formData.email,
      qualification: formData.highestQualification,
      years_experience: experience,
      profession: formData.currentProfession,
      career_goal: formData.careerGoal,
      interested_research: formData.interestedInResearch,
      recommendation,
      ai_reason: aiReason,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Still return the recommendation even if DB fails
      return NextResponse.json({
        success: true,
        recommendation,
        aiReason,
        warning: "Recommendation generated but could not be saved.",
      });
    }

    return NextResponse.json({ success: true, recommendation, aiReason });
  } catch (error) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
