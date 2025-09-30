import API_CONFIG from "../config/api.js";

// API Service for backend communication
export class APIService {
  static async checkHealth() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.health}`
      );
      if (!response.ok) throw new Error("Server not responding");
      return await response.json();
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }

  static async getTileMetadata() {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.metadata}`
      );
      if (!response.ok) throw new Error("Failed to fetch tile metadata");
      return await response.json();
    } catch (error) {
      console.error("Tile metadata fetch failed:", error);
      throw error;
    }
  }

  static getTileUrl(z, x, y) {
    return `${API_CONFIG.BASE_URL}/tiles/${z}/${x}/${y}.png`;
  }

  static createTileSource() {
    return {
      type: "zoomifytileservice",
      width:
        API_CONFIG.DEFAULT_TILE_SIZE * Math.pow(2, API_CONFIG.DEFAULT_MAX_ZOOM),
      height:
        API_CONFIG.DEFAULT_TILE_SIZE * Math.pow(2, API_CONFIG.DEFAULT_MAX_ZOOM),
      tileSize: API_CONFIG.DEFAULT_TILE_SIZE,
      maxLevel: API_CONFIG.DEFAULT_MAX_ZOOM,
      getTileUrl: function (level, x, y) {
        return APIService.getTileUrl(level, x, y);
      },
    };
  }

  // OpenSeadragon compatible tile source
  static createOpenSeadragonTileSource(metadata = null) {
    const maxZoom = metadata?.zoomLevels
      ? Math.max(...metadata.zoomLevels)
      : API_CONFIG.DEFAULT_MAX_ZOOM;
    const minZoom = metadata?.zoomLevels
      ? Math.min(...metadata.zoomLevels)
      : API_CONFIG.DEFAULT_MIN_ZOOM;

    return {
      height: API_CONFIG.DEFAULT_TILE_SIZE * Math.pow(2, maxZoom),
      width: API_CONFIG.DEFAULT_TILE_SIZE * Math.pow(2, maxZoom),
      tileSize: API_CONFIG.DEFAULT_TILE_SIZE,
      minLevel: minZoom,
      maxLevel: maxZoom,
      getTileUrl: function (level, x, y) {
        return APIService.getTileUrl(level, x, y);
      },
    };
  }
}

export default APIService;
