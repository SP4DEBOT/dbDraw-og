import React, { memo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
} from "@xyflow/react";
import { X } from "lucide-react";

export const RelationshipEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const relType = data?.type || "1:N";
  const isDarkMode = data?.isDarkMode ?? true;
  const canEdit = data?.canEdit ?? true;

  const cycleRelationshipType = (e) => {
    e.stopPropagation();
    if (!canEdit) return;

    let nextType = "1:N";
    if (relType === "1:N") nextType = "1:1";
    else if (relType === "1:1") nextType = "N:M";
    else if (relType === "N:M") nextType = "1:N";

    data?.onToggleType?.(id, nextType);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    data?.onDelete?.(id);
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 2,
          stroke: isDarkMode ? "#6366f1" : "#4f46e5",
          ...style,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan flex items-center gap-1 group"
        >
          {/* Cardinality Badge Toggle */}
          <button
            type="button"
            onClick={cycleRelationshipType}
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider shadow-md transition-all hover:scale-105 select-none ${
              isDarkMode
                ? "bg-slate-900 border border-indigo-500/60 text-indigo-300 hover:border-indigo-400"
                : "bg-white border border-indigo-400 text-indigo-700 hover:bg-indigo-50"
            }`}
            title={canEdit ? `Current cardinality: ${relType} (click to toggle 1:1, 1:N, N:M)` : `Relationship: ${relType}`}
          >
            {relType}
          </button>

          {/* Delete Edge Action (visible on hover) */}
          {canEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-xs"
              title="Delete foreign key relationship"
            >
              <X size={10} />
            </button>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

RelationshipEdge.displayName = "RelationshipEdge";
