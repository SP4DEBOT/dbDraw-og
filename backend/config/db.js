import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  mongoose.connection.on("connected", () => console.log("[dbDraw] MongoDB connected"));
  mongoose.connection.on("error", (err) => console.error("[dbDraw] MongoDB error:", err.message));
  mongoose.connection.on("disconnected", () => console.warn("[dbDraw] MongoDB disconnected"));

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 2,
  });
}
