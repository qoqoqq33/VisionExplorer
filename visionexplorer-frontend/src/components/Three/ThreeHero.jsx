import { useEffect } from "react";

function ThreeHero({ onReady }) {
  useEffect(() => {
    // Simple fallback - just call onReady after a brief delay
    const timer = setTimeout(() => {
      if (onReady) {
        onReady();
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [onReady]);

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20">
      {/* Simple animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
}

export default ThreeHero;
