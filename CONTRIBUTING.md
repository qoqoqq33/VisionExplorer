# Contributing to VisionExplorer

Thank you for your interest in contributing to VisionExplorer! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of React, Express.js, and NASA imagery formats

### Setup Development Environment

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/VisionExplorer.git
   cd VisionExplorer
   ```
3. **Run the setup script**:

   ```bash
   # Windows
   setup.bat

   # Linux/Mac
   chmod +x setup.sh
   ./setup.sh
   ```

## 🏗️ Project Structure

```
VisionExplorer/
├── visionexplorer-frontend/    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/           # React contexts
│   │   ├── services/          # API and external services
│   │   └── viewer/            # OpenSeadragon viewer components
├── visionexplorer-backend/     # Express.js backend
│   ├── scripts/               # Tile generation scripts
│   ├── source-images/         # NASA imagery input
│   └── tiles/                 # Generated tile output
└── .github/workflows/         # CI/CD workflows
```

## 🎯 How to Contribute

### 1. Issues

- **Bug Reports**: Use the bug report template
- **Feature Requests**: Use the feature request template
- **Questions**: Use GitHub Discussions

### 2. Pull Requests

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:

   ```bash
   # Run both servers
   npm run dev

   # Test backend
   cd visionexplorer-backend && npm test

   # Test frontend
   cd visionexplorer-frontend && npm run lint
   ```

4. **Commit your changes**:

   ```bash
   git commit -m "feat: add new tile visualization feature"
   ```

5. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### Frontend (React/JavaScript)

- Use **ES6+** features and modules
- Follow **React Hooks** patterns
- Use **Tailwind CSS** for styling
- Prefer **functional components**
- Include **JSDoc** comments for complex functions

```javascript
/**
 * Creates a tile source for OpenSeadragon
 * @param {Object} metadata - Tile metadata from backend
 * @returns {Object} OpenSeadragon compatible tile source
 */
function createTileSource(metadata) {
  // Implementation
}
```

### Backend (Node.js/Express)

- Use **ES6 modules** (import/export)
- Follow **RESTful API** patterns
- Include **proper error handling**
- Use **environment variables** for configuration
- Add **JSDoc** comments for API endpoints

```javascript
/**
 * GET /tiles/metadata
 * Returns tile metadata including available zoom levels
 * @returns {Object} Tile metadata
 */
app.get("/tiles/metadata", (req, res) => {
  // Implementation
});
```

### General Guidelines

- **File naming**: Use kebab-case for files (`tile-generator.js`)
- **Component naming**: Use PascalCase for React components (`TileViewer.jsx`)
- **Variable naming**: Use camelCase (`tileMetadata`)
- **Constants**: Use UPPER_SNAKE_CASE (`MAX_ZOOM_LEVEL`)

## 🧪 Testing

### Backend Testing

```bash
cd visionexplorer-backend

# Generate test tiles
npm run generate-tiles-simple -- --test-only

# Start server
npm start

# Test endpoints manually
curl http://localhost:3000
curl http://localhost:3000/tiles/metadata
```

### Frontend Testing

```bash
cd visionexplorer-frontend

# Lint code
npm run lint

# Build for production
npm run build

# Preview build
npm run preview
```

### Integration Testing

```bash
# Start both servers
npm run dev

# Test in browser
# 1. Navigate to http://localhost:5173
# 2. Check console for API calls
# 3. Verify tiles load in viewer
```

## 🌟 Feature Areas

We welcome contributions in these areas:

### Frontend Features

- **New visualization modes** (3D, time-lapse, etc.)
- **Advanced annotation tools** (polygons, measurements)
- **Export functionality** (PDF, high-res images)
- **Accessibility improvements**
- **Mobile responsiveness**

### Backend Features

- **New NASA data sources** (MODIS, Landsat, etc.)
- **Advanced tile processing** (color correction, enhancement)
- **Caching improvements**
- **API rate limiting**
- **WebSocket support** for real-time updates

### DevOps & Infrastructure

- **Docker containerization**
- **Kubernetes deployment**
- **Performance monitoring**
- **Automated testing**
- **Documentation improvements**

## 🚨 Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `documentation` - Documentation needs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `frontend` - Frontend specific
- `backend` - Backend specific
- `nasa-data` - NASA imagery related

## 📚 Resources

### NASA Data Sources

- [NASA Earthdata](https://earthdata.nasa.gov/)
- [NASA Worldview](https://worldview.earthdata.nasa.gov/)
- [Landsat Program](https://landsat.gsfc.nasa.gov/)

### Technical Documentation

- [OpenSeadragon API](https://openseadragon.github.io/)
- [GDAL Documentation](https://gdal.org/)
- [Web Map Tile Service](https://en.wikipedia.org/wiki/Web_Map_Tile_Service)

### Development Tools

- [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Guide](https://expressjs.com/)

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone.

### Standards

- **Be respectful** of differing viewpoints and experiences
- **Give constructive feedback** and be open to receiving it
- **Focus on what's best** for the community and the project
- **Show empathy** towards other community members

### Enforcement

Report any unacceptable behavior to the project maintainers.

## 🏆 Recognition

Contributors will be:

- **Added to README** contributors section
- **Mentioned in release notes** for significant contributions
- **Given maintainer status** for consistent, quality contributions

## ❓ Questions?

- **GitHub Discussions** for general questions
- **GitHub Issues** for bugs and feature requests
- **Email maintainers** for sensitive topics

---

Thank you for contributing to VisionExplorer! 🚀🌍
