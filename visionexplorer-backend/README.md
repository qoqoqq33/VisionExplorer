# VisionExplorer Tile Server

A Node.js + Express backend for serving NASA imagery as map tiles using GDAL.

## 🚀 Quick Start

### Prerequisites

1. **Install GDAL** (required for tile generation):

   - **Windows**: Download from [GIS Internals](https://www.gisinternals.com/)
   - **macOS**: `brew install gdal`
   - **Ubuntu/Debian**: `sudo apt-get install gdal-bin python3-gdal`

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

### 📁 Setup Your NASA Images

1. Place your `.tif` or `.tiff` files in the `source-images/` directory
2. The images should be in a standard geographic projection (will be converted to Web Mercator automatically)

### 🗺️ Generate Tiles

**Option 1: Using Node.js script**

```bash
# Generate tiles with default settings (zoom 0-18)
npm run generate-tiles

# Generate tiles with custom zoom levels
npm run generate-tiles -- --min-zoom=5 --max-zoom=15

# Clean up all generated tiles
npm run generate-tiles -- --clean

# Show help
npm run generate-tiles -- --help
```

**Option 2: Using Windows batch script**

```cmd
# Basic tile generation
generate-tiles.bat

# With custom zoom levels
generate-tiles.bat --min-zoom 5 --max-zoom 12
```

**Option 3: Manual GDAL commands**

```bash
# 1. Reproject to Web Mercator
gdalwarp -t_srs EPSG:3857 -r lanczos input.tif output_3857.tif

# 2. Generate tiles
gdal2tiles.py -p mercator -r lanczos -z 0-18 output_3857.tif tiles/
```

### 🌐 Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run at `http://localhost:3000`

## 📡 API Endpoints

### Tile Serving

```
GET /tiles/{z}/{x}/{y}.png
```

Standard slippy map tile format used by Leaflet, OpenLayers, etc.

**Example**: `http://localhost:3000/tiles/10/515/357.png`

### Metadata

```
GET /tiles/metadata
```

Returns information about available zoom levels and tile directory.

### Health Check

```
GET /
```

Returns server status and available endpoints.

## 🗂️ Directory Structure

```
visionexplorer-backend/
├── source-images/          # Place your .tif files here
├── tiles/                  # Generated tiles (auto-created)
│   ├── 0/0/0.png
│   ├── 1/0/0.png
│   ├── 2/1/1.png
│   └── ...
├── scripts/
│   └── generate-tiles.js   # Node.js tile generation script
├── generate-tiles.bat      # Windows batch script
├── server.js              # Express server
└── package.json
```

## 🌍 Frontend Integration

### Leaflet Example

```javascript
const map = L.map("map").setView([0, 0], 2);

L.tileLayer("http://localhost:3000/tiles/{z}/{x}/{y}.png", {
  attribution: "NASA Imagery",
  maxZoom: 18,
  tileSize: 256,
}).addTo(map);
```

### OpenLayers Example

```javascript
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

const tileLayer = new TileLayer({
  source: new XYZ({
    url: "http://localhost:3000/tiles/{z}/{x}/{y}.png",
    maxZoom: 18,
  }),
});
```

## ⚙️ Configuration Options

### Tile Generation Parameters

- **Zoom Levels**: 0-18 (0 = world view, 18 = street level)
- **Tile Size**: 256x256 pixels (standard)
- **Format**: PNG with transparency support
- **Projection**: Web Mercator (EPSG:3857)
- **Resampling**: Lanczos (high quality)

### Server Configuration

- **Port**: 3000 (configurable via `PORT` environment variable)
- **CORS**: Enabled for all origins
- **Caching**: 24-hour cache headers for tiles
- **Error Handling**: Proper HTTP status codes for missing tiles

## 🔧 Troubleshooting

### GDAL Not Found

- Ensure GDAL is installed and in your system PATH
- Windows: Add GDAL bin directory to PATH environment variable
- Test with: `gdalinfo --version`

### Memory Issues with Large Files

- Reduce max zoom level for very large images
- Use `--processes=1` flag for gdal2tiles on systems with limited RAM
- Consider preprocessing large files with `gdalwarp` to reduce size

### Tile Loading Issues

- Check file permissions on tiles directory
- Verify CORS headers in browser network tab
- Ensure tile URLs match the expected pattern

## 📊 Performance Tips

1. **Optimize Zoom Levels**: Don't generate unnecessary high zoom levels for low-resolution imagery
2. **Use Multiple Processes**: gdal2tiles supports `--processes=N` for faster generation
3. **Preprocess Large Files**: Use `gdalwarp` to optimize projection and compression before tiling
4. **Enable Caching**: Server includes cache headers for better performance

## 🛠️ Development

### Adding Features

- Modify `server.js` for new API endpoints
- Update `scripts/generate-tiles.js` for custom tile generation logic

### Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode

### Testing Tiles

Visit `http://localhost:3000/tiles/metadata` to see available zoom levels and verify your tiles are properly generated.

## 📄 License

ISC License - See package.json for details.
