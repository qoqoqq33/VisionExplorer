import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel p-4 md:p-6 flex items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">
            Zoom into the Unknown
          </h2>
          <p className="text-zinc-300 text-sm mt-1">
            High‑res tiles, smooth controls, and rich overlays.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#features"
            className="px-3 py-2 rounded-md glass-panel text-sm"
          >
            Learn More
          </a>
          <a
            href="#docs"
            className="px-3 py-2 rounded-md bg-white text-zinc-900 text-sm font-medium"
          >
            Get Started
          </a>
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
