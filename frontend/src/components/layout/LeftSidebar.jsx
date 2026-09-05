import React, { useState } from "react";
import {
  Table as TableIcon,
  Search,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
} from "lucide-react";

export const LeftSidebar = ({
  project,
  hiddenTableIds,
  onToggleTableVisibility,
  onOpenTableModal,
  onDeleteTable,
  selectedTableId,
  onSelectTable,
  onOpenAIGenerateModal,
  onOpenAIReviewModal,
  isDarkMode,
  currentUser,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("all");

  const canEdit = Boolean(currentUser);

  // Extract distinct schemas (e.g., public, auth, etc.)
  const schemas = Array.from(
    new Set(project.tables.map((t) => t.schema || "public"))
  );

  const filteredTables = project.tables.filter((table) => {
    const matchesSearch =
      table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.columns.some((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSchema =
      selectedSchema === "all" || (table.schema || "public") === selectedSchema;
    return matchesSearch && matchesSchema;
  });

  if (isCollapsed) {
    return (
      <aside
        id="left-sidebar-collapsed"
        className={`w-12 border-r flex flex-col items-center py-4 gap-4 transition-all duration-200 z-20 ${
          isDarkMode
            ? "bg-slate-900 border-slate-800 text-slate-400"
            : "bg-white border-slate-200 text-slate-600"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title="Expand Sidebar"
        >
          <ChevronRight size={18} />
        </button>

        <div className="w-6 h-px bg-slate-200 dark:bg-slate-800" />

        <button
          type="button"
          onClick={() => {
            setIsCollapsed(false);
            onOpenTableModal();
          }}
          disabled={!canEdit}
          className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
          title="Add Table"
        >
          <Plus size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsCollapsed(false);
            onOpenAIGenerateModal();
          }}
          className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition"
          title="AI Architect"
        >
          <Sparkles size={16} />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsCollapsed(false);
            onOpenAIReviewModal();
          }}
          className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
          title="Audit Schema"
        >
          <ShieldAlert size={16} />
        </button>
      </aside>
    );
  }

  return (
    <aside
      id="left-sidebar"
      className={`w-64 border-r flex flex-col transition-all duration-200 z-20 shrink-0 select-none ${
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Schema Explorer
          </span>
          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {project.tables.length}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition"
          title="Collapse Sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Search and Schema Filter */}
      <div className="p-3 space-y-2 border-b border-slate-200 dark:border-slate-800">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search tables or columns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border transition focus:outline-hidden focus:ring-1 focus:ring-indigo-500 ${
              isDarkMode
                ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500"
                : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
            }`}
          />
        </div>

        {schemas.length > 1 && (
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
            <button
              type="button"
              onClick={() => setSelectedSchema("all")}
              className={`px-2 py-0.5 rounded-md font-medium transition shrink-0 ${
                selectedSchema === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              All
            </button>
            {schemas.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSchema(s)}
                className={`px-2 py-0.5 rounded-md font-medium transition shrink-0 ${
                  selectedSchema === s
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tables List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredTables.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No tables match the query
          </div>
        ) : (
          filteredTables.map((table) => {
            const isHidden = hiddenTableIds.has(table.id);
            const isSelected = selectedTableId === table.id;

            return (
              <div
                key={table.id}
                onClick={() => onSelectTable(table.id)}
                className={`group px-2.5 py-2 rounded-lg flex items-center justify-between text-xs cursor-pointer transition ${
                  isSelected
                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-semibold"
                    : isDarkMode
                    ? "hover:bg-slate-800/60 text-slate-300"
                    : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: table.color || "#3b82f6" }}
                  />
                  <span className="font-mono truncate">{table.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({table.columns.length})
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTableVisibility(table.id);
                    }}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                    title={isHidden ? "Show table on canvas" : "Hide table"}
                  >
                    {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>

                  {canEdit && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTableModal(table);
                        }}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500 transition"
                        title="Edit Table"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTable(table.id);
                        }}
                        className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition"
                        title="Delete Table"
                      >
                        <Trash2 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Sidebar Quick Footer Actions */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/50">
        {canEdit && (
          <button
            type="button"
            onClick={() => onOpenTableModal()}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-xs"
          >
            <Plus size={14} />
            <span>Create Table</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onOpenAIGenerateModal}
            className="py-1 px-2 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition"
          >
            <Sparkles size={12} />
            <span>AI Design</span>
          </button>

          <button
            type="button"
            onClick={onOpenAIReviewModal}
            className="py-1 px-2 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition"
          >
            <ShieldAlert size={12} />
            <span>Audit</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
