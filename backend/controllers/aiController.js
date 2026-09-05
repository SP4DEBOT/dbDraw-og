import {
  generateSchemaWithGemini,
  reviewSchemaWithGemini,
  generateFallbackSchema,
} from "../services/geminiService.js";

/**
 * Controller for POST /api/ai/generate-schema
 */
export async function generateSchema(req, res) {
  try {
    const { prompt, dialect = "PostgreSQL" } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "A prompt string is required." });
    }

    const result = await generateSchemaWithGemini(prompt, dialect);
    return res.json(result);
  } catch (error) {
    console.error("AI Controller Generate Error:", error);
    const fallback = generateFallbackSchema(req.body?.prompt || "default");
    return res.json({
      ...fallback,
      source: "fallback-resilient",
      warning: "Switched to fallback schema generator: " + (error?.message || "Unknown error"),
    });
  }
}

/**
 * Controller for POST /api/ai/review-schema
 */
export async function reviewSchema(req, res) {
  try {
    const { tables, relationships, dialect = "PostgreSQL" } = req.body;
    if (!tables || !Array.isArray(tables)) {
      return res.status(400).json({ error: "Tables array is required for review." });
    }

    const result = await reviewSchemaWithGemini(tables, relationships || [], dialect);
    return res.json(result);
  } catch (error) {
    console.error("AI Controller Review Error:", error);
    return res.status(500).json({ error: error.message || "Failed to review schema." });
  }
}
