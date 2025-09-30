function LoaderOverlay({ visible = false, text = "Initializing…" }) {
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
    >
      <div className="glass-panel px-6 py-5 flex items-center gap-3">
        <svg
          className="animate-spin text-white"
          width="22"
          height="22"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-100"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <span className="text-sm text-zinc-200">{text}</span>
      </div>
    </div>
  );
}

export default LoaderOverlay;
