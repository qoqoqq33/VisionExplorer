// scripts/simple-tile-generator.js
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

class SimpleTileGenerator {
  constructor() {
    this.sourceDir = "./source-images";
    this.outputDir = "./tiles";
    this.tileSize = 256;
  }

  async setupDirectories() {
    for (const dir of [this.outputDir]) {
      try {
        await access(dir);
      } catch {
        await mkdir(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    }
  }

  // Generate test tiles with patterns
  async generateTestTiles(maxZoom = 5) {
    console.log("🧪 Generating test pattern tiles...");

    for (let z = 0; z <= maxZoom; z++) {
      const tilesPerSide = Math.pow(2, z);
      console.log(
        `🎯 Zoom ${z}: generating ${tilesPerSide * tilesPerSide} tiles`
      );

      for (let x = 0; x < tilesPerSide; x++) {
        for (let y = 0; y < tilesPerSide; y++) {
          await this.createPatternTile(z, x, y);
        }
      }
    }

    console.log("✅ Test tiles generated successfully!");
  }

  // Create a single pattern tile
  async createPatternTile(z, x, y) {
    try {
      const tileDir = path.join(this.outputDir, z.toString(), x.toString());
      await mkdir(tileDir, { recursive: true });

      const tilePath = path.join(tileDir, `${y}.png`);

      const canvas = createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext("2d");

      // Create a space-like background
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 180);
      gradient.addColorStop(0, "#000033");
      gradient.addColorStop(0.5, "#000066");
      gradient.addColorStop(1, "#000000");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.tileSize, this.tileSize);

      // Add some "stars" based on tile coordinates
      const starCount = 20 + z * 5;
      ctx.fillStyle = "#ffffff";

      // Use tile coordinates as seed for consistent star placement
      const seed = x * 1000 + y * 100 + z * 10;
      const random = this.seededRandom(seed);

      for (let i = 0; i < starCount; i++) {
        const starX = random() * this.tileSize;
        const starY = random() * this.tileSize;
        const size = random() * 3 + 1;

        ctx.beginPath();
        ctx.arc(starX, starY, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add tile coordinates as text
      ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`${z}/${x}/${y}`, this.tileSize / 2, this.tileSize / 2);

      // Add some "nebula" effects for higher zoom levels
      if (z > 2) {
        ctx.fillStyle = `rgba(255, 100, 150, 0.3)`;
        ctx.beginPath();
        ctx.arc(
          (x * 50 + y * 30) % this.tileSize,
          (y * 40 + z * 20) % this.tileSize,
          30 + z * 5,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }

      const buffer = canvas.toBuffer("image/png");
      await writeFile(tilePath, buffer);
    } catch (error) {
      console.error(`❌ Error creating tile ${z}/${x}/${y}:`, error.message);
    }
  }

  // Simple seeded random number generator
  seededRandom(seed) {
    let value = seed;
    return function () {
      value = (value * 9301 + 49297) % 233280;
      return value / 233280;
    };
  }

  // Try to generate tiles from actual images (simplified approach)
  async generateTilesFromImages(maxZoom = 3) {
    console.log("🖼️  Attempting to generate tiles from NASA images...");

    try {
      const files = await readdir(this.sourceDir);
      const imageFiles = files.filter(
        (file) =>
          file.toLowerCase().endsWith(".tif") ||
          file.toLowerCase().endsWith(".tiff") ||
          file.toLowerCase().endsWith(".jpg") ||
          file.toLowerCase().endsWith(".jpeg") ||
          file.toLowerCase().endsWith(".png")
      );

      if (imageFiles.length === 0) {
        console.log("📂 No image files found");
        return false;
      }

      console.log(`🔍 Found ${imageFiles.length} image file(s):`);
      imageFiles.forEach((file) => console.log(`   - ${file}`));

      for (const imageFile of imageFiles) {
        await this.processImageFile(
          path.join(this.sourceDir, imageFile),
          maxZoom
        );
      }

      return true;
    } catch (error) {
      console.error("❌ Error processing images:", error.message);
      return false;
    }
  }

  // Process a single image file
  async processImageFile(imagePath, maxZoom) {
    try {
      console.log(`\n🌍 Processing: ${path.basename(imagePath)}`);

      // For TIF files, we'll create pattern tiles since Canvas can't load them directly
      if (
        imagePath.toLowerCase().endsWith(".tif") ||
        imagePath.toLowerCase().endsWith(".tiff")
      ) {
        console.log(
          "📊 TIF file detected - generating pattern tiles based on filename"
        );
        await this.generatePatternTilesForFile(
          path.basename(imagePath),
          maxZoom
        );
        return true;
      }

      // For other image formats, try to load them
      try {
        const image = await loadImage(imagePath);
        console.log(`📐 Image size: ${image.width} x ${image.height}`);
        await this.generateTilesFromImage(
          image,
          path.basename(imagePath),
          maxZoom
        );
        return true;
      } catch (loadError) {
        console.log(
          `⚠️  Cannot load image format, generating pattern tiles instead`
        );
        await this.generatePatternTilesForFile(
          path.basename(imagePath),
          maxZoom
        );
        return true;
      }
    } catch (error) {
      console.error(`❌ Error processing ${imagePath}:`, error.message);
      return false;
    }
  }

  // Generate pattern tiles based on filename
  async generatePatternTilesForFile(filename, maxZoom) {
    const hash = this.hashString(filename);

    for (let z = 0; z <= maxZoom; z++) {
      const tilesPerSide = Math.pow(2, z);

      for (let x = 0; x < tilesPerSide; x++) {
        for (let y = 0; y < tilesPerSide; y++) {
          await this.createThemePatternTile(z, x, y, filename, hash);
        }
      }
    }

    console.log(`✅ Generated pattern tiles for ${filename}`);
  }

  // Create themed pattern tile based on filename
  async createThemePatternTile(z, x, y, filename, hash) {
    try {
      const tileDir = path.join(this.outputDir, z.toString(), x.toString());
      await mkdir(tileDir, { recursive: true });

      const tilePath = path.join(tileDir, `${y}.png`);

      const canvas = createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext("2d");

      // Create different themes based on filename
      if (filename.toLowerCase().includes("messier")) {
        this.drawGalaxyPattern(ctx, z, x, y, hash);
      } else if (
        filename.toLowerCase().includes("starbirth") ||
        filename.toLowerCase().includes("tapestry")
      ) {
        this.drawNebulaPattern(ctx, z, x, y, hash);
      } else if (filename.toLowerCase().includes("westerlund")) {
        this.drawStarClusterPattern(ctx, z, x, y, hash);
      } else {
        this.drawSpacePattern(ctx, z, x, y, hash);
      }

      // Add tile info
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "10px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`${z}/${x}/${y}`, 5, 15);
      ctx.fillText(filename.substring(0, 15), 5, this.tileSize - 5);

      const buffer = canvas.toBuffer("image/png");
      await writeFile(tilePath, buffer);
    } catch (error) {
      console.error(
        `❌ Error creating themed tile ${z}/${x}/${y}:`,
        error.message
      );
    }
  }

  // Draw galaxy pattern (for Messier objects)
  drawGalaxyPattern(ctx, z, x, y, hash) {
    const centerX = this.tileSize / 2;
    const centerY = this.tileSize / 2;

    // Dark space background
    ctx.fillStyle = "#000011";
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);

    // Galaxy spiral
    const spiralRadius = (z + 1) * 30;
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      spiralRadius
    );
    gradient.addColorStop(0, "#ffaa00");
    gradient.addColorStop(0.5, "#ff6600");
    gradient.addColorStop(1, "#220000");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      centerX + (x - y) * 10,
      centerY + (y - x) * 10,
      spiralRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Draw nebula pattern (for star birth regions)
  drawNebulaPattern(ctx, z, x, y, hash) {
    // Dark background
    ctx.fillStyle = "#000022";
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);

    // Colorful nebula clouds
    const colors = ["#ff3366", "#3366ff", "#66ff33", "#ffff33", "#ff6633"];

    for (let i = 0; i < 5; i++) {
      const offsetX = (hash + i * 100 + x * 50) % this.tileSize;
      const offsetY = (hash + i * 150 + y * 60) % this.tileSize;
      const radius = 20 + z * 10 + i * 5;

      const gradient = ctx.createRadialGradient(
        offsetX,
        offsetY,
        0,
        offsetX,
        offsetY,
        radius
      );
      gradient.addColorStop(0, colors[i % colors.length] + "88");
      gradient.addColorStop(1, colors[i % colors.length] + "00");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(offsetX, offsetY, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw star cluster pattern
  drawStarClusterPattern(ctx, z, x, y, hash) {
    // Dark background
    ctx.fillStyle = "#000033";
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);

    // Dense star field
    const starCount = 50 + z * 20;
    const random = this.seededRandom(hash + x * 1000 + y * 100);

    for (let i = 0; i < starCount; i++) {
      const starX = random() * this.tileSize;
      const starY = random() * this.tileSize;
      const brightness = random();
      const size = random() * 4 + 1;

      const alpha = Math.floor(brightness * 255);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

      ctx.beginPath();
      ctx.arc(starX, starY, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw general space pattern
  drawSpacePattern(ctx, z, x, y, hash) {
    const gradient = ctx.createLinearGradient(
      0,
      0,
      this.tileSize,
      this.tileSize
    );
    gradient.addColorStop(0, "#000066");
    gradient.addColorStop(0.5, "#000033");
    gradient.addColorStop(1, "#330000");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.tileSize, this.tileSize);

    // Some stars
    const random = this.seededRandom(hash + x * 100 + y * 50);
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(
        random() * this.tileSize,
        random() * this.tileSize,
        random() * 2 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }

  // Generate tiles from actual loaded image
  async generateTilesFromImage(image, filename, maxZoom) {
    console.log(`🎨 Generating tiles from actual image data`);

    for (let z = 0; z <= maxZoom; z++) {
      const tilesPerSide = Math.pow(2, z);

      for (let x = 0; x < tilesPerSide; x++) {
        for (let y = 0; y < tilesPerSide; y++) {
          await this.createImageTile(image, z, x, y, filename);
        }
      }
    }
  }

  // Create tile from actual image data
  async createImageTile(sourceImage, z, x, y, filename) {
    try {
      const tileDir = path.join(this.outputDir, z.toString(), x.toString());
      await mkdir(tileDir, { recursive: true });

      const tilePath = path.join(tileDir, `${y}.png`);

      const canvas = createCanvas(this.tileSize, this.tileSize);
      const ctx = canvas.getContext("2d");

      // Calculate source region
      const tilesPerSide = Math.pow(2, z);
      const srcWidth = sourceImage.width / tilesPerSide;
      const srcHeight = sourceImage.height / tilesPerSide;
      const srcX = x * srcWidth;
      const srcY = y * srcHeight;

      // Draw the image section
      ctx.drawImage(
        sourceImage,
        srcX,
        srcY,
        srcWidth,
        srcHeight,
        0,
        0,
        this.tileSize,
        this.tileSize
      );

      // Add tile info overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "10px Arial";
      ctx.fillText(`${z}/${x}/${y}`, 5, 15);

      const buffer = canvas.toBuffer("image/png");
      await writeFile(tilePath, buffer);
    } catch (error) {
      console.error(
        `❌ Error creating image tile ${z}/${x}/${y}:`,
        error.message
      );
    }
  }

  // Simple string hash function
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Clean up
  async cleanup() {
    try {
      fs.rmSync(this.outputDir, { recursive: true, force: true });
      console.log(`🗑️  Removed: ${this.outputDir}`);
    } catch {
      // Directory doesn't exist, ignore
    }
  }
}

// CLI interface
const args = process.argv.slice(2);
const generator = new SimpleTileGenerator();

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
🗺️  Simple NASA Tile Generator

Usage:
  node scripts/simple-tile-generator.js [options]

Options:
  --clean              Clean up all generated tiles
  --max-zoom=N         Maximum zoom level (default: 5)
  --test-only          Generate only test pattern tiles
  --help, -h           Show this help

Examples:
  node scripts/simple-tile-generator.js
  node scripts/simple-tile-generator.js --max-zoom=3
  node scripts/simple-tile-generator.js --test-only
  node scripts/simple-tile-generator.js --clean
  `);
  process.exit(0);
}

async function main() {
  if (args.includes("--clean")) {
    await generator.cleanup();
    process.exit(0);
  }

  await generator.setupDirectories();

  // Parse max zoom
  let maxZoom = 5;
  const maxZoomArg = args.find((arg) => arg.startsWith("--max-zoom="));
  if (maxZoomArg) {
    maxZoom = parseInt(maxZoomArg.split("=")[1]) || 5;
  }

  console.log(`🚀 Simple Tile Generator Starting...\n`);
  console.log(`📊 Max zoom level: ${maxZoom}`);

  if (args.includes("--test-only")) {
    console.log(`🧪 Test mode: generating pattern tiles only\n`);
    await generator.generateTestTiles(maxZoom);
  } else {
    console.log(`🖼️  Processing NASA images and generating themed tiles\n`);
    const success = await generator.generateTilesFromImages(maxZoom);

    if (!success) {
      console.log(`\n🧪 Falling back to test pattern tiles...\n`);
      await generator.generateTestTiles(maxZoom);
    }
  }

  console.log(`\n🎉 Tile generation complete!`);
  console.log(`📁 Tiles saved to: ./tiles`);
  console.log(`🌐 Start your server: npm start`);
  console.log(`🔗 View tiles: http://localhost:3000/tiles/metadata`);
  console.log(`🗺️  Test map: Open example-frontend.html in browser`);
}

main().catch(console.error);
