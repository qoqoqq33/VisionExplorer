import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useViewer } from "../../context/ViewerContext.jsx";

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ExportPanel() {
  const {
    layers,
    annotations,
    timelineIndex,
    setLayers,
    setAnnotations,
    setTimelineIndex,
    clearAnnotations,
    viewerRef,
  } = useViewer();
  const fileRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportJSON = () => {
    const data = {
      layers,
      annotations,
      timelineIndex,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    downloadBlob(
      blob,
      `visionexplorer-workspace-${new Date().toISOString().split("T")[0]}.json`
    );
  };

  const importJSON = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.layers) setLayers(data.layers);
        if (data.annotations) setAnnotations(data.annotations);
        if (typeof data.timelineIndex === "number")
          setTimelineIndex(data.timelineIndex);
      } catch (e) {
        console.error("Failed to import workspace:", e);
        alert("Failed to import workspace file. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) importJSON(file);
    e.target.value = "";
  };

  const downloadPNG = async () => {
    setIsExporting(true);
    try {
      const osd = viewerRef.current;
      if (!osd) return;

      // Wait a moment for any pending renders
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = osd.drawer.canvas;
      const dataURL = canvas.toDataURL("image/png", 1.0);
      const res = await fetch(dataURL);
      const blob = await res.blob();
      downloadBlob(
        blob,
        `visionexplorer-view-${new Date().toISOString().split("T")[0]}.png`
      );
    } catch (error) {
      console.error("Failed to export PNG:", error);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
        Export & Share
      </h3>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={exportJSON}
            className="px-3 py-2 rounded-md glass-panel text-sm flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export JSON
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 rounded-md glass-panel text-sm flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Import JSON
          </motion.button>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadPNG}
          disabled={isExporting}
          className="w-full px-3 py-2 rounded-md glass-panel text-sm flex items-center justify-center gap-2"
        >
          {isExporting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border border-white border-t-transparent rounded-full"
              />
              Exporting...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Download PNG
            </>
          )}
        </motion.button>

        <div className="border-t border-white/10 pt-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={clearAnnotations}
            className="w-full px-3 py-2 rounded-md bg-red-500/20 border border-red-500/30 text-red-300 text-sm flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear Annotations
          </motion.button>
        </div>
      </div>

      <input
        type="file"
        ref={fileRef}
        accept="application/json"
        className="hidden"
        onChange={onFileChange}
      />

      <div className="text-xs text-zinc-400 mt-3 p-2 rounded bg-zinc-800/50">
        <p>
          <strong>Tip:</strong> Export your workspace to save annotations and
          layer settings. Import to restore a previous session.
        </p>
      </div>
    </motion.div>
  );
}

export default ExportPanel;
