import React, { useCallback, useMemo, useState, useEffect } from "react";
import { gsap } from "gsap";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { TableNode } from "./TableNode.jsx";
import { RelationshipEdge } from "./RelationshipEdge.jsx";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  MousePointer,
  Grid,
  Map,
  LayoutGrid,
} from "lucide-react";

const nodeTypes = {
  table: TableNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

function SchemaCanvasInner({
  project,
  hiddenTableIds,
  onUpdateProject,
  onOpenAddColumn,
  onOpenEditTable,
  onDeleteTable,
  onToggleTableCollapse,
  onAutoLayout,
  isDarkMode,
  currentUser,
  selectedTableId,
  onSelectTable,
}) {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isPanMode, setIsPanMode] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const canEdit = Boolean(currentUser);

  // Transform tables into React Flow Nodes
  const initialNodes = useMemo(() => {
    return project.tables
      .filter((t) => !hiddenTableIds.has(t.id))
      .map((table) => ({
        id: table.id,
        type: "table",
        position: table.position || { x: 100, y: 100 },
        selected: selectedTableId === table.id,
        data: {
          table,
          isDarkMode,
          canEdit,
          onAddColumn: onOpenAddColumn,
          onEditTable: onOpenEditTable,
          onDeleteTable,
          onToggleCollapse: onToggleTableCollapse,
        },
      }));
  }, [
    project.tables,
    hiddenTableIds,
    selectedTableId,
    isDarkMode,
    canEdit,
    onOpenAddColumn,
    onOpenEditTable,
    onDeleteTable,
    onToggleTableCollapse,
  ]);

  // Delete relationship handler
  const handleDeleteRelationship = useCallback(
    (relId) => {
      onUpdateProject({
        ...project,
        relationships: project.relationships.filter((r) => r.id !== relId),
      });
    },
    [project, onUpdateProject]
  );

  // Toggle relationship cardinality
  const handleToggleRelationshipType = useCallback(
    (relId, newType) => {
      onUpdateProject({
        ...project,
        relationships: project.relationships.map((r) =>
          r.id === relId ? { ...r, type: newType } : r
        ),
      });
    },
    [project, onUpdateProject]
  );

  // Transform relationships into React Flow Edges
  const initialEdges = useMemo(() => {
    return project.relationships
      .filter(
        (r) =>
          !hiddenTableIds.has(r.sourceTableId) &&
          !hiddenTableIds.has(r.targetTableId)
      )
      .map((rel) => ({
        id: rel.id,
        source: rel.sourceTableId,
        target: rel.targetTableId,
        sourceHandle: `${rel.sourceTableId}::${rel.sourceColumnName}`,
        targetHandle: `${rel.targetTableId}::${rel.targetColumnName}`,
        type: "relationship",
        data: {
          type: rel.type,
          name: rel.name,
          isDarkMode,
          canEdit,
          onDelete: handleDeleteRelationship,
          onToggleType: handleToggleRelationshipType,
        },
      }));
  }, [
    project.relationships,
    hiddenTableIds,
    isDarkMode,
    canEdit,
    handleDeleteRelationship,
    handleToggleRelationshipType,
  ]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Synchronize when project changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  useEffect(() => {
    const nodes = document.querySelectorAll('[id^="table-node-"]');
    if (!nodes.length) return;
    gsap.fromTo(nodes,
      { opacity: 0, y: 18, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.055, ease: "power3.out", overwrite: true }
    );
  }, [project.tables, hiddenTableIds]);

  useEffect(() => {
    const selected = selectedTableId ? document.getElementById(`table-node-${selectedTableId}`) : null;
    if (!selected) return;
    gsap.fromTo(selected,
      { boxShadow: "0 0 0 rgba(215,255,63,0)" },
      { boxShadow: "0 0 0 2px rgba(215,255,63,.34), 0 24px 70px rgba(0,0,0,.42)", duration: 0.45, ease: "power2.out" }
    );
  }, [selectedTableId]);

  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  // Save node position when drag ends
  const handleNodeDragStop = useCallback(
    (_event, node) => {
      const updatedTables = project.tables.map((tbl) =>
        tbl.id === node.id ? { ...tbl, position: node.position } : tbl
      );
      onUpdateProject({ ...project, tables: updatedTables });
    },
    [project, onUpdateProject]
  );

  // Connect columns to establish a foreign key relationship
  const handleConnect = useCallback(
    (params) => {
      if (!canEdit) return;

      const sourceTableId = params.source;
      const targetTableId = params.target;
      const sourceHandle = params.sourceHandle || "";
      const targetHandle = params.targetHandle || "";

      if (!sourceTableId || !targetTableId) return;

      // Extract column names from handle id (e.g. tableId::columnName)
      const sourceCol = sourceHandle.split("::")[1] || "id";
      const targetCol = targetHandle.split("::")[1] || "id";

      // Prevent duplicate edges
      const exists = project.relationships.some(
        (r) =>
          (r.sourceTableId === sourceTableId &&
            r.targetTableId === targetTableId &&
            r.sourceColumnName === sourceCol &&
            r.targetColumnName === targetCol) ||
          (r.sourceTableId === targetTableId &&
            r.targetTableId === sourceTableId &&
            r.sourceColumnName === targetCol &&
            r.targetColumnName === sourceCol)
      );
      if (exists) return;

      const newRel = {
        id: `rel-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sourceTableId,
        sourceColumnName: sourceCol,
        targetTableId,
        targetColumnName: targetCol,
        type: "1:N",
        onDelete: "CASCADE",
      };

      // Mark source column as foreign key if not already marked
      const targetTbl = project.tables.find((t) => t.id === targetTableId);
      const updatedTables = project.tables.map((t) => {
        if (t.id === sourceTableId) {
          return {
            ...t,
            columns: t.columns.map((c) =>
              c.name === sourceCol
                ? {
                    ...c,
                    isFk: true,
                    fkTable: targetTbl?.name,
                    fkColumn: targetCol,
                  }
                : c
            ),
          };
        }
        return t;
      });

      onUpdateProject({
        ...project,
        tables: updatedTables,
        relationships: [...project.relationships, newRel],
      });
    },
    [canEdit, project, onUpdateProject]
  );

  const handleZoom = (type) => {
    if (type === "in") {
      zoomIn();
    } else if (type === "out") {
      zoomOut();
    } else {
      fitView({ duration: 400, padding: 0.2 });
    }
    setTimeout(() => {
      const z = getZoom();
      setZoomLevel(Math.round(z * 100));
    }, 100);
  };

  return (
    <div
      id="schema-canvas-container"
      className="relative w-full h-full select-none overflow-hidden"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        panOnDrag={isPanMode ? true : [1, 2]}
        selectionOnDrag={!isPanMode}
        fitView
        minZoom={0.2}
        maxZoom={2.5}
        colorMode={isDarkMode ? "dark" : "light"}
        onNodeClick={(_event, node) => onSelectTable(node.id)}
        onPaneClick={() => onSelectTable(null)}
        proOptions={{ hideAttribution: true }}
      >
        {showGrid && (
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1.5}
            color={isDarkMode ? "#334155" : "#cbd5e1"}
          />
        )}

        {showMinimap && (
          <MiniMap
            zoomable
            pannable
            nodeColor={() => (isDarkMode ? "#6366f1" : "#4f46e5")}
            maskColor={isDarkMode ? "rgba(15, 23, 42, 0.7)" : "rgba(241, 245, 249, 0.7)"}
            className={`!bottom-16 !right-4 !rounded-xl !border ${
              isDarkMode ? "!bg-slate-900 !border-slate-800" : "!bg-white !border-slate-300"
            }`}
          />
        )}

        {/* Floating Bottom Control Bar */}
        <Panel position="bottom-center" className="!mb-4">
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl border shadow-xl backdrop-blur-md transition ${
              isDarkMode
                ? "bg-slate-900/90 border-slate-700/80 text-slate-200"
                : "bg-white/95 border-slate-300 text-slate-700"
            }`}
          >
            {/* Zoom controls */}
            <button
              type="button"
              onClick={() => handleZoom("out")}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>

            <span className="text-[11px] font-mono font-bold w-12 text-center">
              {zoomLevel}%
            </span>

            <button
              type="button"
              onClick={() => handleZoom("in")}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Fit view */}
            <button
              type="button"
              onClick={() => handleZoom("fit")}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Fit View"
            >
              <Maximize2 size={15} />
            </button>

            {/* Pan / Pointer toggle */}
            <button
              type="button"
              onClick={() => setIsPanMode(!isPanMode)}
              className={`p-1.5 rounded-lg transition ${
                isPanMode
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={isPanMode ? "Hand / Pan Mode Enabled" : "Pointer / Select Mode"}
            >
              {isPanMode ? <Hand size={15} /> : <MousePointer size={15} />}
            </button>

            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

            {/* Auto layout button */}
            <button
              type="button"
              onClick={onAutoLayout}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Auto-arrange layout"
            >
              <LayoutGrid size={15} />
            </button>

            {/* Grid toggle */}
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`p-1.5 rounded-lg transition ${
                showGrid
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-400 opacity-60"
              }`}
              title="Toggle Grid"
            >
              <Grid size={15} />
            </button>

            {/* Minimap toggle */}
            <button
              type="button"
              onClick={() => setShowMinimap(!showMinimap)}
              className={`p-1.5 rounded-lg transition ${
                showMinimap
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-400 opacity-60"
              }`}
              title="Toggle MiniMap"
            >
              <Map size={15} />
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function SchemaCanvas(props) {
  return (
    <ReactFlowProvider>
      <SchemaCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
