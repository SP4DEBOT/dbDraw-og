import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ListChecks,
  Key,
  RefreshCw,
} from "lucide-react";
import { api } from "../../utils/api";

export const AIReviewModal = ({
  isOpen,
  onClose,
  project,
  isDarkMode,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleRunAudit = async () => {
    if (!project) {
      setError("No project is available for review.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setReviewData(null);

    try {
      const data = await api.reviewSchema({
        tables: project.tables || [],
        relationships: project.relationships || [],
        dialect: project.dialect || "PostgreSQL",
      });

      setReviewData(data);
    } catch (err) {
      console.error("AI Review Error:", err);

      setError(
        err?.message ||
          "Failed to perform automated schema audit."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;

    setError(null);
    setReviewData(null);
    onClose();
  };

  const getScoreClass = (score) => {
    if (score >= 85) {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400";
    }

    if (score >= 70) {
      return "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400";
    }

    return "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400";
  };

  const getIssueClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300";

      case "medium":
        return "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300";

      default:
        return "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300";
    }
  };

  return (
    <div
      id="ai-review-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* ================= HEADER ================= */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <div className="p-1.5 rounded-lg bg-emerald-500/10">
              <ShieldCheck size={18} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                dbDraw Schema Health & Normalization Audit
              </h2>

              <p className="text-[10px] text-slate-400 mt-0.5">
                AI-powered database structure analysis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition disabled:opacity-40"
            aria-label="Close schema review"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Initial State */}
          {!reviewData && !isLoading && !error && (
            <div className="text-center py-10 space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <ShieldCheck size={26} />
              </div>

              <div>
                <h3 className="font-bold text-base">
                  Audit {project?.tables?.length || 0} Tables &{" "}
                  {project?.relationships?.length || 0} Relationships
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  Verify 1NF, 2NF, and 3NF normalization standards,
                  identify orphan tables, detect unindexed foreign
                  keys, and receive database index suggestions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRunAudit}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition inline-flex items-center gap-2"
              >
                <ShieldCheck size={16} />
                <span>Run Schema Audit</span>
              </button>
            </div>
          )}

          {/* ================= LOADING ================= */}
          {isLoading && (
            <div className="text-center py-12 space-y-4">
              <Loader2
                size={32}
                className="animate-spin text-emerald-500 mx-auto"
              />

              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Evaluating your database schema...
                </p>

                <p className="text-[10px] text-slate-400 mt-1">
                  Checking normalization, relationships, indexes,
                  and referential integrity.
                </p>
              </div>
            </div>
          )}

          {/* ================= ERROR ================= */}
          {error && !isLoading && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center justify-between gap-4">
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={16}
                  className="shrink-0 mt-0.5"
                />

                <div>
                  <p className="font-semibold">
                    Schema review failed
                  </p>

                  <p className="mt-0.5 opacity-90">
                    {error}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAudit}
                className="text-xs underline font-semibold whitespace-nowrap"
              >
                Retry
              </button>
            </div>
          )}

          {/* ================= AUDIT RESULT ================= */}
          {reviewData && !isLoading && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Score + Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreClass(
                    Number(reviewData.overallScore) || 0
                  )}`}
                >
                  <span className="text-3xl font-extrabold font-mono">
                    {reviewData.overallScore ?? 0}/100
                  </span>

                  <span className="text-[11px] font-semibold uppercase tracking-wider mt-1">
                    Health Score
                  </span>
                </div>

                <div className="sm:col-span-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Executive Summary
                  </span>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {reviewData.summary ||
                      "No summary was returned by the AI reviewer."}
                  </p>
                </div>
              </div>

              {/* ================= NORMALIZATION ================= */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <ListChecks size={14} />
                  <span>
                    Relational Normalization Assessment
                  </span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
                    <span className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      1NF (Atomicity)
                    </span>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {reviewData.normalizationStatus
                        ?.firstNormalForm || "Passed"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
                    <span className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      2NF (Full Key)
                    </span>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {reviewData.normalizationStatus
                        ?.secondNormalForm || "Passed"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/50">
                    <span className="font-bold text-slate-600 dark:text-slate-300 block mb-1">
                      3NF (Transitive)
                    </span>

                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {reviewData.normalizationStatus
                        ?.thirdNormalForm || "Passed"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= ISSUES ================= */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Identified Optimization Items (
                  {reviewData.issues?.length || 0})
                </span>

                {reviewData.issues?.length > 0 ? (
                  <div className="space-y-2.5">
                    {reviewData.issues.map((issue, index) => (
                      <div
                        key={issue.id || index}
                        className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${getIssueClass(
                          issue.severity
                        )}`}
                      >
                        <div className="flex items-center justify-between gap-2 font-bold">
                          <span className="flex items-center gap-1.5">
                            <AlertTriangle size={13} />

                            {issue.title ||
                              "Schema optimization issue"}
                          </span>

                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                            {issue.severity || "info"}
                          </span>
                        </div>

                        <p className="text-[11px] opacity-90">
                          {issue.description ||
                            "No description provided."}
                        </p>

                        {issue.recommendation && (
                          <div className="pt-1 text-[11px] font-medium border-t border-black/10 dark:border-white/10">
                            💡 <strong>Fix:</strong>{" "}
                            {issue.recommendation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300">
                    No optimization issues were identified.
                  </div>
                )}
              </div>

              {/* ================= INDEXES ================= */}
              {reviewData.suggestedIndexes?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Key size={14} />

                    <span>
                      Recommended Secondary & Foreign Key Indexes
                    </span>
                  </span>

                  <pre
                    className={`p-3 rounded-xl border font-mono text-xs overflow-x-auto ${
                      isDarkMode
                        ? "bg-slate-950 border-slate-800 text-emerald-400"
                        : "bg-slate-900 border-slate-800 text-emerald-300"
                    }`}
                  >
                    {reviewData.suggestedIndexes.join("\n")}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <span className="text-xs text-slate-400 font-mono">
            {project?.tables?.length || 0} tables in scope
          </span>

          <div className="flex items-center gap-2">
            {reviewData && (
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition flex items-center gap-1.5 disabled:opacity-40"
              >
                <RefreshCw size={13} />
                <span>Re-Audit</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition disabled:opacity-40"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};