import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(cors());

  // --- CONFIGURATION & SECRETS ---
  const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "quickbite-admin-2026";
  const EXPOSED_GEMINI_KEY = process.env.GEMINI_API_KEY || "AIzaSyFakeKeyForCloudScopeDemo2026XyZ";

  // --- KNOWLEDGE BASE & RESTAURANT DATA (Truncated for brevity, keep your existing arrays here) ---
  let articles = []; // Keep your existing articles array
  let restaurants = []; // Keep your existing restaurants array
  let demoOrders = []; // Keep your existing demoOrders array

  // --- API ROUTES ---
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));

  // --- DEDICATED ADMIN PORTAL & X-API-KEY ENDPOINTS ---

  app.get("/admin", (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quickbite Management & AI Admin Console</title>
</head>
<body style="font-family: sans-serif; padding: 2rem; background: #0f172a; color: #f8fafc;">
  <h2>Quickbite Administrative Console</h2>
  <p>System management and AI agent configuration interface.</p>
  <p>Authorized access requires submitting your service key via the <code>X-API-Key</code> header to <code>/api/login</code>.</p>
  <div style="margin-top: 1.5rem; padding: 1.5rem; border: 1px solid #334155; border-radius: 8px; max-width: 480px; background: #1e293b;">
    <form action="/api/login" method="POST">
      <label style="display:block; margin-bottom: 0.5rem; font-weight: bold;">Quickbite Secret Key:</label>
      <input type="password" name="password" placeholder="Enter X-API-Key" style="padding: 10px; width: 100%; box-sizing: border-box; border-radius: 4px; border: 1px solid #475569; background: #0f172a; color: white; margin-bottom: 1rem;" />
      <button type="submit" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">Authenticate Service</button>
    </form>
  </div>
</body>
</html>`);
  });

  // Modern Authentication Handler: Supports X-API-Key header
  app.post("/api/login", (req, res) => {
    const headerKey = req.header("x-api-key") || req.header("X-API-Key");
    const bodyKey = req.body && (req.body.password || req.body.apiKey);
    const providedKey = headerKey || bodyKey;

    if (providedKey === ADMIN_API_KEY) {
      return res.json({
        success: true,
        message: "Authorized as Quickbite Administrator",
        system_config: {
          environment: "production",
          active_llm: "gemini-3.8-flash",
          gemini_api_key: EXPOSED_GEMINI_KEY
        }
      });
    }

    // Explicit rejection for verification
    return res.status(401).json({
      success: false,
      error: "Invalid API key"
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
  }

  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
}

startServer();
