// scripts/generate-tiles.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

class TileGenerator {
  constructor() {
    this.sourceDir = "./source-images";
    this.outputDir = "./tiles";
    this.tempDir = "./temp";
  }

  // Check if GDAL is installed
  checkGDAL() {
    try {
      const version = execSync("gdalinfo --version", { encoding: "utf8" });
      console.log("✅ GDAL found:", version.trim());
      return true;
    } catch (error) {
      console.error("❌ GDAL not found. Please install GDAL first.");
      console.log("\nInstallation instructions:");
      console.log("Windows: Download from https://www.gisinternals.com/");
      console.log("macOS: brew install gdal");
      console.log("Ubuntu: sudo apt-get install gdal-bin");
      return false;
    }
  }

  // Ensure directories exist
  setupDirectories() {
    [this.sourceDir, this.outputDir, this.tempDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  // Convert TIF to Web Mercator projection if needed
  preprocessImage(inputFile) {
    const fileName = path.basename(inputFile, path.extname(inputFile));
    const outputFile = path.join(this.tempDir, `${fileName}_3857.tif`);

    console.log(`🔄 Preprocessing ${inputFile}...`);

    try {
      // Reproject to Web Mercator (EPSG:3857) if not already
      const gdalWarpCmd = `gdalwarp -t_srs EPSG:3857 -r lanczos -te_srs EPSG:3857 "${inputFile}" "${outputFile}"`;
      execSync(gdalWarpCmd, { stdio: "inherit" });
      console.log(`✅ Reprojected to: ${outputFile}`);
      return outputFile;
    } catch (error) {
      console.error(`❌ Error preprocessing ${inputFile}:`, error.message);
      return null;
    }
  }

  // Generate tiles using gdal2tiles
  generateTiles(inputFile, options = {}) {
    const {
      minZoom = 0,
      maxZoom = 18,
      profile = "mercator",
      resampling = "lanczos",
    } = options;

    console.log(`🎯 Generating tiles for ${inputFile}...`);
    console.log(`📊 Zoom levels: ${minZoom} to ${maxZoom}`);

    try {
      const cmd = `gdal2tiles.py -p ${profile} -r ${resampling} -z ${minZoom}-${maxZoom} --processes=4 "${inputFile}" "${this.outputDir}"`;

      console.log(`🚀 Running: ${cmd}`);
      execSync(cmd, { stdio: "inherit" });

      console.log(`✅ Tiles generated successfully in ${this.outputDir}`);
      return true;
    } catch (error) {
      console.error(`❌ Error generating tiles:`, error.message);
      return false;
    }
  }

  // Alternative method using gdal_translate and gdaladdo
  generateTilesAlternative(inputFile, options = {}) {
    const { tileSize = 256, maxZoom = 18 } = options;

    console.log(`🔧 Using alternative tiling method for ${inputFile}...`);

    try {
      // Create VRT file
      const vrtFile = path.join(this.tempDir, "mosaic.vrt");
      execSync(`gdalbuildvrt "${vrtFile}" "${inputFile}"`, {
        stdio: "inherit",
      });

      // Generate tiles using gdal_translate
      const outputPattern = path.join(this.outputDir, "%z/%x/%y.png");
      const cmd = `gdal_translate -of PNG -outsize ${tileSize} ${tileSize} "${vrtFile}" "${outputPattern}"`;

      execSync(cmd, { stdio: "inherit" });
      console.log(`✅ Alternative tiling completed`);
      return true;
    } catch (error) {
      console.error(`❌ Error with alternative tiling:`, error.message);
      return false;
    }
  }

  // Process all TIF files in source directory
  processAllImages(options = {}) {
    if (!this.checkGDAL()) {
      return false;
    }

    this.setupDirectories();

    const tifFiles = fs
      .readdirSync(this.sourceDir)
      .filter(
        (file) =>
          file.toLowerCase().endsWith(".tif") ||
          file.toLowerCase().endsWith(".tiff")
      )
      .map((file) => path.join(this.sourceDir, file));

    if (tifFiles.length === 0) {
      console.log(`📂 No TIF files found in ${this.sourceDir}`);
      console.log(
        `💡 Place your NASA .tif files in the ${this.sourceDir} directory`
      );
      return false;
    }

    console.log(`🔍 Found ${tifFiles.length} TIF file(s):`);
    tifFiles.forEach((file) => console.log(`   - ${file}`));

    let successCount = 0;

    for (const tifFile of tifFiles) {
      console.log(`\n🌍 Processing: ${path.basename(tifFile)}`);

      // Preprocess the image
      const preprocessedFile = this.preprocessImage(tifFile);
      if (!preprocessedFile) {
        console.log(`⚠️  Skipping ${tifFile} due to preprocessing error`);
        continue;
      }

      // Generate tiles
      const success = this.generateTiles(preprocessedFile, options);
      if (success) {
        successCount++;
      }

      // Clean up temp file
      try {
        fs.unlinkSync(preprocessedFile);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    console.log(
      `\n🎉 Processing complete! Successfully processed ${successCount}/${tifFiles.length} files`
    );
    console.log(`📁 Tiles are available in: ${this.outputDir}`);
    console.log(`🌐 Start your server with: npm start`);

    return successCount > 0;
  }

  // Clean up generated files
  cleanup() {
    console.log("🧹 Cleaning up...");
    [this.outputDir, this.tempDir].forEach((dir) => {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`🗑️  Removed: ${dir}`);
      }
    });
  }
}

// CLI interface
const args = process.argv.slice(2);
const tileGenerator = new TileGenerator();

if (args.includes("--help") || args.includes("-h")) {
  console.log(`
🗺️  NASA Image Tile Generator

Usage:
  npm run generate-tiles [options]

Options:
  --clean          Clean up all generated tiles
  --min-zoom=N     Minimum zoom level (default: 0)
  --max-zoom=N     Maximum zoom level (default: 18)
  --help, -h       Show this help

Examples:
  npm run generate-tiles
  npm run generate-tiles -- --min-zoom=5 --max-zoom=15
  npm run generate-tiles -- --clean
  `);
  process.exit(0);
}

if (args.includes("--clean")) {
  tileGenerator.cleanup();
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
});

// Start processing
console.log("🚀 Starting NASA Image Tile Generation...\n");
tileGenerator.processAllImages(options);
