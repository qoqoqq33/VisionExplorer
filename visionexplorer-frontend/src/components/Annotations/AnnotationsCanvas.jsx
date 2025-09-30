import { AnimatePresence, motion } from "framer-motion";
import OpenSeadragon from "openseadragon";
import { useEffect, useRef, useState } from "react";
import { useViewer } from "../../context/ViewerContext.jsx";

function AnnotationForm({ x, y, onSave, onCancel }) {
  const [note, setNote] = useState("");
  const [tag, setTag] = useState("Crater");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (!note.trim()) return;
    onSave({ note: note.trim(), tag });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="absolute z-20"
      style={{ left: x, top: y }}
    >
      <div className="glass-panel p-3 w-64 text-sm shadow-xl">
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Note</label>
            <input
              ref={inputRef}
              className="w-full px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              style={{
                background: "rgba(39,39,42,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              placeholder="Describe what you see..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Category</label>
            <select
              className="w-full px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              style={{
                background: "rgba(39,39,42,0.7)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            >
              <option>Crater</option>
              <option>River</option>
              <option>Mountain</option>
              <option>Building</option>
              <option>Forest</option>
              <option>Road</option>
              <option>Water</option>
              <option>Object</option>
              <option>Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              className="px-3 py-1 text-zinc-300 hover:text-white transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={!note.trim()}
              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Marker({ screenX, screenY, note, tag, onDelete, id }) {
  const [hover, setHover] = useState(false);

  const tagColors = {
    Crater: "bg-red-500",
    River: "bg-blue-500",
    Mountain: "bg-gray-500",
    Building: "bg-yellow-500",
    Forest: "bg-green-500",
    Road: "bg-purple-500",
    Water: "bg-cyan-500",
    Object: "bg-pink-500",
    Other: "bg-orange-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="absolute z-10"
      style={{ left: screenX - 8, top: screenY - 8 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <motion.div
        whileHover={{ scale: 1.2 }}
        className={`size-4 rounded-full shadow-lg ${
          tagColors[tag] || "bg-pink-500"
        } border-2 border-white/20`}
      />

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mt-2 -ml-20 w-56 glass-panel p-3 text-xs shadow-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      tagColors[tag] || "bg-pink-500"
                    }`}
                  ></span>
                  <span className="text-zinc-300 font-medium">{tag}</span>
                </div>
                <p className="text-zinc-100">{note}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(id)}
                className="text-red-400 hover:text-red-300 p-1"
                title="Delete annotation"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// This overlay sits on top of the viewer container and uses screen coords
function AnnotationsCanvas({ osd }) {
  const { annotations, setAnnotations, clearAnnotations } = useViewer();
  const overlayRef = useRef(null);
  const [draft, setDraft] = useState(null);
  const [isAnnotating, setIsAnnotating] = useState(false);

  useEffect(() => {
    if (!osd || !overlayRef.current) return;
    const handler = (ev) => {
      if (!isAnnotating) return;

      // Convert to viewport/image coords
      const webPoint = new OpenSeadragon.Point(ev.position.x, ev.position.y);
      const viewportPoint = osd.viewport.pointFromPixel(webPoint);
      const imagePoint = osd.viewport.viewportToImageCoordinates(viewportPoint);

      // Place draft near click location (screen coords)
      setDraft({
        screenX: ev.position.x,
        screenY: ev.position.y,
        imageX: imagePoint.x,
        imageY: imagePoint.y,
      });
    };
    osd.addHandler("canvas-click", handler);
    return () => osd.removeHandler("canvas-click", handler);
  }, [osd, isAnnotating]);

  const saveDraft = (data) => {
    if (!draft) return;
    const id = crypto.randomUUID();
    setAnnotations((prev) => [
      ...prev,
      {
        id,
        x: draft.imageX,
        y: draft.imageY,
        note: data.note,
        tag: data.tag,
        createdAt: new Date().toISOString(),
      },
    ]);
    setDraft(null);
  };

  const cancelDraft = () => setDraft(null);

  const deleteAnnotation = (id) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
  };

  // Project image coords of annotations to screen on each render
  const project = (x, y) => {
    if (!osd) return { x: -9999, y: -9999 };
    const viewportPoint = osd.viewport.imageToViewportCoordinates(x, y);
    const pixel = osd.viewport.pixelFromPoint(viewportPoint, true);
    return { x: pixel.x, y: pixel.y };
  };

  return (
    <div ref={overlayRef} className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {annotations.map((a) => {
          const p = project(a.x, a.y);
          return (
            <Marker
              key={a.id}
              id={a.id}
              screenX={p.x}
              screenY={p.y}
              note={a.note}
              tag={a.tag}
              onDelete={deleteAnnotation}
            />
          );
        })}
        {draft && (
          <AnnotationForm
            x={draft.screenX}
            y={draft.screenY}
            onSave={saveDraft}
            onCancel={cancelDraft}
          />
        )}
      </AnimatePresence>

      <div className="pointer-events-auto absolute top-3 left-3 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAnnotating(!isAnnotating)}
          className={`px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-all ${
            isAnnotating
              ? "bg-blue-500 text-white"
              : "glass-panel hover:bg-white/10"
          }`}
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
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          {isAnnotating ? "Click to Annotate" : "Enable Annotations"}
        </motion.button>

        {annotations.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearAnnotations}
            className="px-3 py-2 rounded-md bg-red-500/20 border border-red-500/30 text-red-300 text-sm hover:bg-red-500/30 transition-colors"
          >
            Clear All ({annotations.length})
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default AnnotationsCanvas;
