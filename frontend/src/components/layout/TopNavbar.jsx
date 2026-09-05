import React from "react";
import {
  Database,
  Plus,
  Sparkles,
  Code2,
  Share2,
  FolderOpen,
  Save,
  Sun,
  Moon,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Home,
  Check,
} from "lucide-react";

export const TopNavbar = ({
  project,
  onUpdateProject,
  onOpenTableModal,
  onOpenAIGenerateModal,
  onOpenAIReviewModal,
  onOpenCodeGeneratorModal,
  onOpenProjectsModal,
  onOpenExportModal,
  onSaveProject,
  isSaved,
  isDarkMode,
  onToggleDarkMode,
  currentUser,
  onSignOut,
  onReturnToLanding,
}) => {
  const canEdit = Boolean(currentUser);

  return (
    <header
      id="top-navbar"
      className={`h-14 px-4 border-b flex items-center justify-between gap-3 shrink-0 z-30 transition-colors ${
        isDarkMode
          ? "bg-slate-900/90 border-slate-800 text-slate-100"
          : "bg-white/95 border-slate-200 text-slate-800"
      } backdrop-blur-md`}
    >
      {/* Left: Brand logo & Project title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onReturnToLanding}
          className="flex items-center gap-2 group p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Return to Home / Projects"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Database size={18} />
          </div>
          <span className="font-extrabold text-base tracking-tight font-mono text-indigo-600 dark:text-indigo-400">
            dbDraw
          </span>
        </button>

        <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block" />

        {/* Project Name & Dialect Selector */}
        <div className="flex items-center gap-2 min-w-0">
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateProject({ ...project, title: e.target.value })}
            className={`font-semibold text-sm bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-hidden px-1 py-0.5 max-w-[180px] sm:max-w-[260px] truncate ${
              isDarkMode ? "text-slate-100" : "text-slate-900"
            }`}
            placeholder="Project Title"
            title="Rename Project"
          />

          {/* Database Dialect Dropdown */}
          <select
            value={project.dialect}
            onChange={(e) => onUpdateProject({ ...project, dialect: e.target.value })}
            className={`text-xs font-mono px-2 py-1 rounded-md border transition focus:outline-hidden focus:ring-1 focus:ring-indigo-500 ${
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-slate-200"
                : "bg-slate-100 border-slate-200 text-slate-700"
            }`}
            title="Database Dialect"
          >
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MySQL">MySQL</option>
            <option value="SQLite">SQLite</option>
            <option value="MongoDB">MongoDB</option>
          </select>
        </div>
      </div>

      {/* Middle: Canvas Quick Actions */}
      <div className="hidden lg:flex items-center gap-1.5">
        {canEdit && (
          <button
            type="button"
            onClick={() => onOpenTableModal()}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition active:scale-95"
            title="Create New Table"
          >
            <Plus size={14} />
            <span>Add Table</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenAIGenerateModal}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-purple-600/10 hover:bg-purple-600/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 transition active:scale-95"
          title="Synthesize schema via AI"
        >
          <Sparkles size={14} />
          <span>AI Architect</span>
        </button>

        <button
          type="button"
          onClick={onOpenAIReviewModal}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition active:scale-95"
          title="Analyze 1NF/2NF/3NF & Indexes"
        >
          <ShieldCheck size={14} />
          <span>Review & Audit</span>
        </button>

        <button
          type="button"
          onClick={onOpenCodeGeneratorModal}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 transition active:scale-95"
          title="Generate SQL / Prisma / Mongoose"
        >
          <Code2 size={14} />
          <span>Generate Code</span>
        </button>
      </div>

      {/* Right: Persistence, Export, User Role, Theme */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onSaveProject}
          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition ${
            isSaved
              ? isDarkMode
                ? "bg-slate-800 border-slate-700 text-slate-300"
                : "bg-slate-100 border-slate-200 text-slate-600"
              : "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse"
          }`}
          title={isSaved ? "All changes saved" : "Click to save changes"}
        >
          {isSaved ? <Check size={14} className="text-emerald-500" /> : <Save size={14} />}
          <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
        </button>

        <button
          type="button"
          onClick={onOpenProjectsModal}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
          title="Projects Library & Templates"
        >
          <FolderOpen size={14} />
          <span className="hidden md:inline">Projects</span>
        </button>

        <button
          type="button"
          onClick={onOpenExportModal}
          className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300"
          title="Export Schema Definition & SQL"
        >
          <Share2 size={14} />
          <span className="hidden md:inline">Export</span>
        </button>

        <div className="hidden xl:flex items-center gap-2 pl-2 mr-1 border-l border-white/10">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[130px] truncate">{currentUser?.name}</span>
          <button
            type="button"
            onClick={onSignOut}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-100 transition"
            title="Sign out"
          >
            Sign out
          </button>
        </div>

        {/* Dark / Light Toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500 dark:text-slate-400"
          title={isDarkMode ? "Switch to Bright Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};
