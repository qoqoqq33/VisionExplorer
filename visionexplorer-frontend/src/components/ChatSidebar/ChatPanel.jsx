import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useViewer } from "../../context/ViewerContext.jsx";

function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex justify-start"
    >
      <div className="glass-panel px-3 py-2 rounded-lg max-w-[80%]">
        <div className="flex items-center space-x-1">
          <span className="text-sm text-zinc-300">AI is thinking</span>
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 bg-white rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChatBubble({ role, text, index }) {
  const isUser = role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
            : "glass-panel text-zinc-100"
        }`}
      >
        {text}
      </div>
    </motion.div>
  );
}

function ChatPanel() {
  const { messages, askAI, isThinking } = useViewer();
  const [input, setInput] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isThinking) return;
    askAI(text);
    setInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-3"
    >
      <h3 className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
        AI Insights
      </h3>

      <div className="h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        <AnimatePresence>
          {messages.map((m, index) => (
            <ChatBubble key={m.id} role={m.role} text={m.text} index={index} />
          ))}
          {isThinking && <ThinkingIndicator />}
        </AnimatePresence>
      </div>

      <form onSubmit={submit} className="grid grid-cols-[1fr_auto] gap-2">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          style={{
            background: "rgba(39,39,42,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          placeholder="Ask: What do you see in this region?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isThinking}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-3 py-2 rounded-md glass-panel text-sm relative overflow-hidden"
          type="submit"
          disabled={isThinking || !input.trim()}
        >
          <AnimatePresence mode="wait">
            {isThinking ? (
              <motion.span
                key="thinking"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center space-x-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-3 h-3 border border-white border-t-transparent rounded-full"
                  />
                </div>
              </motion.span>
            ) : (
              <motion.span
                key="send"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Send
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </motion.div>
  );
}

export default ChatPanel;
