import React, { useCallback, useEffect, useState } from "react";
import { PRESET_TEMPLATES } from "./data/templates.js";
import { TopNavbar } from "./components/layout/TopNavbar.jsx";
import { LeftSidebar } from "./components/layout/LeftSidebar.jsx";
import { SchemaCanvas } from "./components/canvas/SchemaCanvas.jsx";
import { LandingPage } from "./components/views/LandingPage.jsx";
import { TableModal } from "./components/modals/TableModal.jsx";
import { AIGenerateModal } from "./components/modals/AIGenerateModal.jsx";
import { AIReviewModal } from "./components/modals/AIReviewModal.jsx";
import { CodeGeneratorModal } from "./components/modals/CodeGeneratorModal.jsx";
import { ProjectsModal } from "./components/modals/ProjectsModal.jsx";
import { ExportModal } from "./components/modals/ExportModal.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { api, authStore } from "./utils/api.js";

const STORAGE_KEY_THEME = "dbdraw_theme_preference";

function blankProject() {
  const stamp = Date.now();
  return {
    id: `custom-${stamp}`,
    title: "Untitled Schema",
    description: "Blank database model initialized in dbDraw",
    dialect: "PostgreSQL",
    tables: [{
      id: `tbl-${stamp}-1`,
      name: "users",
      schema: "public",
      comment: "Application users and authentication",
      color: "#3b82f6",
      position: { x: 120, y: 120 },
      columns: [
        { id: "col-1", name: "id", type: "UUID", isPk: true, isNullable: false, isUnique: true, defaultValue: "gen_random_uuid()" },
        { id: "col-2", name: "email", type: "VARCHAR(255)", isPk: false, isNullable: false, isUnique: true },
        { id: "col-3", name: "created_at", type: "TIMESTAMP", isPk: false, isNullable: false, defaultValue: "CURRENT_TIMESTAMP" },
      ],
    }],
    relationships: [],
  };
}

function projectFromApi(record) {
  const nodes = record?.canvasData?.nodes || [];
  const edges = record?.canvasData?.edges || [];
  return {
    id: record._id || record.id,
    title: record.title,
    description: record.description || "",
    dialect: record.dialect || "PostgreSQL",
    isPublicTemplate: Boolean(record.isPublicTemplate),
    tables: nodes.map((node) => ({
      ...(node.data?.table || node.data || {}),
      id: node.id,
      position: node.position || node.data?.table?.position || { x: 100, y: 100 },
    })),
    relationships: edges.map((edge) => ({
      ...(edge.data || {}),
      id: edge.id,
      sourceTableId: edge.source,
      targetTableId: edge.target,
      sourceColumnName: edge.sourceHandle?.split("::")[1] || edge.data?.sourceColumnName || "id",
      targetColumnName: edge.targetHandle?.split("::")[1] || edge.data?.targetColumnName || "id",
      type: edge.data?.type || "1:N",
      onDelete: edge.data?.onDelete || "CASCADE",
    })),
  };
}

function projectToPayload(project) {
  return {
    title: project.title,
    description: project.description || "",
    dialect: project.dialect || "PostgreSQL",
    isPublicTemplate: Boolean(project.isPublicTemplate),
    canvasData: {
      nodes: (project.tables || []).map((table) => ({
        id: table.id,
        type: "table",
        position: table.position || { x: 100, y: 100 },
        data: { table },
      })),
      edges: (project.relationships || []).map((rel) => ({
        id: rel.id,
        source: rel.sourceTableId,
        target: rel.targetTableId,
        sourceHandle: `${rel.sourceTableId}::${rel.sourceColumnName}`,
        targetHandle: `${rel.targetTableId}::${rel.targetColumnName}`,
        type: "relationship",
        data: { type: rel.type, name: rel.name, onDelete: rel.onDelete },
      })),
    },
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [authError, setAuthError] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem(STORAGE_KEY_THEME) !== "light");
  const [project, setProject] = useState(blankProject);
  const [savedProjects, setSavedProjects] = useState([]);
  const [hiddenTableIds, setHiddenTableIds] = useState(new Set());
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [isSaved, setIsSaved] = useState(true);

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [isAIGenerateModalOpen, setIsAIGenerateModalOpen] = useState(false);
  const [isAIReviewModalOpen, setIsAIReviewModalOpen] = useState(false);
  const [isCodeGeneratorModalOpen, setIsCodeGeneratorModalOpen] = useState(false);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem(STORAGE_KEY_THEME, isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    let mounted = true;
    const restoreSession = async () => {
      const token = authStore.getToken();
      if (!token) return mounted && setAuthReady(true);
      try {
        const { user } = await api.me();
        if (mounted) setCurrentUser(user);
      } catch {
        authStore.clear();
      } finally {
        if (mounted) setAuthReady(true);
      }
    };
    restoreSession();
    return () => { mounted = false; };
  }, []);

  const loadProjects = useCallback(async () => {
    if (!currentUser) return;
    try {
      const { projects } = await api.getProjects();
      setSavedProjects(projects.map(projectFromApi));
    } catch (error) {
      console.error(error);
    }
  }, [currentUser]);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const handleToggleDarkMode = () => setIsDarkMode((prev) => !prev);

  const enterCanvas = useCallback((nextProject) => {
    if (!currentUser) {
      setAuthMode("login");
      setAuthError("Sign in to open the canvas and save your work.");
      setCurrentView("auth");
      return;
    }
    setProject(JSON.parse(JSON.stringify(nextProject)));
    setHiddenTableIds(new Set());
    setSelectedTableId(null);
    setIsSaved(Boolean(nextProject.id && !String(nextProject.id).startsWith("custom-")));
    setCurrentView("canvas");
  }, [currentUser]);

  const handleStartBlank = () => enterCanvas(blankProject());
  const handleLoadTemplate = (tmpl) => enterCanvas(tmpl);

  const updateProject = useCallback((nextProject) => {
    setProject(nextProject);
    setIsSaved(false);
  }, []);

  const handleSaveProject = async () => {
    if (!currentUser) return;
    try {
      const payload = projectToPayload(project);
      const result = project.id && !String(project.id).startsWith("custom-")
        ? await api.updateProject(project.id, payload)
        : await api.createProject(payload);
      const saved = projectFromApi(result.project);
      setProject(saved);
      setSavedProjects((prev) => {
        const without = prev.filter((item) => item.id !== saved.id);
        return [saved, ...without];
      });
      setIsSaved(true);
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleDeleteSavedProject = async (projectId) => {
    try {
      await api.deleteProject(projectId);
      setSavedProjects((prev) => prev.filter((p) => p.id !== projectId));
      if (project.id === projectId) setProject(blankProject());
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleSaveTable = (tableData) => {
    if (editingTable) {
      updateProject({ ...project, tables: project.tables.map((t) => t.id === editingTable.id ? { ...t, ...tableData } : t) });
    } else {
      updateProject({ ...project, tables: [...project.tables, tableData] });
    }
    setEditingTable(null);
  };

  const handleDeleteTable = (tableId) => {
    updateProject({
      ...project,
      tables: project.tables.filter((t) => t.id !== tableId),
      relationships: project.relationships.filter((r) => r.sourceTableId !== tableId && r.targetTableId !== tableId),
    });
    if (selectedTableId === tableId) setSelectedTableId(null);
  };

  const handleToggleTableCollapse = (tableId) => {
    updateProject({ ...project, tables: project.tables.map((t) => t.id === tableId ? { ...t, isCollapsed: !t.isCollapsed } : t) });
  };

  const handleToggleTableVisibility = (tableId) => {
    setHiddenTableIds((prev) => {
      const next = new Set(prev);
      next.has(tableId) ? next.delete(tableId) : next.add(tableId);
      return next;
    });
  };

  const handleAutoLayout = useCallback(() => {
    const cols = Math.max(2, Math.min(4, Math.ceil(Math.sqrt(project.tables.length))));
    updateProject({
      ...project,
      tables: project.tables.map((table, index) => ({
        ...table,
        position: { x: 80 + (index % cols) * 380, y: 80 + Math.floor(index / cols) * 320 },
      })),
    });
  }, [project, updateProject]);

  const handleApplyGeneratedSchema = (aiResult) => {
    const positionedTables = (aiResult.tables || []).map((t, idx) => ({
      id: t.id || `tbl-ai-${Date.now()}-${idx}`,
      name: t.name,
      schema: t.schema || "public",
      comment: t.comment,
      color: t.color || (idx % 2 === 0 ? "#3b82f6" : "#8b5cf6"),
      position: { x: 80 + (idx % 3) * 380, y: 80 + Math.floor(idx / 3) * 320 },
      columns: (t.columns || []).map((col, cIdx) => ({
        id: col.id || `col-ai-${Date.now()}-${idx}-${cIdx}`,
        name: col.name, type: col.type, isPk: !!col.isPk, isFk: !!col.isFk,
        fkTable: col.fkTable, fkColumn: col.fkColumn, isNullable: col.isNullable ?? true,
        isUnique: !!col.isUnique, defaultValue: col.defaultValue, comment: col.comment,
      })),
    }));
    const map = Object.fromEntries(positionedTables.map((t) => [t.name.toLowerCase(), t.id]));
    const relationships = (aiResult.relationships || []).map((rel, idx) => {
      const sourceTableId = rel.sourceTableId || map[rel.sourceTable?.toLowerCase()];
      const targetTableId = rel.targetTableId || map[rel.targetTable?.toLowerCase()];
      if (!sourceTableId || !targetTableId) return null;
      return {
        id: rel.id || `rel-ai-${Date.now()}-${idx}`,
        sourceTableId, sourceColumnName: rel.sourceColumnName || rel.sourceColumn || "id",
        targetTableId, targetColumnName: rel.targetColumnName || rel.targetColumn || "id",
        type: rel.type || "1:N", onDelete: rel.onDelete || "CASCADE",
      };
    }).filter(Boolean);
    updateProject({
      ...project,
      id: `project-ai-${Date.now()}`,
      title: aiResult.schemaName || "AI Generated Schema",
      description: aiResult.description || "",
      tables: positionedTables,
      relationships,
    });
    setHiddenTableIds(new Set());
  };

  const handleAuthSubmit = async (payload) => {
    setAuthError("");
    setIsAuthSubmitting(true);
    try {
      const result = authMode === "register" ? await api.register(payload) : await api.login(payload);
      authStore.setToken(result.token);
      setCurrentUser(result.user);
      setCurrentView("canvas");
      setProject(blankProject());
      setIsSaved(false);
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSignOut = () => {
    authStore.clear();
    setCurrentUser(null);
    setSavedProjects([]);
    setCurrentView("landing");
  };

  if (!authReady) {
    return <div className="min-h-screen bg-[#08090c] text-white flex items-center justify-center font-mono text-xs">Loading dbDraw…</div>;
  }

  if (currentView === "auth") {
    return <AuthPage mode={authMode} onSubmit={handleAuthSubmit} onNavigate={(mode) => { setAuthMode(mode); setAuthError(""); }} onBack={() => setCurrentView("landing")} isDarkMode={isDarkMode} isSubmitting={isAuthSubmitting} error={authError} />;
  }

  if (currentView === "landing") {
    return (
      <LandingPage
        onStartBlank={handleStartBlank}
        onLoadTemplate={handleLoadTemplate}
        savedProjects={currentUser ? savedProjects : []}
        onOpenSavedProject={enterCanvas}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isAuthenticated={Boolean(currentUser)}
        onSignIn={() => { setAuthMode("login"); setAuthError(""); setCurrentView("auth"); }}
        onRegister={() => { setAuthMode("register"); setAuthError(""); setCurrentView("auth"); }}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div id="dbdraw-workspace" className={`h-screen w-screen flex flex-col overflow-hidden font-sans transition-colors ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      <TopNavbar
        project={project}
        onUpdateProject={updateProject}
        onOpenTableModal={(tableToEdit) => { setEditingTable(tableToEdit || null); setIsTableModalOpen(true); }}
        onOpenAIGenerateModal={() => setIsAIGenerateModalOpen(true)}
        onOpenAIReviewModal={() => setIsAIReviewModalOpen(true)}
        onOpenCodeGeneratorModal={() => setIsCodeGeneratorModalOpen(true)}
        onOpenProjectsModal={() => setIsProjectsModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onSaveProject={handleSaveProject}
        isSaved={isSaved}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onReturnToLanding={() => setCurrentView("landing")}
      />

      <div className="flex-1 flex overflow-hidden relative">
        <LeftSidebar
          project={project}
          hiddenTableIds={hiddenTableIds}
          onToggleTableVisibility={handleToggleTableVisibility}
          onOpenTableModal={(tableToEdit) => { setEditingTable(tableToEdit || null); setIsTableModalOpen(true); }}
          onDeleteTable={handleDeleteTable}
          selectedTableId={selectedTableId}
          onSelectTable={setSelectedTableId}
          onOpenAIGenerateModal={() => setIsAIGenerateModalOpen(true)}
          onOpenAIReviewModal={() => setIsAIReviewModalOpen(true)}
          isDarkMode={isDarkMode}
          currentUser={currentUser}
        />

        <main className="flex-1 relative h-full w-full">
          <SchemaCanvas
            project={project}
            hiddenTableIds={hiddenTableIds}
            onUpdateProject={updateProject}
            onOpenAddColumn={(tableId) => { const tbl = project.tables.find((t) => t.id === tableId); if (tbl) { setEditingTable(tbl); setIsTableModalOpen(true); } }}
            onOpenEditTable={(tbl) => { setEditingTable(tbl); setIsTableModalOpen(true); }}
            onDeleteTable={handleDeleteTable}
            onToggleTableCollapse={handleToggleTableCollapse}
            onAutoLayout={handleAutoLayout}
            isDarkMode={isDarkMode}
            currentUser={currentUser}
            selectedTableId={selectedTableId}
            onSelectTable={setSelectedTableId}
          />
        </main>
      </div>

      <TableModal isOpen={isTableModalOpen} onClose={() => { setIsTableModalOpen(false); setEditingTable(null); }} initialTable={editingTable} existingTables={project.tables} onSaveTable={handleSaveTable} isDarkMode={isDarkMode} />
      <AIGenerateModal isOpen={isAIGenerateModalOpen} onClose={() => setIsAIGenerateModalOpen(false)} onApplyGeneratedSchema={handleApplyGeneratedSchema} dialect={project.dialect} isDarkMode={isDarkMode} />
      <AIReviewModal isOpen={isAIReviewModalOpen} onClose={() => setIsAIReviewModalOpen(false)} project={project} isDarkMode={isDarkMode} />
      <CodeGeneratorModal isOpen={isCodeGeneratorModalOpen} onClose={() => setIsCodeGeneratorModalOpen(false)} project={project} isDarkMode={isDarkMode} />
      <ProjectsModal isOpen={isProjectsModalOpen} onClose={() => setIsProjectsModalOpen(false)} savedProjects={savedProjects} onSelectProject={(p) => { enterCanvas(p); setIsProjectsModalOpen(false); }} onDeleteProject={handleDeleteSavedProject} onNewBlankProject={handleStartBlank} onLoadTemplate={handleLoadTemplate} isDarkMode={isDarkMode} />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} project={project} isDarkMode={isDarkMode} />
    </div>
  );
}
