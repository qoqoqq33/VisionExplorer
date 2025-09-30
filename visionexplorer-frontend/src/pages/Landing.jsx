import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoaderOverlay from "../components/Loader/LoaderOverlay.jsx";
import ThreeHero from "../components/Three/ThreeHero.jsx";
import Hero from "../shared/Hero.jsx";
import Navbar from "../shared/Navbar.jsx";

function Landing() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fallback = setTimeout(() => setReady(true), 2000);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div className="page-container">
      <Navbar />
      <main className="relative overflow-hidden">
        <ThreeHero onReady={() => setReady(true)} />
        <LoaderOverlay visible={!ready} text="Preparing the cosmos…" />
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="pointer-events-none bg-[radial-gradient(circle_at_20%_20%,#60a5fa22,transparent_40%),radial-gradient(circle_at_80%_30%,#a78bfa22,transparent_40%),radial-gradient(circle_at_50%_80%,#f472b622,transparent_35%)] w-full h-full"></div>
        </div>

        <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-sm text-blue-300 mb-6">
              🚀 Tomorrow's Work with Today's ImageViewers
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight gradient-text mb-8"
          >
            VisionExplorer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xl md:text-2xl text-zinc-300 max-w-4xl mx-auto leading-relaxed mb-12"
          >
            The next-generation platform for satellite imagery analysis.
            <br className="hidden md:block" />
            <span className="text-white font-medium">
              Pan, zoom, annotate, and discover
            </span>{" "}
            with AI-powered insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/explore"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                Start Exploring
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-xl glass-panel font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              View on GitHub
            </a>
          </motion.div>
        </section>

        <Hero />

        <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Powerful Features
            </h2>
            <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
              Built for professionals who need advanced imagery analysis tools.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature
              title="Ultra‑Smooth Viewer"
              desc="Pan, rotate, and infinite‑zoom with tile streaming for seamless exploration."
              icon="🔍"
            />
            <Feature
              title="AI-Powered Analysis"
              desc="Ask AI what you're seeing in any region. Get instant insights about terrain and objects."
              icon="🤖"
            />
            <Feature
              title="Smart Annotations"
              desc="Mark points of interest with contextual notes. Persistent storage keeps discoveries safe."
              icon="📍"
            />
          </div>
        </section>

        <footer className="py-12 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h4 className="text-xl font-bold gradient-text mb-2">
              VisionExplorer
            </h4>
            <p className="text-zinc-400 mb-4">
              Tomorrow's Work with Today's ImageViewers
            </p>
            <p className="text-sm text-zinc-500">
              Built with ❤️ by Team VisionExplorer • ©{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
function Feature({ title, desc, icon = "🔍" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div className="p-6 rounded-xl glass-panel h-full hover:bg-white/10 transition-all duration-300">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-300 transition-colors">
          {title}
        </h3>
        <p className="text-zinc-300 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default Landing;
