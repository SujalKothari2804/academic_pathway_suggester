import { FormData, Recommendation } from "@/types";

export function getRecommendation(data: FormData): Recommendation {
  const experience = Number(data.yearsOfExperience);
  const researchInterest = data.interestedInResearch;
  const careerGoal = data.careerGoal.toLowerCase();

  // Rule 1: Experience >= 20 → Honorary Doctorate
  if (experience >= 20) {
    return "Honorary Doctorate";
  }

  // Rule 2: Research Interest = True AND Experience <= 5 → PhD
  if (researchInterest && experience <= 5) {
    return "PhD";
  }

  // Rule 3: Experience >= 8 → DBA
  if (experience >= 8) {
    return "DBA";
  }

  // Rule 4: Experience 5-7 → DBA or Certification based on career goal
  if (experience >= 5 && experience <= 7) {
    const dbaKeywords = ["management", "business", "leadership", "executive", "director", "admin", "administration", "mba", "dba", "corporate", "strategy", "operations", "finance", "consulting"];
    const wantsDba = dbaKeywords.some((kw) => careerGoal.includes(kw));
    return wantsDba ? "DBA" : "Certification Program";
  }

  // Rule 4: Experience 0-3 → Certification Program
  return "Certification Program";
}

export function getRecommendationDetails(rec: Recommendation): {
  label: string;
  description: string;
  duration: string;
  color: string;
} {
  const map = {
    "Certification Program": {
      label: "Certification Program",
      description: "Industry-recognized credentials to accelerate your early career growth.",
      duration: "6–12 months",
      color: "blue",
    },
    DBA: {
      label: "Doctor of Business Administration",
      description: "A professional doctorate blending advanced business theory with real-world application.",
      duration: "3–4 years",
      color: "indigo",
    },
    PhD: {
      label: "Doctor of Philosophy",
      description: "A research-intensive doctorate for those passionate about advancing knowledge.",
      duration: "4–6 years",
      color: "purple",
    },
    "Honorary Doctorate": {
      label: "Honorary Doctorate",
      description: "Awarded in recognition of your exceptional professional achievements and impact.",
      duration: "Lifetime recognition",
      color: "amber",
    },
  };
  return map[rec];
}
