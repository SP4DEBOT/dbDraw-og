import React, { useState } from "react";
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  FileJson,
  FileCode,
} from "lucide-react";
import { generatePostgreSQL } from "../../utils/codeGenerators.js";

export const ExportModal = ({
  isOpen,
  onClose,
  project,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(project, null, 2);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const filename = `${project.title.toLowerCase().replace(/\s+/g, "_") || "schema"}.dbdraw.json`;
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSQL = () => {
    const sql = generatePostgreSQL(project);
    const filename = `${project.title.toLowerCase().replace(/\s+/g, "_") || "schema"}.sql`;
    const blob = new Blob([sql], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="export-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Share2 size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Export Schema Definition
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDownloadJSON}
              className={`p-4 rounded-xl border text-left space-y-2 transition hover:scale-[1.02] ${
                isDarkMode
                  ? "bg-slate-800/60 border-slate-700 hover:border-indigo-500/80"
                  : "bg-slate-50 border-slate-200 hover:border-indigo-400"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FileJson size={18} />
              </div>
              <div>
                <span className="font-bold text-xs block">dbDraw JSON (.json)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Full canvas layout, node coordinates, and relationships.
                </span>
              </div>
              <div className="pt-2 text-xs font-semibold text-indigo-500 flex items-center gap-1">
                <Download size={13} />
                <span>Download JSON</span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadSQL}
              className={`p-4 rounded-xl border text-left space-y-2 transition hover:scale-[1.02] ${
                isDarkMode
                  ? "bg-slate-800/60 border-slate-700 hover:border-indigo-500/80"
                  : "bg-slate-50 border-slate-200 hover:border-indigo-400"
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileCode size={18} />
              </div>
              <div>
                <span className="font-bold text-xs block">SQL DDL Script (.sql)</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  CREATE TABLE and ALTER TABLE foreign keys.
                </span>
              </div>
              <div className="pt-2 text-xs font-semibold text-indigo-500 flex items-center gap-1">
                <Download size={13} />
                <span>Download SQL</span>
              </div>
            </button>
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                JSON Preview
              </span>
              <button
                type="button"
                onClick={handleCopyJSON}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
              </button>
            </div>
            <pre
              className={`p-3 rounded-xl border font-mono text-[11px] max-h-48 overflow-auto ${
                isDarkMode
                  ? "bg-slate-950 border-slate-800 text-slate-300"
                  : "bg-slate-100 border-slate-200 text-slate-800"
              }`}
            >
              {jsonString}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-900/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
