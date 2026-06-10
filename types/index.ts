export type Qualification =
  | "High School"
  | "Diploma"
  | "Bachelor's"
  | "Master's"
  | "PhD"
  | "Other";

export type Recommendation =
  | "Certification Program"
  | "DBA"
  | "PhD"
  | "Honorary Doctorate";

export interface FormData {
  fullName: string;
  email: string;
  highestQualification: Qualification | "";
  yearsOfExperience: number | "";
  currentProfession: string;
  careerGoal: string;
  interestedInResearch: boolean;
}

export interface Submission {
  id: string;
  full_name: string;
  email: string;
  qualification: string;
  years_experience: number;
  profession: string;
  career_goal: string;
  interested_research: boolean;
  recommendation: Recommendation;
  ai_reason: string;
  created_at: string;
}

export interface SubmitResponse {
  success: boolean;
  recommendation?: Recommendation;
  aiReason?: string;
  error?: string;
}
