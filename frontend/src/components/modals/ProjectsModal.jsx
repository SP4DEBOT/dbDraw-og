import React, { useState } from "react";
import {
  X,
  FolderOpen,
  Plus,
  Trash2,
  Calendar,
  Layers,
  FileCode,
  ArrowRight,
  Database,
} from "lucide-react";
import { PRESET_TEMPLATES } from "../../data/templates.js";

export const ProjectsModal = ({
  isOpen,
  onClose,
  savedProjects,
  onSelectProject,
  onDeleteProject,
  onNewBlankProject,
  onLoadTemplate,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState("saved");

  if (!isOpen) return null;

  return (
    <div
      id="projects-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <FolderOpen size={18} />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              dbDraw Schemas & Blueprints
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

        {/* Tab Selection */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                activeTab === "saved"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Saved Schemas ({savedProjects.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("templates")}
              className={`pb-2.5 text-xs font-bold transition border-b-2 ${
                activeTab === "templates"
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Starter Blueprints ({PRESET_TEMPLATES.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onNewBlankProject();
              onClose();
            }}
            className="mb-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center gap-1"
          >
            <Plus size={13} />
            <span>New Blank Schema</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3">
          {activeTab === "saved" ? (
            savedProjects.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                <Database size={32} className="mx-auto opacity-40" />
                <p>No saved schemas yet.</p>
                <p className="text-slate-500">
                  Use Save in the top bar to persist the active project to your dbDraw workspace.
                </p>
              </div>
            ) : (
              savedProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    onClose();
                  }}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition hover:border-indigo-500/60 ${
                    isDarkMode
                      ? "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs truncate">{p.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold">
                        {p.dialect}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {p.description || "No description"}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {p.tables.length} tables • {p.relationships.length} relationships
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(p.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition"
                      title="Delete Project"
                    >
                      <Trash2 size={15} />
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white transition"
                    >
                      Open
                    </button>
                  </div>
                </div>
              ))
            )
          ) : (
            PRESET_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => {
                  onLoadTemplate(tmpl);
                  onClose();
                }}
                className={`p-4 rounded-xl border flex items-center justify-between gap-4 cursor-pointer transition hover:border-purple-500/60 ${
                  isDarkMode
                    ? "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">{tmpl.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">
                      {tmpl.dialect}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {tmpl.description}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {tmpl.tables.length} tables • {tmpl.relationships.length} relationships
                  </div>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition shrink-0 flex items-center gap-1"
                >
                  <span>Load</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ))
          )}
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
