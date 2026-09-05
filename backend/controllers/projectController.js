import mongoose from "mongoose";
import Project from "../models/Project.js";

function toCanvasData(project) {
  return {
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
  };
}

function fromCanvasData(canvasData = {}) {
  const nodes = Array.isArray(canvasData.nodes) ? canvasData.nodes : [];
  const edges = Array.isArray(canvasData.edges) ? canvasData.edges : [];

  return {
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

function normalizeProjectBody(body) {
  const canvasData = body.canvasData?.nodes || body.canvasData?.edges
    ? body.canvasData
    : toCanvasData(body);
  return {
    title: body.title?.trim() || "Untitled Schema",
    description: body.description || "",
    dialect: body.dialect || "PostgreSQL",
    isPublicTemplate: Boolean(body.isPublicTemplate),
    canvasData: { nodes: canvasData.nodes || [], edges: canvasData.edges || [] },
  };
}

export async function createProject(req, res) {
  try {
    const payload = normalizeProjectBody(req.body);
    const project = await Project.create({ ...payload, createdBy: req.user.sub });
    return res.status(201).json({ project });
  } catch (error) {
    console.error("Create project error:", error);
    return res.status(500).json({ message: "Unable to save the project." });
  }
}

export async function getProjects(req, res) {
  try {
    const projects = await Project.find({ createdBy: req.user.sub }).sort({ updatedAt: -1 }).lean();
    return res.json({ projects });
  } catch (error) {
    console.error("Get projects error:", error);
    return res.status(500).json({ message: "Unable to load projects." });
  }
}

export async function updateProject(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid project id." });

    const existing = await Project.findOne({ _id: req.params.id, createdBy: req.user.sub });
    if (!existing) return res.status(404).json({ message: "Project not found." });

    const payload = normalizeProjectBody({
      ...existing.toObject(),
      ...req.body,
      canvasData: req.body.canvasData || existing.canvasData,
    });

    existing.title = payload.title;
    existing.description = payload.description;
    existing.dialect = payload.dialect;
    existing.isPublicTemplate = payload.isPublicTemplate;
    existing.canvasData = payload.canvasData;
    await existing.save();

    return res.json({ project: existing });
  } catch (error) {
    console.error("Update project error:", error);
    return res.status(500).json({ message: "Unable to update the project." });
  }
}

export async function deleteProject(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid project id." });

    const deleted = await Project.findOneAndDelete({ _id: req.params.id, createdBy: req.user.sub });
    if (!deleted) return res.status(404).json({ message: "Project not found." });

    return res.json({ message: "Project deleted." });
  } catch (error) {
    console.error("Delete project error:", error);
    return res.status(500).json({ message: "Unable to delete the project." });
  }
}

export { toCanvasData, fromCanvasData };
