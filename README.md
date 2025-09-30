# VisionExplorer 🚀

A full-stack application for visualizing NASA imagery with tile-based mapping and advanced annotation features.

## 🌐 Live Demo

- **Frontend**: [https://visionexplorer.vercel.app](https://visionexplo## 🚀 Deployment

### Quick Deployment

Use the automated deployment scripts:

**Windows:**

```powershell
.\deploy.ps1
```

**Linux/Mac:**

```bash
chmod +x deploy.sh
./deploy.sh
```

### Production Hosting

VisionExplorer is configured for deployment on:

- **Frontend**: Vercel (recommended)
- **Backend**: Render (recommended)

#### Vercel Frontend Deployment

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build**:
   - Framework: Vite
   - Root Directory: `visionexplorer-frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

#### Render Backend Deployment

1. **Create Web Service**: Connect your GitHub repository
2. **Configure Service**:
   - Root Directory: `visionexplorer-backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   TILES_DIRECTORY=./tiles
   MAX_ZOOM_LEVEL=18
   TILE_SIZE=256
   ```

#### Alternative Platforms

- **Frontend**: Netlify, GitHub Pages, Firebase Hosting
- **Backend**: Railway, Heroku, DigitalOcean App Platform

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

## � GitHub Deploymenter.vercel.app) _(Replace with your actual URL)_

- **Backend API**: [https://visionexplorer-backend.onrender.com](https://visionexplorer-backend.onrender.com) _(Replace with your actual URL)_

## 📋 Project Structure

```
VisionExplorer/
├── visionexplorer-frontend/     # React + Vite frontend
├── visionexplorer-backend/      # Express.js tile server
├── package.json                 # Root scripts for running both
├── setup.bat                    # Windows setup script
├── setup.sh                     # Unix/Linux setup script
├── deploy.ps1                   # Windows deployment script
├── deploy.sh                    # Unix/Linux deployment script
├── vercel.json                  # Vercel deployment config
├── render.yaml                  # Render deployment config
├── DEPLOYMENT.md                # Detailed deployment guide
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🚀 Quick Start

### Automated Setup (Recommended)

**Windows:**

```bash
setup.bat
```

**Linux/Mac:**

```bash
chmod +x setup.sh
./setup.sh
```

### Manual Setup

#### Prerequisites

- Node.js 18+
- npm or yarn
- Git

#### 1. Install Dependencies

```bash
# Install all dependencies (frontend + backend + root)
npm run install:all
```

#### 2. Environment Variables

```bash
# Copy environment templates
cp visionexplorer-backend/.env.example visionexplorer-backend/.env
cp visionexplorer-frontend/.env.example visionexplorer-frontend/.env
```

#### 3. Generate Test Tiles (Optional)

```bash
# Generate test pattern tiles for the backend
npm run generate-tiles
```

#### 4. Start Development Servers

```bash
# Start both frontend and backend in development mode
npm run dev
```

This will start:

- **Backend** at `http://localhost:3000` (tile server)
- **Frontend** at `http://localhost:5173` (React app)

## 🏗️ Architecture

### Backend (Port 3000)

- **Express.js** tile server
- **NASA imagery** processing and serving
- **CORS** enabled for frontend integration
- **API endpoints**:
  - `GET /` - Health check
  - `GET /tiles/metadata` - Tile information
  - `GET /tiles/{z}/{x}/{y}.png` - Tile images

### Frontend (Port 5173)

- **React 19** + **Vite 7**
- **OpenSeadragon** for image viewing
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Three.js** for 3D graphics

## 🔗 Integration Features

- **Automatic Backend Detection**: Frontend automatically detects if backend is available
- **Graceful Fallback**: Uses demo images if backend is offline
- **Real-time Tile Loading**: Seamless integration with NASA tile server
- **Health Monitoring**: Connection status indicators

## 📡 API Integration

The frontend automatically connects to the backend and:

1. **Health Check**: Verifies backend availability
2. **Metadata Fetch**: Gets available zoom levels and tile info
3. **Tile Source Creation**: Creates OpenSeadragon-compatible tile sources
4. **Error Handling**: Falls back to demo images if backend unavailable

## 🛠️ Development

### Frontend Only

```bash
cd visionexplorer-frontend
npm run dev
```

### Backend Only

```bash
cd visionexplorer-backend
npm run dev
```

### Build for Production

```bash
npm run start  # Builds frontend and starts both servers
```

## 🎯 Features

### Frontend Features

- **Multi-layer Image Viewing**: OpenSeadragon-based viewer
- **Real-time Annotations**: Draw and annotate regions
- **Timeline Navigation**: Navigate through different time periods
- **AI Chat Interface**: Ask questions about the imagery
- **Export Tools**: Save annotations and images
- **Responsive Design**: Works on desktop and mobile

### Backend Features

- **Tile Generation**: Convert NASA images to web tiles
- **Multiple Formats**: Support for TIF, PNG, JPEG
- **Zoom Levels**: Generate tiles for different zoom levels
- **Caching**: Optimized tile serving with cache headers
- **GDAL Integration**: Professional geospatial processing

## 🔧 Configuration

### Environment Variables

**Frontend** (`.env` in `visionexplorer-frontend/`):

```env
VITE_API_URL=http://localhost:3000
```

**Backend** (`.env` in `visionexplorer-backend/`):

```env
PORT=3000
NODE_ENV=development
```

## 📊 Health Check

```bash
# Check if both servers are running
npm run health-check
```

## 🐛 Troubleshooting

### Backend Not Connecting

1. Ensure backend is running: `cd visionexplorer-backend && npm run dev`
2. Check port 3000 is available
3. Verify CORS settings in `server.js`

### Frontend Build Issues

1. Check Tailwind CSS configuration
2. Verify all dependencies are installed
3. Clear cache: `rm -rf node_modules/.vite`

### Tile Loading Issues

1. Generate test tiles: `npm run generate-tiles`
2. Check tile directory exists: `visionexplorer-backend/tiles/`
3. Verify tile metadata endpoint: `http://localhost:3000/tiles/metadata`

## 📈 Performance

- **Tile Caching**: 24-hour cache headers for optimal performance
- **Lazy Loading**: Tiles loaded on-demand
- **Memory Management**: Efficient OpenSeadragon configuration
- **Bundle Optimization**: Vite's optimized production builds

## 🎨 Customization

### Adding New Tile Sources

Edit `visionexplorer-frontend/src/context/ViewerContext.jsx` to add new layer configurations.

### Backend API Extensions

Add new endpoints in `visionexplorer-backend/server.js` for additional functionality.

### UI Themes

Modify Tailwind configuration in `visionexplorer-frontend/tailwind.config.js`.

## � GitHub Deployment

### 1. Initialize Repository

If you used the setup script, Git is already initialized. Otherwise:

```bash
git init
git add .
git commit -m "Initial commit: VisionExplorer project setup"
```

### 2. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `VisionExplorer` or your preferred name
3. **Don't** initialize with README (we already have one)

### 3. Connect and Push

```bash
# Replace <username> with your GitHub username
git remote add origin https://github.com/<username>/VisionExplorer.git
git branch -M main
git push -u origin main
```

### 4. Environment Variables for Production

**Backend (.env):**

```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

**Frontend (.env):**

```env
VITE_API_URL=https://your-backend-domain.com
```

### 5. Deployment Options

**Frontend (Vercel/Netlify):**

- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `visionexplorer-frontend`

**Backend (Railway/Heroku/DigitalOcean):**

- Start command: `npm start`
- Root directory: `visionexplorer-backend`
- Port: Use `process.env.PORT`

## �📄 License

ISC License - See individual package.json files for details.

---

**Made with ❤️ for NASA imagery exploration**
