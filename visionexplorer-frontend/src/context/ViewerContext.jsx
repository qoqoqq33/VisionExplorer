import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import APIService from "../services/api.js";

const ViewerContext = createContext(null);

export function ViewerProvider({ children }) {
  const viewerRef = useRef(null);
  const [_backendConnected, setBackendConnected] = useState(false);
  const [_tileMetadata, setTileMetadata] = useState(null);

  // Check backend connection on mount
  useEffect(() => {
    async function checkBackend() {
      try {
        await APIService.checkHealth();
        const metadata = await APIService.getTileMetadata();
        setTileMetadata(metadata);
        setBackendConnected(true);
        console.log("✅ Backend connected successfully");
        console.log("📊 Tile metadata:", metadata);
      } catch (_error) {
        console.warn("⚠️ Backend not available, using fallback images");
        setBackendConnected(false);
      }
    }
    checkBackend();
  }, []);

  // Initialize layers based on backend availability
  const [layers, setLayers] = useState([]);

  // Initialize layers when backend connection status changes
  useEffect(() => {
    if (_backendConnected && _tileMetadata) {
      // Use backend tiles
      setLayers([
        {
          id: "base",
          name: "NASA Imagery",
          tileSource: APIService.createOpenSeadragonTileSource(_tileMetadata),
          opacity: 1,
          visible: true,
          type: "tiles",
        },
      ]);
    } else {
      // Fallback to demo images
      setLayers([
        {
          id: "base",
          name: "Base Imagery",
          url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2400&auto=format&fit=crop",
          opacity: 1,
          visible: true,
          type: "image",
        },
      ]);
    }
  }, [_backendConnected, _tileMetadata]);

  // Annotations
  const [annotations, setAnnotations] = useState([]);

  // Timeline
  const [timeline, setTimeline] = useState([
    {
      id: "t1",
      label: "T-1",
      url: "https://images.unsplash.com/photo-1462331321792-cc44368b8894?q=80&w=2400&auto=format&fit=crop",
    },
    {
      id: "t2",
      label: "T-2",
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2400&auto=format&fit=crop",
    },
    {
      id: "t3",
      label: "T-3",
      url: "https://images.unsplash.com/photo-1526401281623-359fad0293b9?q=80&w=2400&auto=format&fit=crop",
    },
  ]);
  const [timelineIndex, setTimelineIndex] = useState(0);

  // Chat (mock AI)
  const [messages, setMessages] = useState([
    {
      id: "m1",
      role: "ai",
      text: "Ask about what you see in the current view.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  // Persistence: load on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("visionexplorer:workspace") || "null"
      );
      if (stored) {
        if (stored.layers) setLayers(stored.layers);
        if (stored.annotations) setAnnotations(stored.annotations);
        if (typeof stored.timelineIndex === "number")
          setTimelineIndex(stored.timelineIndex);
      }
    } catch (_) {
      // ignore
    }
  }, []);

  // Persistence: save on change (debounced)
  useEffect(() => {
    const handle = setTimeout(() => {
      const data = { layers, annotations, timelineIndex };
      try {
        localStorage.setItem("visionexplorer:workspace", JSON.stringify(data));
      } catch (_) {
        // ignore quota errors
      }
    }, 250);
    return () => clearTimeout(handle);
  }, [layers, annotations, timelineIndex]);

  const clearAnnotations = () => setAnnotations([]);

  // AI hook: use service placeholder for future integration
  async function askAI(prompt) {
    const { askAI: askAIService } = await import("../services/ai.js");
    const userMsg = { id: crypto.randomUUID(), role: "user", text: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    try {
      const viewer = viewerRef.current;
      const region = viewer ? viewer.viewport.getBounds(true) : null;
      const responseText = await askAIService(prompt, { region });
      const aiMsg = { id: crypto.randomUUID(), role: "ai", text: responseText };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsThinking(false);
    }
  }

  const value = useMemo(
    () => ({
      // viewer
      viewerRef,
      // layers
      layers,
      setLayers,
      // annotations
      annotations,
      setAnnotations,
      clearAnnotations,
      // timeline
      timeline,
      setTimeline,
      timelineIndex,
      setTimelineIndex,
      // chat
      messages,
      isThinking,
      askAI,
    }),
    [layers, annotations, timeline, timelineIndex, messages, isThinking]
  );

  return (
    <ViewerContext.Provider value={value}>{children}</ViewerContext.Provider>
  );
}

export function useViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error("useViewer must be used within ViewerProvider");
  return ctx;
}
