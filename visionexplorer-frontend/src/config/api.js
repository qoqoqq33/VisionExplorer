// API Configuration
const API_CONFIG = {
  // Backend API base URL
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3000",

  // API endpoints
  ENDPOINTS: {
    health: "/",
    metadata: "/tiles/metadata",
    tiles: "/tiles/{z}/{x}/{y}.png",
  },

  // Default settings
  DEFAULT_TILE_SIZE: 256,
  DEFAULT_MAX_ZOOM: 18,
  DEFAULT_MIN_ZOOM: 0,
};

export default API_CONFIG;
