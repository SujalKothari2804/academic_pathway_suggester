"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Submission, Recommendation } from "@/types";
import {
  GraduationCap,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Users,
  TrendingUp,
  FlaskConical,
  Calendar,
  Loader2,
  ArrowLeft,
  Filter,
} from "lucide-react";

const recommendations: Recommendation[] = [
  "Certification Program",
  "DBA",
  "PhD",
  "Honorary Doctorate",
];

const recColors: Record<Recommendation, string> = {
  "Certification Program": "blue",
  DBA: "indigo",
  PhD: "purple",
  "Honorary Doctorate": "amber",
};

const recBadgeVariant: Record<Recommendation, "blue" | "indigo" | "purple" | "amber"> = {
  "Certification Program": "blue",
  DBA: "indigo",
  PhD: "purple",
  "Honorary Doctorate": "amber",
};

interface ApiResponse {
  success: boolean;
  data: Submission[];
  total: number;
  page: number;
  totalPages: number;
  error?: string;
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRec, setFilterRec] = useState<Recommendation | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "15",
        ...(search && { search }),
        ...(filterRec && { recommendation: filterRec }),
      });
      const res = await fetch(`/api/submissions?${params}`);
      const data: ApiResponse = await res.json();
      if (data.success) {
        setSubmissions(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotal(data.total || 0);
      } else {
        setError(data.error || "Failed to load submissions.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, search, filterRec]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);



  const stats = {
    total,
    research: submissions.filter((s) => s.interested_research).length,
    topRec:
      submissions.length > 0
        ? Object.entries(
            submissions.reduce((acc, s) => {
              acc[s.recommendation] = (acc[s.recommendation] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).sort((a, b) => b[1] - a[1])[0]?.[0]
        : "—",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
              <GraduationCap className="text-white" size={18} />
            </div>
            <div>
              <h1 className="font-semibold text-slate-800 text-sm">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">All Submissions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/")}
              className="text-slate-500 text-xs"
            >
              <ArrowLeft size={14} />
              Home
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSubmissions}
              disabled={loading}
              className="text-xs"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <RefreshCw size={14} />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<Users size={18} className="text-indigo-500" />}
            label="Total Submissions"
            value={total}
            bg="bg-indigo-50"
          />
          <StatCard
            icon={<FlaskConical size={18} className="text-purple-500" />}
            label="Research Interest"
            value={`${submissions.filter((s) => s.interested_research).length} / ${submissions.length}`}
            bg="bg-purple-50"
          />
          <StatCard
            icon={<TrendingUp size={18} className="text-blue-500" />}
            label="Top Recommendation"
            value={stats.topRec}
            bg="bg-blue-50"
            small
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Search by name, email, or profession…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400 flex-shrink-0" />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setFilterRec("");
                    setPage(1);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    filterRec === ""
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                  }`}
                >
                  All
                </button>
                {recommendations.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setFilterRec(filterRec === r ? "" : r);
                      setPage(1);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      filterRec === r
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table / Cards */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Loading submissions…</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm mb-3">{error}</p>
            <Button onClick={fetchSubmissions} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
            <GraduationCap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm font-medium">No submissions yet</p>
            <p className="text-slate-300 text-xs mt-1">
              {search || filterRec ? "Try adjusting your filters." : "Be the first to submit a profile!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <SubmissionCard
                key={s.id}
                submission={s}
                expanded={expandedId === s.id}
                onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs text-slate-400">
              Page {page} of {totalPages} · {total} total
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={14} />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  bg,
  small,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bg: string;
  small?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5">
      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className={`font-bold text-slate-800 ${small ? "text-base" : "text-2xl"}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

function SubmissionCard({
  submission: s,
  expanded,
  onToggle,
}: {
  submission: Submission;
  expanded: boolean;
  onToggle: () => void;
}) {
  const rec = s.recommendation as Recommendation;
  return (
    <div
      className="bg-white rounded-xl border border-slate-100 overflow-hidden transition-all duration-200 hover:border-indigo-100 hover:shadow-sm"
    >
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {s.full_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-medium text-slate-800 text-sm truncate">{s.full_name}</p>
            {s.interested_research && (
              <FlaskConical size={12} className="text-purple-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-slate-400 truncate">
            {s.email} · {s.profession}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Badge variant={recBadgeVariant[rec] || "default"} className="text-xs hidden sm:flex">
            {s.recommendation}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar size={11} />
            <span>{new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </div>
          <ChevronRight
            size={14}
            className={`text-slate-300 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
          />
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-50 px-5 pb-5 pt-4 animate-fade-in">
          <Badge variant={recBadgeVariant[rec] || "default"} className="text-xs mb-4 sm:hidden">
            {s.recommendation}
          </Badge>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: "Qualification", value: s.qualification },
              { label: "Experience", value: `${s.years_experience} yrs` },
              { label: "Research", value: s.interested_research ? "Yes" : "No" },
              { label: "Submitted", value: new Date(s.created_at).toLocaleDateString("en-IN") },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm font-medium text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mb-3">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Career Goal
            </p>
            <p className="text-sm text-slate-600">{s.career_goal}</p>
          </div>
          {s.ai_reason && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <GraduationCap size={11} /> AI Reason
              </p>
              <p className="text-sm text-slate-600 leading-relaxed italic">&ldquo;{s.ai_reason}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
