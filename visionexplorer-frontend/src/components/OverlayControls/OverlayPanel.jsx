import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useViewer } from "../../context/ViewerContext.jsx";

function OverlayPanel() {
  const { layers, setLayers } = useViewer();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const debounceRef = useRef(null);

  const toggleVisible = (id) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    );
  };

  const changeOpacity = (id, value) => {
    const v = Number(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLayers((prev) =>
        prev.map((l) => (l.id === id ? { ...l, opacity: v } : l))
      );
    }, 60);
  };

  const addLayer = () => {
    if (!url.trim()) return;
    const id = crypto.randomUUID();
    setLayers((prev) => [
      ...prev,
      {
        id,
        name: name.trim() || "Custom Layer",
        url: url.trim(),
        opacity: 0.7,
        visible: true,
        createdAt: new Date().toISOString(),
      },
    ]);
    setAdding(false);
    setName("");
    setUrl("");
  };

  const removeLayer = (id) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  };

  const presetUrls = [
    {
      name: "Satellite View 1",
      url: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2400&auto=format&fit=crop",
    },
    {
      name: "Topographic Map",
      url: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2400&auto=format&fit=crop",
    },
    {
      name: "Thermal Overlay",
      url: "https://images.unsplash.com/photo-1614729939124-032f0b56c4e4?q=80&w=2400&auto=format&fit=crop",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          Layer Control
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAdding((v) => !v)}
          className={`text-sm px-3 py-1 rounded-md transition-all ${
            adding
              ? "bg-red-500/20 border border-red-500/30 text-red-300"
              : "glass-panel hover:bg-white/10"
          }`}
        >
          {adding ? "Cancel" : "+ Add Layer"}
        </motion.button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-4 space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Layer Name
                </label>
                <input
                  className="w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  style={{
                    background: "rgba(39,39,42,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  placeholder="Enter layer name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">
                  Image URL
                </label>
                <input
                  className="w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  style={{
                    background: "rgba(39,39,42,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-2">
                  Quick Presets
                </label>
                <div className="grid grid-cols-1 gap-1">
                  {presetUrls.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setName(preset.name);
                        setUrl(preset.url);
                      }}
                      className="text-xs text-left px-2 py-1 rounded hover:bg-white/10 transition-colors text-zinc-300"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={addLayer}
                  disabled={!url.trim()}
                  className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Layer
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        <AnimatePresence>
          {layers.map((l, index) => (
            <motion.div
              key={l.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className="p-3 rounded-md glass-panel"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <motion.input
                    whileTap={{ scale: 0.9 }}
                    type="checkbox"
                    checked={l.visible}
                    onChange={() => toggleVisible(l.id)}
                    className="w-4 h-4 rounded"
                  />
                  <div>
                    <span className="text-sm font-medium">{l.name}</span>
                    {l.id === "base" && (
                      <span className="ml-2 text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                        Base
                      </span>
                    )}
                  </div>
                </div>
                {l.id !== "base" && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeLayer(l.id)}
                    className="text-xs text-red-400 hover:text-red-300 p-1"
                    title="Remove layer"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Opacity</span>
                  <span>{Math.round(l.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={l.opacity}
                  onChange={(e) => changeOpacity(l.id, e.target.value)}
                  className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer opacity-slider"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default OverlayPanel;
