// scripts/generate-tiles-gdal-async.js
import { createCanvas } from "canvas";
import fs from "fs";
import gdal from "gdal-async";
import path from "path";
import { promisify } from "util";

// Promisify fs functions
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

class GDALAsyncTileGenerator {
  constructor() {
    this.sourceDir = "./source-images";
    this.outputDir = "./tiles";
    this.tempDir = "./temp";
    this.tileSize = 256;
  }

  // Check GDAL-async availability
  async checkGDAL() {
    try {
      console.log("🔍 Checking GDAL-async...");
      console.log(`✅ GDAL version: ${gdal.version}`);
      console.log(`✅ Available drivers: ${gdal.drivers.count()}`);

      // List some key drivers
      const importantDrivers = ["GTiff", "PNG", "JPEG"];
      const availableDrivers = [];

      for (const driverName of importantDrivers) {
        try {
          const driver = gdal.drivers.get(driverName);
          if (driver) {
            availableDrivers.push(driverName);
          }
        } catch (e) {
          console.log(`⚠️  Driver ${driverName} not available`);
        }
      }

      console.log(`✅ Key drivers available: ${availableDrivers.join(", ")}`);
      return true;
    } catch (error) {
      console.error("❌ GDAL-async not available:", error.message);
      console.log(
        "Make sure you have installed gdal-async: npm install gdal-async"
      );
      return false;
    }
  }

  // Ensure directories exist
  async setupDirectories() {
    for (const dir of [this.sourceDir, this.outputDir, this.tempDir]) {
      try {
        await access(dir);
      } catch {
        await mkdir(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }
  }

  // Get comprehensive image information
  async getImageInfo(filePath) {
    try {
      console.log(`📊 Analyzing ${path.basename(filePath)}...`);

      const dataset = gdal.open(filePath);
      const rasterSize = dataset.rasterSize;
      const geoTransform = dataset.geoTransform;
      const projection = dataset.srs;
      const bandCount = dataset.bands.count();

      // Calculate geographic bounds
      const bounds = {
        minX: geoTransform[0],
        maxY: geoTransform[3],
        maxX: geoTransform[0] + rasterSize.x * geoTransform[1],
        minY: geoTransform[3] + rasterSize.y * geoTransform[5],
      };

      console.log(`   📐 Size: ${rasterSize.x} x ${rasterSize.y} pixels`);
      console.log(`   🎨 Bands: ${bandCount}`);
      console.log(
        `   🌍 Bounds: [${bounds.minX.toFixed(4)}, ${bounds.minY.toFixed(
          4
        )}, ${bounds.maxX.toFixed(4)}, ${bounds.maxY.toFixed(4)}]`
      );

      if (projection) {
        const projName =
          projection.getAuthorityName(null) +
          ":" +
          projection.getAuthorityCode(null);
        console.log(`   🗺️  Projection: ${projName}`);
      }

      // Get data type of first band
      if (bandCount > 0) {
        const band1 = dataset.bands.get(1);
        console.log(`   📊 Data type: ${band1.dataType}`);
        console.log(`   🔢 No data value: ${band1.noDataValue}`);
      }

      dataset.close();

      return {
        size: rasterSize,
        bounds: bounds,
        projection: projection,
        bandCount: bandCount,
        geoTransform: geoTransform,
      };
    } catch (error) {
      console.error(
        `❌ Error reading image info for ${filePath}:`,
        error.message
      );
      return null;
    }
  }

  // Convert geographic coordinates to tile coordinates
  deg2num(lat_deg, lon_deg, zoom) {
    const lat_rad = (lat_deg * Math.PI) / 180.0;
    const n = Math.pow(2.0, zoom);
    const xtile = Math.floor(((lon_deg + 180.0) / 360.0) * n);
    const ytile = Math.floor(
      ((1.0 - Math.asinh(Math.tan(lat_rad)) / Math.PI) / 2.0) * n
    );
    return [xtile, ytile];
  }

  // Convert tile coordinates to geographic coordinates
  num2deg(xtile, ytile, zoom) {
    const n = Math.pow(2.0, zoom);
    const lon_deg = (xtile / n) * 360.0 - 180.0;
    const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - (2 * ytile) / n)));
    const lat_deg = (lat_rad * 180.0) / Math.PI;
    return [lat_deg, lon_deg];
  }

  // Create a simple tile with a pattern (for testing)
  async createTestTile(z, x, y, outputPath) {
    try {
      // Create directory if it doesn't exist
      const tileDir = path.dirname(outputPath);
      await mkdir(tileDir, { recursive: true });

      // Create a simple tile image using a mathematical pattern
      const canvas = createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext("2d");

      // Create a pattern based on tile coordinates
      const imageData = ctx.createImageData(this.tileSize, this.tileSize);
      const data = imageData.data;

      for (let i = 0; i < this.tileSize; i++) {
        for (let j = 0; j < this.tileSize; j++) {
          const index = (i * this.tileSize + j) * 4;

          // Create a pattern based on coordinates and zoom
          const r = (x * 73 + i * 7) % 255;
          const g = (y * 89 + j * 11) % 255;
          const b = (z * 113 + (i + j) * 13) % 255;

          data[index] = r; // Red
          data[index + 1] = g; // Green
          data[index + 2] = b; // Blue
          data[index + 3] = 255; // Alpha
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Save as PNG
      const buffer = canvas.toBuffer("image/png");
      await writeFile(outputPath, buffer);

      return true;
    } catch (error) {
      console.error(
        `❌ Error creating test tile ${z}/${x}/${y}:`,
        error.message
      );
      return false;
    }
  }

  // Generate tiles from actual image data
  async generateTileFromImage(dataset, z, x, y, outputPath, imageInfo) {
    try {
      // Create directory if it doesn't exist
      const tileDir = path.dirname(outputPath);
      await mkdir(tileDir, { recursive: true });

      // Get tile bounds in geographic coordinates
      const [lat1, lon1] = this.num2deg(x, y, z);
      const [lat2, lon2] = this.num2deg(x + 1, y + 1, z);

      // Convert to pixel coordinates in the source image
      const gt = imageInfo.geoTransform;
      const srcX1 = Math.floor((lon1 - gt[0]) / gt[1]);
      const srcY1 = Math.floor((lat1 - gt[3]) / gt[5]);
      const srcX2 = Math.ceil((lon2 - gt[0]) / gt[1]);
      const srcY2 = Math.ceil((lat2 - gt[3]) / gt[5]);

      // Clamp to image bounds
      const clampedX1 = Math.max(0, Math.min(srcX1, imageInfo.size.x - 1));
      const clampedY1 = Math.max(0, Math.min(srcY1, imageInfo.size.y - 1));
      const clampedX2 = Math.max(0, Math.min(srcX2, imageInfo.size.x - 1));
      const clampedY2 = Math.max(0, Math.min(srcY2, imageInfo.size.y - 1));

      const srcWidth = clampedX2 - clampedX1;
      const srcHeight = clampedY2 - clampedY1;

      if (srcWidth <= 0 || srcHeight <= 0) {
        // No data for this tile, create transparent tile
        return await this.createTransparentTile(outputPath);
      }

      // Read pixel data from the first band
      const band = dataset.bands.get(1);
      const pixelData = band.pixels.read(
        clampedX1,
        clampedY1,
        srcWidth,
        srcHeight
      );

      // Create canvas and draw the tile
      const canvas = createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext("2d");
      const imageData = ctx.createImageData(this.tileSize, this.tileSize);
      const data = imageData.data;

      // Scale and map the pixel data to the tile
      for (let i = 0; i < this.tileSize; i++) {
        for (let j = 0; j < this.tileSize; j++) {
          const srcI = Math.floor((i / this.tileSize) * srcHeight);
          const srcJ = Math.floor((j / this.tileSize) * srcWidth);
          const srcIndex = srcI * srcWidth + srcJ;

          const pixelIndex = (i * this.tileSize + j) * 4;

          if (srcIndex < pixelData.length) {
            const value = pixelData[srcIndex];
            // Convert to RGB (simple grayscale for now)
            const grayValue = Math.min(255, Math.max(0, value));

            data[pixelIndex] = grayValue; // Red
            data[pixelIndex + 1] = grayValue; // Green
            data[pixelIndex + 2] = grayValue; // Blue
            data[pixelIndex + 3] = 255; // Alpha
          } else {
            // Transparent pixel
            data[pixelIndex] = 0;
            data[pixelIndex + 1] = 0;
            data[pixelIndex + 2] = 0;
            data[pixelIndex + 3] = 0;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Save as PNG
      const buffer = canvas.toBuffer("image/png");
      await writeFile(outputPath, buffer);

      return true;
    } catch (error) {
      console.error(
        `❌ Error generating tile from image ${z}/${x}/${y}:`,
        error.message
      );
      // Fallback to test tile
      return await this.createTestTile(z, x, y, outputPath);
    }
  }

  // Create a transparent tile
  async createTransparentTile(outputPath) {
    try {
      const tileDir = path.dirname(outputPath);
      await mkdir(tileDir, { recursive: true });

      const canvas = createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext("2d");

      // Create transparent tile
      ctx.clearRect(0, 0, this.tileSize, this.tileSize);

      const buffer = canvas.toBuffer("image/png");
      await writeFile(outputPath, buffer);

      return true;
    } catch (error) {
      console.error(`❌ Error creating transparent tile:`, error.message);
      return false;
    }
  }

  // Generate tiles for a specific zoom level
  async generateTilesForZoom(dataset, zoom, imageInfo, bounds) {
    // Calculate tile range for this zoom level
    const [minX, maxY] = this.deg2num(bounds.minY, bounds.minX, zoom);
    const [maxX, minY] = this.deg2num(bounds.maxY, bounds.maxX, zoom);

    const tileCount = (maxX - minX + 1) * (maxY - minY + 1);
    console.log(
      `🎯 Zoom ${zoom}: generating ${tileCount} tiles (${minX}-${maxX}, ${minY}-${maxY})`
    );

    let generatedCount = 0;
    let errorCount = 0;

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const tilePath = path.join(
          this.outputDir,
          zoom.toString(),
          x.toString(),
          `${y}.png`
        );

        try {
          const success = await this.generateTileFromImage(
            dataset,
            zoom,
            x,
            y,
            tilePath,
            imageInfo
          );
          if (success) {
            generatedCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          console.error(
            `❌ Failed to generate tile ${zoom}/${x}/${y}:`,
            error.message
          );
          errorCount++;
        }
      }
    }

    console.log(
      `✅ Zoom ${zoom} complete: ${generatedCount} tiles generated, ${errorCount} errors`
    );
    return generatedCount > 0;
  }

  // Process a single image file
  async processImage(imagePath, options = {}) {
    const {
      minZoom = 0,
      maxZoom = 6, // Reduced for faster generation
      useTestTiles = false,
    } = options;

    try {
      console.log(`\n🌍 Processing: ${path.basename(imagePath)}`);

      // Get image information
      const imageInfo = await this.getImageInfo(imagePath);
      if (!imageInfo) {
        return false;
      }

      // Open dataset
      const dataset = gdal.open(imagePath);

      if (useTestTiles) {
        console.log(`🧪 Generating test tiles (pattern-based)...`);

        // Generate test tiles with patterns
        for (let z = minZoom; z <= maxZoom; z++) {
          const tilesPerSide = Math.pow(2, z);
          console.log(
            `🎯 Zoom ${z}: generating ${tilesPerSide * tilesPerSide} test tiles`
          );

          for (let x = 0; x < tilesPerSide; x++) {
            for (let y = 0; y < tilesPerSide; y++) {
              const tilePath = path.join(
                this.outputDir,
                z.toString(),
                x.toString(),
                `${y}.png`
              );
              await this.createTestTile(z, x, y, tilePath);
            }
          }
        }
      } else {
        console.log(`📊 Zoom levels: ${minZoom} to ${maxZoom}`);

        // Generate tiles for each zoom level
        for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
          await this.generateTilesForZoom(
            dataset,
            zoom,
            imageInfo,
            imageInfo.bounds
          );
        }
      }

      dataset.close();
      console.log(`✅ Successfully processed ${path.basename(imagePath)}`);
      return true;
    } catch (error) {
      console.error(`❌ Error processing ${imagePath}:`, error.message);
      return false;
    }
  }

  // Process all images in source directory
  async processAllImages(options = {}) {
    if (!(await this.checkGDAL())) {
      return false;
    }

    await this.setupDirectories();

    let tifFiles;
    try {
      const files = await readdir(this.sourceDir);
      tifFiles = files
        .filter(
          (file) =>
            file.toLowerCase().endsWith(".tif") ||
            file.toLowerCase().endsWith(".tiff")
        )
        .map((file) => path.join(this.sourceDir, file));
    } catch (error) {
      console.error(`❌ Error reading source directory: ${error.message}`);
      return false;
    }

    if (tifFiles.length === 0) {
      console.log(`📂 No TIF files found in ${this.sourceDir}`);
      console.log(
        `💡 Place your NASA .tif files in the ${this.sourceDir} directory`
      );
      return false;
    }

    console.log(`🔍 Found ${tifFiles.length} TIF file(s):`);
    tifFiles.forEach((file) => console.log(`   - ${path.basename(file)}`));

    let successCount = 0;

    for (const tifFile of tifFiles) {
      const success = await this.processImage(tifFile, options);
      if (success) {
        successCount++;
      }
    }

    console.log(
      `\n🎉 Processing complete! Successfully processed ${successCount}/${tifFiles.length} files`
    );
    console.log(`📁 Tiles are available in: ${this.outputDir}`);
    console.log(`🌐 Start your server with: npm start`);
    console.log(`🔗 Test at: http://localhost:3000/tiles/metadata`);

    return successCount > 0;
  }

  // Clean up generated files
  async cleanup() {
    console.log("🧹 Cleaning up...");
    for (const dir of [this.outputDir, this.tempDir]) {
      try {
        await access(dir);
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`🗑️  Removed: ${dir}`);
      } catch {
        // Directory doesn't exist, ignore
      }
    }
  }
}

// CLI interface
const args = process.argv.slice(2);
const tileGenerator = new GDALAsyncTileGenerator();

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
🗺️  NASA Image Tile Generator (GDAL-Async Version)

Usage:
  node scripts/generate-tiles-gdal-async.js [options]

Options:
  --clean              Clean up all generated tiles
  --min-zoom=N         Minimum zoom level (default: 0)
  --max-zoom=N         Maximum zoom level (default: 6)
  --test-tiles         Generate test pattern tiles instead of image data
  --help, -h           Show this help

Examples:
  node scripts/generate-tiles-gdal-async.js
  node scripts/generate-tiles-gdal-async.js --min-zoom=2 --max-zoom=8
  node scripts/generate-tiles-gdal-async.js --test-tiles
  node scripts/generate-tiles-gdal-async.js --clean
  `);
  process.exit(0);
}

if (args.includes("--clean")) {
  await tileGenerator.cleanup();
  process.exit(0);
}

// Parse options
const options = {};
args.forEach((arg) => {
  if (arg.startsWith("--min-zoom=")) {
    options.minZoom = parseInt(arg.split("=")[1]);
  }
  if (arg.startsWith("--max-zoom=")) {
    options.maxZoom = parseInt(arg.split("=")[1]);
  }
  if (arg === "--test-tiles") {
    options.useTestTiles = true;
  }
});

// Start processing
console.log("🚀 Starting NASA Image Tile Generation with GDAL-Async...\n");
const success = await tileGenerator.processAllImages(options);

if (success) {
  console.log("\n🎊 Tile generation completed successfully!");
  console.log("Next steps:");
  console.log("1. Start the server: npm start");
  console.log("2. Open http://localhost:3000 in your browser");
  console.log("3. Check tiles at: http://localhost:3000/tiles/metadata");
} else {
  console.log("\n❌ Tile generation failed. Check the logs above for details.");
  process.exit(1);
}
