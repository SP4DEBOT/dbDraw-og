import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Key,
  Link2,
  Table as TableIcon,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const TableNode = memo(({ id, data, selected }) => {
  const {
    table,
    isDarkMode,
    canEdit,
    onAddColumn,
    onEditTable,
    onDeleteTable,
    onToggleCollapse,
  } = data;

  const accentColor = table.color || "#3b82f6";
  const isCollapsed = table.isCollapsed ?? false;

  return (
    <div
      id={`table-node-${id}`}
      className={`rounded-2xl border shadow-2xl transition-all duration-500 ease-out min-w-[260px] max-w-[340px] select-none ${
        selected
          ? "ring-2 ring-indigo-500 shadow-indigo-500/20"
          : "hover:shadow-2xl"
      } ${
        isDarkMode
          ? "bg-slate-900/95 border-slate-700/80 text-slate-100"
          : "bg-white/95 border-slate-300 text-slate-900"
      }`}
    >
      {/* Table Header with Color Accent */}
      <div
        className="px-3 py-2 rounded-t-[10px] flex items-center justify-between gap-2 text-white border-b border-black/10"
        style={{ backgroundColor: accentColor }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <TableIcon size={14} className="shrink-0 opacity-90" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs font-mono tracking-tight truncate leading-tight">
              {table.name}
            </span>
            {table.schema && (
              <span className="text-[10px] opacity-75 font-mono leading-none truncate">
                {table.schema}
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse?.(table.id);
            }}
            className="p-1 rounded hover:bg-white/20 text-white/90 transition"
            title={isCollapsed ? "Expand columns" : "Collapse columns"}
          >
            {isCollapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>

          {canEdit && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTable?.(table);
                }}
                className="p-1 rounded hover:bg-white/20 text-white/90 transition"
                title="Edit Table and Columns"
              >
                <Edit2 size={12} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTable?.(table.id);
                }}
                className="p-1 rounded hover:bg-red-500/80 text-white/90 transition"
                title="Delete Table"
              >
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Table Comment if available */}
      {table.comment && !isCollapsed && (
        <div
          className={`px-3 py-1.5 text-[11px] italic border-b ${
            isDarkMode
              ? "bg-slate-800/40 border-slate-800 text-slate-400"
              : "bg-slate-50 border-slate-100 text-slate-500"
          }`}
        >
          {table.comment}
        </div>
      )}

      {/* Columns List */}
      {!isCollapsed && (
        <div className="py-1 divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
          {table.columns.map((column) => {
            const handleId = `${table.id}::${column.name}`;

            return (
              <div
                key={column.id}
                className={`relative px-3 py-1.5 flex items-center justify-between gap-2 group transition ${
                  isDarkMode
                    ? "hover:bg-slate-800/50"
                    : "hover:bg-slate-50"
                }`}
              >
                {/* Connection Handles (Left and Right for foreign key links) */}
                <Handle
                  type="target"
                  position={Position.Left}
                  id={handleId}
                  className="!w-2.5 !h-2.5 !-left-1.5 !bg-indigo-500 !border-2 !border-white dark:!border-slate-900 transition hover:!scale-125"
                />

                {/* Column Name & Constraints */}
                <div className="flex items-center gap-1.5 min-w-0">
                  {column.isPk ? (
                    <span title="Primary Key">
                      <Key size={12} className="text-amber-500 shrink-0" />
                    </span>
                  ) : column.isFk ? (
                    <span title={`Foreign Key: ${column.fkTable || ""}.${column.fkColumn || ""}`}>
                      <Link2 size={12} className="text-sky-500 shrink-0" />
                    </span>
                  ) : (
                    <span className="w-3" />
                  )}

                  <span
                    className={`truncate text-xs ${
                      column.isPk
                        ? "font-bold text-amber-600 dark:text-amber-400"
                        : column.isFk
                        ? "font-semibold text-sky-600 dark:text-sky-400"
                        : isDarkMode
                        ? "text-slate-200"
                        : "text-slate-800"
                    }`}
                  >
                    {column.name}
                  </span>

                  {!column.isNullable && (
                    <span
                      className="text-[9px] font-sans px-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0"
                      title="NOT NULL"
                    >
                      NN
                    </span>
                  )}

                  {column.isUnique && !column.isPk && (
                    <span
                      className="text-[9px] font-sans px-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0"
                      title="UNIQUE"
                    >
                      UQ
                    </span>
                  )}
                </div>

                {/* Column Data Type */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">
                    {column.type}
                  </span>
                </div>

                <Handle
                  type="source"
                  position={Position.Right}
                  id={handleId}
                  className="!w-2.5 !h-2.5 !-right-1.5 !bg-indigo-500 !border-2 !border-white dark:!border-slate-900 transition hover:!scale-125"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Collapsed state indicator */}
      {isCollapsed && (
        <div className="px-3 py-1.5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
          <span>{table.columns.length} columns hidden</span>
          <span className="text-indigo-500 text-xs">Click to expand</span>
        </div>
      )}

      {/* Footer Add Column Button */}
      {canEdit && !isCollapsed && (
        <div className="p-1.5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-[10px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddColumn?.(table.id);
            }}
            className="w-full py-1 px-2 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
          >
            <Plus size={12} />
            <span>Add Column</span>
          </button>
        </div>
      )}
    </div>
  );
});

TableNode.displayName = "TableNode";
