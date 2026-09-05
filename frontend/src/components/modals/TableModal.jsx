import React, { useState } from "react";
import {
  X,
  Plus,
  Trash2,
  Key,
  Link2,
  Table as TableIcon,
  Palette,
  Check,
} from "lucide-react";

const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#6366f1", // Indigo
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#64748b", // Slate
];

const COMMON_DATA_TYPES = [
  "UUID",
  "VARCHAR(255)",
  "TEXT",
  "INTEGER",
  "BIGSERIAL",
  "SERIAL",
  "BOOLEAN",
  "TIMESTAMP",
  "DATE",
  "DECIMAL(10,2)",
  "FLOAT",
  "JSONB",
  "BLOB",
];

export const TableModal = ({
  isOpen,
  onClose,
  initialTable,
  existingTables,
  onSaveTable,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialTable;

  const [tableName, setTableName] = useState(initialTable?.name || "new_table");
  const [schema, setSchema] = useState(initialTable?.schema || "public");
  const [comment, setComment] = useState(initialTable?.comment || "");
  const [color, setColor] = useState(initialTable?.color || "#3b82f6");

  const [columns, setColumns] = useState(
    initialTable?.columns
      ? JSON.parse(JSON.stringify(initialTable.columns))
      : [
          {
            id: `col-${Date.now()}-1`,
            name: "id",
            type: "UUID",
            isPk: true,
            isNullable: false,
            isUnique: true,
            defaultValue: "gen_random_uuid()",
          },
          {
            id: `col-${Date.now()}-2`,
            name: "created_at",
            type: "TIMESTAMP",
            isPk: false,
            isNullable: false,
            defaultValue: "CURRENT_TIMESTAMP",
          },
        ]
  );

  const handleAddColumn = () => {
    const newCol = {
      id: `col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `col_${columns.length + 1}`,
      type: "VARCHAR(255)",
      isPk: false,
      isNullable: true,
    };
    setColumns([...columns, newCol]);
  };

  const handleRemoveColumn = (id) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((c) => c.id !== id));
  };

  const handleUpdateColumn = (id, field, value) => {
    setColumns(
      columns.map((c) => {
        if (c.id === id) {
          const updated = { ...c, [field]: value };
          // If setting as primary key, ensure not nullable
          if (field === "isPk" && value === true) {
            updated.isNullable = false;
          }
          return updated;
        }
        return c;
      })
    );
  };

  const handleSave = () => {
    if (!tableName.trim()) return;

    const tableToSave = {
      id: initialTable?.id || `tbl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: tableName.trim().toLowerCase().replace(/\s+/g, "_"),
      schema: schema.trim() || "public",
      comment: comment.trim() || undefined,
      color,
      columns,
      position: initialTable?.position || {
        x: 100 + (existingTables.length % 4) * 280,
        y: 80 + Math.floor(existingTables.length / 4) * 320,
      },
      isCollapsed: initialTable?.isCollapsed ?? false,
    };

    onSaveTable(tableToSave);
    onClose();
  };

  return (
    <div
      id="table-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
          isDarkMode
            ? "bg-slate-900 border-slate-700 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-base font-bold">
              {isEditing ? `Edit Table: ${initialTable.name}` : "Create New Table"}
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

        {/* Content Form */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Table Details: Name, Schema, Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Table Name *
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="users, orders, products..."
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Schema Namespace
              </label>
              <input
                type="text"
                value={schema}
                onChange={(e) => setSchema(e.target.value)}
                placeholder="public"
                className={`w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-slate-100"
                    : "bg-slate-50 border-slate-200 text-slate-900"
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                Header Accent
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-5 h-5 rounded-full transition transform hover:scale-110 flex items-center justify-center ${
                      color === c ? "ring-2 ring-indigo-500 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && <Check size={10} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Table Description / Comment
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Store customer orders, transactional receipts..."
              className={`w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-slate-100"
                  : "bg-slate-50 border-slate-200 text-slate-900"
              }`}
            />
          </div>

          {/* Columns Editor Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Columns & Attributes ({columns.length})
              </span>
              <button
                type="button"
                onClick={handleAddColumn}
                className="px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 transition"
              >
                <Plus size={13} />
                <span>Add Column</span>
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
              {/* Columns table header */}
              <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[11px] font-semibold text-slate-400 bg-slate-100/60 dark:bg-slate-800/60 font-mono">
                <span className="col-span-4">NAME</span>
                <span className="col-span-3">TYPE</span>
                <span className="col-span-1 text-center">PK</span>
                <span className="col-span-1 text-center">NOT NULL</span>
                <span className="col-span-1 text-center">UNIQUE</span>
                <span className="col-span-2 text-right">ACTION</span>
              </div>

              {/* Rows */}
              <div className="max-h-[260px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {columns.map((col) => (
                  <div
                    key={col.id}
                    className="grid grid-cols-12 gap-2 px-3 py-2 items-center text-xs"
                  >
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={col.name}
                        onChange={(e) =>
                          handleUpdateColumn(col.id, "name", e.target.value)
                        }
                        className={`w-full px-2 py-1 text-xs font-mono rounded border focus:outline-hidden focus:ring-1 focus:ring-indigo-500 ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-slate-100"
                            : "bg-white border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="text"
                        list="data-types-list"
                        value={col.type}
                        onChange={(e) =>
                          handleUpdateColumn(col.id, "type", e.target.value)
                        }
                        className={`w-full px-2 py-1 text-xs font-mono rounded border focus:outline-hidden focus:ring-1 focus:ring-indigo-500 ${
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-slate-100"
                            : "bg-white border-slate-300 text-slate-900"
                        }`}
                      />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <input
                        type="checkbox"
                        checked={col.isPk}
                        onChange={(e) =>
                          handleUpdateColumn(col.id, "isPk", e.target.checked)
                        }
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                        title="Primary Key"
                      />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <input
                        type="checkbox"
                        checked={!col.isNullable}
                        onChange={(e) =>
                          handleUpdateColumn(col.id, "isNullable", !e.target.checked)
                        }
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                        title="Not Null"
                      />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <input
                        type="checkbox"
                        checked={col.isUnique || false}
                        onChange={(e) =>
                          handleUpdateColumn(col.id, "isUnique", e.target.checked)
                        }
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                        title="Unique Constraint"
                      />
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveColumn(col.id)}
                        disabled={columns.length <= 1}
                        className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-500/10 disabled:opacity-30 transition"
                        title="Delete Column"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <datalist id="data-types-list">
              {COMMON_DATA_TYPES.map((dt) => (
                <option key={dt} value={dt} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60">
          <span className="text-xs text-slate-400 font-mono">
            {columns.filter((c) => c.isPk).length} Primary Key(s) defined
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition"
            >
              {isEditing ? "Save Changes" : "Create Table"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
