import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.resolve(rootDir, "frontend");

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Validate JWT secret
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET must be configured and at least 32 characters long."
  );
}

// Basic security headers
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader(
    "Referrer-Policy",
    "strict-origin-when-cross-origin"
  );
  next();
});

// JSON body parser
app.use(express.json({ limit: "10mb" }));

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// --------------------------------------------------
// API ROUTES
// --------------------------------------------------

app.use("/api/health", healthRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Unknown API route
app.use("/api", (_req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

async function startServer() {
  try {
    await connectDB();

    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");

      const vite = await createViteServer({
        root: frontendDir,
        server: {
          middlewareMode: true,
        },
        appType: "spa",
        configFile: path.resolve(
          frontendDir,
          "vite.config.js"
        ),
      });

      app.use(vite.middlewares);
    } else {
      const distPath = path.resolve(rootDir, "dist");

      app.use(express.static(distPath));

      app.get("*", (_req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }

    // Global error handler
    app.use((err, _req, res, _next) => {
      console.error("Unhandled server error:", err);

      res.status(500).json({
        message: "Internal server error.",
      });
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `[dbDraw] server running on http://localhost:${PORT}`
      );

      console.log(
        `[dbDraw] allowed frontend origins: ${allowedOrigins.join(", ")}`
      );
    });
  } catch (error) {
    console.error(
      "[dbDraw] startup failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();