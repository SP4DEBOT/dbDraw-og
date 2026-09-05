import React, { useState, useMemo } from "react";
import {
  X,
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
} from "lucide-react";
import {
  generatePostgreSQL,
  generateMySQL,
  generateSQLite,
  generatePrisma,
  generateMongoose,
  generateTypeScript,
} from "../../utils/codeGenerators.js";

const TARGET_FORMATS = [
  { id: "postgres", label: "PostgreSQL DDL", ext: "sql" },
  { id: "mysql", label: "MySQL DDL", ext: "sql" },
  { id: "sqlite", label: "SQLite DDL", ext: "sql" },
  { id: "prisma", label: "Prisma Schema", ext: "prisma" },
  { id: "mongoose", label: "Mongoose Models", ext: "js" },
  { id: "typescript", label: "Model Interfaces", ext: "ts" },
];

export const CodeGeneratorModal = ({
  isOpen,
  onClose,
  project,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const [selectedFormat, setSelectedFormat] = useState(() => {
    if (project.dialect === "MySQL") return "mysql";
    if (project.dialect === "SQLite") return "sqlite";
    if (project.dialect === "MongoDB") return "mongoose";
    return "postgres";
  });

  const [copied, setCopied] = useState(false);

  const generatedCode = useMemo(() => {
    switch (selectedFormat) {
      case "postgres":
        return generatePostgreSQL(project);
      case "mysql":
        return generateMySQL(project);
      case "sqlite":
        return generateSQLite(project);
      case "prisma":
        return generatePrisma(project);
      case "mongoose":
        return generateMongoose(project);
      case "typescript":
        return generateTypeScript(project);
      default:
        return generatePostgreSQL(project);
    }
  }, [project, selectedFormat]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const currentFormat = TARGET_FORMATS.find((f) => f.id === selectedFormat);
    const ext = currentFormat?.ext || "txt";
    const filename = `${project.title.toLowerCase().replace(/\s+/g, "_") || "schema"}.${ext}`;

    const blob = new Blob([generatedCode], { type: "text/plain;charset=utf-8" });
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
      id="code-generator-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <div className="p-1.5 rounded-lg bg-indigo-500/10">
              <Code2 size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                dbDraw Code & Model Generator
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Project: {project.title} ({project.tables.length} tables)
              </span>
            </div>
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
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          {TARGET_FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => setSelectedFormat(fmt.id)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition border-b-2 shrink-0 flex items-center gap-1.5 ${
                selectedFormat === fmt.id
                  ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <FileCode size={13} />
              <span>{fmt.label}</span>
            </button>
          ))}
        </div>

        {/* Code View Area */}
        <div className="p-6 overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="relative flex-1 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden flex flex-col">
            {/* Top terminal bar */}
            <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-indigo-400" />
                <span>Generated Output ({generatedCode.split("\n").length} lines)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
                >
                  {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition flex items-center gap-1.5"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <pre className="p-4 overflow-auto flex-1 font-mono text-xs leading-relaxed text-indigo-200/90 selection:bg-indigo-500/30">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <span className="text-xs text-slate-400">
            Export ready for database migration runners and ORM setup.
          </span>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
