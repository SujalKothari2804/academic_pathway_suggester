"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FormData, Recommendation, SubmitResponse } from "@/types";
import { getRecommendationDetails } from "@/lib/recommendation";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  BookOpen,
  Users,
  Award,
  RotateCcw,
  FlaskConical,
  ChevronRight,
} from "lucide-react";

const initialForm: FormData = {
  fullName: "",
  email: "",
  highestQualification: "",
  yearsOfExperience: "",
  currentProfession: "",
  careerGoal: "",
  interestedInResearch: false,
};

type PageState = "form" | "loading" | "result" | "error";

const qualifications = [
  "High School",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Other",
] as const;

const colorMap: Record<string, string> = {
  blue: "from-blue-500 to-blue-600",
  indigo: "from-indigo-500 to-indigo-600",
  purple: "from-purple-500 to-purple-600",
  amber: "from-amber-400 to-amber-500",
};

const bgColorMap: Record<string, string> = {
  blue: "bg-blue-50 border-blue-200",
  indigo: "bg-indigo-50 border-indigo-200",
  purple: "bg-purple-50 border-purple-200",
  amber: "bg-amber-50 border-amber-200",
};

const badgeVariantMap: Record<string, "blue" | "indigo" | "purple" | "amber"> = {
  blue: "blue",
  indigo: "indigo",
  purple: "purple",
  amber: "amber",
};

export default function HomePage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [pageState, setPageState] = useState<PageState>("form");
  const [result, setResult] = useState<{
    recommendation: Recommendation;
    aiReason: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};
    if (!form.fullName.trim()) errors.fullName = "Full name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errors.email = "Enter a valid email.";
    if (!form.highestQualification) errors.highestQualification = "Select your qualification.";
    if (form.yearsOfExperience === "") errors.yearsOfExperience = "Experience is required.";
    else if (Number(form.yearsOfExperience) < 0 || Number(form.yearsOfExperience) > 60)
      errors.yearsOfExperience = "Enter a value between 0 and 60.";
    if (!form.currentProfession.trim()) errors.currentProfession = "Current profession is required.";
    if (!form.careerGoal.trim()) errors.careerGoal = "Career goal is required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setPageState("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: SubmitResponse = await res.json();

      if (data.success && data.recommendation && data.aiReason) {
        setResult({ recommendation: data.recommendation, aiReason: data.aiReason });
        setPageState("result");
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setPageState("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setPageState("error");
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setResult(null);
    setFieldErrors({});
    setErrorMessage("");
    setPageState("form");
  };

  const recDetails = result ? getRecommendationDetails(result.recommendation) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="border-b border-white/60 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-sm">
              <GraduationCap className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-semibold text-slate-800 text-sm tracking-tight">
              Academic Pathway
            </span>
          </div>
          <a
            href="/submissions"
            className="text-xs text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
          >
            Admin Dashboard
            <ChevronRight size={14} />
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Hero */}
        {pageState === "form" && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-medium text-indigo-600 mb-5">
              <Sparkles size={12} />
              AI-Powered Recommendations
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
              Find Your Academic
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Pathway Forward
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Tell us about yourself and we&apos;ll match you with the right degree program — backed by intelligent recommendations.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-indigo-400" />
                <span>500+ students guided</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award size={14} className="text-indigo-400" />
                <span>4 program paths</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen size={14} className="text-indigo-400" />
                <span>Free & instant</span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {pageState === "form" && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Form header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-6">
                <h2 className="text-white font-semibold text-lg">Your Profile</h2>
                <p className="text-indigo-100 text-sm mt-0.5">
                  All fields marked with * are required
                </p>
              </div>

              <div className="px-8 py-8 space-y-6">
                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Full Name"
                    required
                    error={fieldErrors.fullName}
                  >
                    <Input
                      placeholder="e.g. Priya Sharma"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        if (fieldErrors.fullName)
                          setFieldErrors({ ...fieldErrors, fullName: undefined });
                      }}
                    />
                  </FormField>

                  <FormField label="Email Address" required error={fieldErrors.email}>
                    <Input
                      type="email"
                      placeholder="priya@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (fieldErrors.email)
                          setFieldErrors({ ...fieldErrors, email: undefined });
                      }}
                    />
                  </FormField>
                </div>

                {/* Qualification & Experience */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Highest Qualification"
                    required
                    error={fieldErrors.highestQualification}
                  >
                    <Select
                      value={form.highestQualification}
                      onValueChange={(val) => {
                        setForm({ ...form, highestQualification: val as FormData["highestQualification"] });
                        if (fieldErrors.highestQualification)
                          setFieldErrors({ ...fieldErrors, highestQualification: undefined });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualifications.map((q) => (
                          <SelectItem key={q} value={q}>
                            {q}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField
                    label="Years of Experience"
                    required
                    error={fieldErrors.yearsOfExperience}
                  >
                    <Input
                      type="number"
                      min={0}
                      max={60}
                      placeholder="e.g. 5"
                      value={form.yearsOfExperience}
                      onChange={(e) => {
                        setForm({ ...form, yearsOfExperience: e.target.value === "" ? "" : Number(e.target.value) });
                        if (fieldErrors.yearsOfExperience)
                          setFieldErrors({ ...fieldErrors, yearsOfExperience: undefined });
                      }}
                    />
                  </FormField>
                </div>

                {/* Profession */}
                <FormField
                  label="Current Profession"
                  required
                  error={fieldErrors.currentProfession}
                >
                  <Input
                    placeholder="e.g. Senior Software Engineer"
                    value={form.currentProfession}
                    onChange={(e) => {
                      setForm({ ...form, currentProfession: e.target.value });
                      if (fieldErrors.currentProfession)
                        setFieldErrors({ ...fieldErrors, currentProfession: undefined });
                    }}
                  />
                </FormField>

                {/* Career Goal */}
                <FormField
                  label="Career Goal"
                  required
                  error={fieldErrors.careerGoal}
                  hint="What do you want to achieve in the next 5–10 years?"
                >
                  <textarea
                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 resize-none"
                    placeholder="e.g. Lead a research lab, become a CTO, or start a business in EdTech"
                    rows={3}
                    value={form.careerGoal}
                    onChange={(e) => {
                      setForm({ ...form, careerGoal: e.target.value });
                      if (fieldErrors.careerGoal)
                        setFieldErrors({ ...fieldErrors, careerGoal: undefined });
                    }}
                  />
                </FormField>

                {/* Research Checkbox */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Checkbox
                    id="research"
                    checked={form.interestedInResearch}
                    onCheckedChange={(checked) =>
                      setForm({ ...form, interestedInResearch: !!checked })
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <Label
                      htmlFor="research"
                      className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-1.5"
                    >
                      <FlaskConical size={14} className="text-indigo-500" />
                      I am interested in Research Work
                    </Label>
                    <p className="text-xs text-slate-400 mt-0.5">
                      This helps us determine if a research-focused degree like PhD is right for you.
                    </p>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  size="lg"
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-md shadow-indigo-100 font-semibold"
                >
                  Get My Recommendation
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {pageState === "loading" && (
          <div className="max-w-md mx-auto text-center py-24 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">
              Analyzing Your Profile
            </h2>
            <p className="text-slate-500 leading-relaxed">
              Our AI is crafting a personalized recommendation just for you. This takes about 10 seconds…
            </p>
            <div className="flex justify-center gap-1.5 mt-8">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-300 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {pageState === "result" && result && recDetails && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Success Banner */}
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 mb-6">
              <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-green-800">Recommendation generated!</p>
                <p className="text-xs text-green-600">
                  Your profile has been saved. Check your results below.
                </p>
              </div>
            </div>

            {/* Recommendation Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
              {/* Gradient header */}
              <div className={`bg-gradient-to-r ${colorMap[recDetails.color]} px-8 py-8`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-1">
                      Recommended for {form.fullName.split(" ")[0]}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                      {result.recommendation}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">{recDetails.label}</p>
                  </div>
                  <Badge
                    variant={badgeVariantMap[recDetails.color]}
                    className="bg-white/20 text-white border-white/30 text-xs"
                  >
                    {recDetails.duration}
                  </Badge>
                </div>
              </div>

              {/* Details */}
              <div className="px-8 py-7 space-y-6">
                {/* About */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    About this program
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {recDetails.description}
                  </p>
                </div>

                {/* AI Reason */}
                <div className={`rounded-xl p-5 border ${bgColorMap[recDetails.color]}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-indigo-500" />
                    <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Why this is right for you
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    &ldquo;{result.aiReason}&rdquo;
                  </p>
                </div>

                {/* Profile Summary */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                    Your profile summary
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Experience", value: `${form.yearsOfExperience} years` },
                      { label: "Qualification", value: form.highestQualification },
                      { label: "Profession", value: form.currentProfession },
                      { label: "Research", value: form.interestedInResearch ? "Interested" : "Not interested" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-slate-50 rounded-lg px-3 py-2.5 border border-slate-100"
                      >
                        <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                        <p className="text-sm font-medium text-slate-700 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1 border-slate-200"
              >
                <RotateCcw size={14} />
                Start Over
              </Button>
              <Button
                onClick={() => (window.location.href = "/submissions")}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
              >
                View All Submissions
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Error */}
        {pageState === "error" && (
          <div className="max-w-md mx-auto text-center py-16 animate-fade-in">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">{errorMessage}</p>
            <Button onClick={() => setPageState("form")} variant="outline" className="mr-3">
              <RotateCcw size={14} />
              Go Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
            >
              Try Again
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-xs text-slate-400">
          Academic Pathway Recommendation Engine · Powered by Gemini AI & Supabase
        </div>
      </footer>
    </div>
  );
}

function FormField({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-slate-700 font-medium text-sm">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {hint && <p className="text-xs text-slate-400">{hint}</p>}
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
