import { AnimatePresence, motion } from "framer-motion";
import { useViewer } from "../../context/ViewerContext.jsx";

function TimelineBar() {
  const { timeline, timelineIndex, setTimelineIndex } = useViewer();
  const onChange = (e) => setTimelineIndex(Number(e.target.value));

  const goToPrevious = () => {
    if (timelineIndex > 0) {
      setTimelineIndex(timelineIndex - 1);
    }
  };

  const goToNext = () => {
    if (timelineIndex < timeline.length - 1) {
      setTimelineIndex(timelineIndex + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute left-0 right-0 bottom-3 mx-auto max-w-2xl glass-panel p-4"
    >
      <div className="flex items-center justify-between text-xs text-zinc-300 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
          <span className="font-medium">Historical Timeline</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={timelineIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="font-mono"
          >
            {timeline[timelineIndex]?.label} • {timelineIndex + 1}/
            {timeline.length}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPrevious}
          disabled={timelineIndex === 0}
          className="p-2 rounded-md glass-panel disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <div className="flex-1 relative">
          <input
            type="range"
            min={0}
            max={Math.max(timeline.length - 1, 0)}
            step={1}
            value={timelineIndex}
            onChange={onChange}
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer timeline-slider"
          />
          <div className="absolute -top-8 left-0 right-0 flex justify-between text-xs text-zinc-400">
            {timeline.map((item, index) => (
              <motion.div
                key={item.id}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === timelineIndex ? "bg-purple-400" : "bg-zinc-600"
                }`}
                whileHover={{ scale: 1.2 }}
                style={{
                  position: "absolute",
                  left: `${(index / Math.max(timeline.length - 1, 1)) * 100}%`,
                  transform: "translateX(-50%)",
                }}
              />
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNext}
          disabled={timelineIndex === timeline.length - 1}
          className="p-2 rounded-md glass-panel disabled:opacity-50 disabled:cursor-not-allowed"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      <div className="mt-3 text-xs text-zinc-400 text-center">
        <span>
          Navigate through time-series imagery • Use arrow keys or drag slider
        </span>
      </div>
    </motion.div>
  );
}

export default TimelineBar;
