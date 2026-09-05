import React, { useState } from "react";
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import { api } from "../../utils/api";

const EXAMPLE_PROMPTS = [
  "E-commerce marketplace with buyers, sellers, inventory, orders, reviews, and Stripe payments",
  "SaaS project management tool with workspaces, teams, task boards, comments, and file attachments",
  "Hospital management system with patients, doctors, appointments, medical records, and billing",
  "University LMS with courses, modules, students, professors, enrollments, and quiz submissions",
];

export const AIGenerateModal = ({
  isOpen,
  onClose,
  onApplyGeneratedSchema,
  dialect,
  isDarkMode,
}) => {
  // Hooks must always run before the conditional return.
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleGenerate = async (selectedPrompt) => {
    const textToUse = selectedPrompt || prompt;

    if (!textToUse.trim()) {
      setError("Please describe the database you want to generate.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.generateSchema({
        prompt: textToUse.trim(),
        dialect,
      });

      setResult(data);
    } catch (err) {
      console.error("AI Generate Error:", err);

      setError(
        err?.message ||
          "Something went wrong while generating the database schema."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;

    onApplyGeneratedSchema(result);
    onClose();

    // Reset after applying.
    setPrompt("");
    setResult(null);
    setError(null);
  };

  const handleClose = () => {
    if (isLoading) return;

    setError(null);
    setResult(null);
    setPrompt("");
    onClose();
  };

  return (
    <div
      id="ai-generate-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* ================= HEADER ================= */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between ${
            isDarkMode
              ? "border-slate-800"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <Sparkles size={18} />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                dbDraw AI Schema Architect
              </h2>

              <p className="text-[10px] text-slate-400 mt-0.5">
                Describe your system and let AI design the schema
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition disabled:opacity-40"
            aria-label="Close AI schema generator"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Prompt */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
              Describe your application or database requirements in natural
              language:
            </label>

            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                setError(null);
              }}
              disabled={isLoading}
              placeholder="e.g. Build an analytics platform tracking events, visitors, conversions, funnels, and retention metrics..."
              className={`w-full p-3 text-xs rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-purple-500 resize-none transition ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                  : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400"
              } disabled:opacity-60`}
            />

            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-slate-400">
                Be specific about entities, relationships, and requirements.
              </span>

              <span className="text-[10px] text-slate-400">
                {prompt.length} chars
              </span>
            </div>
          </div>

          {/* ================= QUICK PROMPTS ================= */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Or Try A Preset Architecture:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setPrompt(example);
                    handleGenerate(example);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition flex items-start gap-2 ${
                    isDarkMode
                      ? "bg-slate-800/60 border-slate-700/60 hover:border-purple-500/60 text-slate-300"
                      : "bg-slate-50 border-slate-200 hover:border-purple-400 text-slate-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Wand2
                    size={13}
                    className="text-purple-500 shrink-0 mt-0.5"
                  />

                  <span className="line-clamp-2">{example}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ================= LOADING ================= */}
          {isLoading && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                isDarkMode
                  ? "bg-purple-500/10 border-purple-500/20"
                  : "bg-purple-50 border-purple-100"
              }`}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-500/10">
                <Loader2
                  size={18}
                  className="text-purple-500 animate-spin"
                />
              </div>

              <div>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  Synthesizing database schema...
                </p>

                <p className="text-[10px] text-slate-400 mt-0.5">
                  AI is analyzing your requirements and creating tables and
                  relationships.
                </p>
              </div>
            </div>
          )}

          {/* ================= ERROR ================= */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />

              <div>
                <p className="font-semibold">Generation failed</p>
                <p className="mt-0.5 opacity-90">{error}</p>
              </div>
            </div>
          )}

          {/* ================= RESULT ================= */}
          {result && !isLoading && (
            <div className="space-y-3 pt-2">
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isDarkMode
                    ? "bg-purple-500/10 border-purple-500/20"
                    : "bg-purple-50 border-purple-100"
                }`}
              >
                {/* Result Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2
                        size={16}
                        className="text-green-500"
                      />

                      <span className="font-bold text-sm text-purple-600 dark:text-purple-400">
                        {result.schemaName || "Generated Schema"}
                      </span>
                    </div>

                    {result.description && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                        {result.description}
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold whitespace-nowrap">
                    {result.tables?.length || 0} Tables •{" "}
                    {result.relationships?.length || 0} Relations
                  </span>
                </div>

                {/* Tables */}
                {result.tables?.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                      Tables
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {result.tables.map((table, index) => (
                        <span
                          key={table.name || index}
                          className="px-2 py-1 rounded-md text-[11px] font-mono bg-purple-500/15 text-purple-800 dark:text-purple-200 font-medium"
                        >
                          {table.name || `table_${index + 1}`}
                          {table.columns?.length
                            ? ` (${table.columns.length} cols)`
                            : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relationships */}
                {result.relationships?.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
                      Relationships
                    </p>

                    <div className="space-y-1.5">
                      {result.relationships
                        .slice(0, 8)
                        .map((relationship, index) => (
                          <div
                            key={relationship.id || index}
                            className={`text-[10px] font-mono px-2.5 py-1.5 rounded-lg ${
                              isDarkMode
                                ? "bg-slate-800/70 text-slate-300"
                                : "bg-white text-slate-600"
                            }`}
                          >
                            {relationship.from ||
                              relationship.source ||
                              relationship.sourceTable ||
                              "Unknown"}{" "}
                            →{" "}
                            {relationship.to ||
                              relationship.target ||
                              relationship.targetTable ||
                              "Unknown"}
                          </div>
                        ))}

                      {result.relationships.length > 8 && (
                        <p className="text-[10px] text-slate-400">
                          + {result.relationships.length - 8} more
                          relationships
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/60"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <span className="text-[11px] text-slate-400 font-mono">
            Target Dialect: {dialect || "PostgreSQL"}
          </span>

          <div className="flex items-center gap-2">
            {/* Cancel */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition disabled:opacity-40"
            >
              Cancel
            </button>

            {/* Apply */}
            {result ? (
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />

                <span>Replace / Load Into Canvas</span>
              </button>
            ) : (
              /* Generate */
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isLoading || !prompt.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Synthesizing Schema...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Generate Schema</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};