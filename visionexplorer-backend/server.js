// server.js
import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

// Load environment variables
config();

const app = express();

// Environment variables with defaults
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const TILES_DIRECTORY = process.env.TILES_DIRECTORY || './tiles';

// CORS configuration for geospatial applications
app.use(
  cors({
    origin: CORS_ORIGIN, // Configurable origin
    methods: ["GET", "HEAD", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware to log tile requests
app.use("/tiles", (req, res, next) => {
  console.log(`Tile request: ${req.path}`);
  next();
});

// Custom tile serving route with proper error handling
app.get("/tiles/:z/:x/:y.png", (req, res) => {
  const { z, x, y } = req.params;

  // Validate parameters
  if (isNaN(z) || isNaN(x) || isNaN(y)) {
    return res.status(400).json({ error: "Invalid tile coordinates" });
  }

  const tilePath = path.join(process.cwd(), TILES_DIRECTORY, z, x, `${y}.png`);

  // Check if tile exists
  fs.access(tilePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(`Tile not found: ${tilePath}`);
      // Return a transparent 256x256 PNG for missing tiles
      return res.status(404).json({ error: "Tile not found" });
    }

    // Set proper headers for tile serving
    res.set({
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      "Access-Control-Allow-Origin": "*",
    });

    // Send the tile
    res.sendFile(tilePath);
  });
});

// Fallback static serving for other tile requests
app.use(
  "/tiles",
  express.static(path.join(process.cwd(), TILES_DIRECTORY), {
    setHeaders: (res, path) => {
      res.set({
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      });
    },
  })
);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    message: "VisionExplorer Tile Server Running 🚀",
    endpoints: {
      tiles: "GET /tiles/{z}/{x}/{y}.png",
      health: "GET /",
    },
    tilesDirectory: path.join(process.cwd(), TILES_DIRECTORY),
  });
});

// Get tile metadata endpoint
app.get("/tiles/metadata", (req, res) => {
  const tilesDir = path.join(process.cwd(), TILES_DIRECTORY);

  fs.readdir(tilesDir, (err, zoomLevels) => {
    if (err) {
      return res.status(500).json({ error: "Cannot read tiles directory" });
    }

    const metadata = {
      zoomLevels: zoomLevels
        .filter((dir) => !isNaN(dir))
        .map(Number)
        .sort((a, b) => a - b),
      tilesPath: tilesDir,
      serverTime: new Date().toISOString(),
    };

    res.json(metadata);
  });
});

app.listen(PORT, () => {
  console.log(
    `🌍 VisionExplorer Tile Server running at http://localhost:${PORT}`
  );
  console.log(`📁 Serving tiles from: ${path.join(process.cwd(), TILES_DIRECTORY)}`);
  console.log(
    `🔗 Tile URL pattern: http://localhost:${PORT}/tiles/{z}/{x}/{y}.png`
  );
});
