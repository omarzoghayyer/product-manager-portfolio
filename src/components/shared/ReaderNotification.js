import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

// Real-world major cities for more authentic feel
const LOCATIONS = [
  "San Francisco", "New York", "London", "Tokyo", "Berlin",
  "Toronto", "Sydney", "Paris", "Singapore", "Amsterdam",
  "Los Angeles", "Seattle", "Austin", "Boston", "Chicago",
  "Miami", "Denver", "Portland", "Barcelona", "Dublin",
  "Stockholm", "Copenhagen", "Melbourne", "Vancouver", "Montreal"
];

const MESSAGES = [
  "just discovered this",
  "is exploring this now",
  "found this fascinating",
  "recently viewed this",
  "is reading this",
];

export default function ReaderNotification({ items, type = "case study" }) {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const showRandomNotification = () => {
      const randomItem = items[Math.floor(Math.random() * items.length)];
      const randomLocation = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      
      setNotification({
        location: randomLocation,
        message: randomMessage,
        title: randomItem.title,
        type: type
      });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 6000);
    };

    // Show first notification after 8-15 seconds
    const initialDelay = 8000 + Math.random() * 7000;
    const initialTimer = setTimeout(showRandomNotification, initialDelay);

    // Then show every 45-90 seconds (less frequent)
    const intervalTimer = setInterval(() => {
      if (!isVisible) {
        showRandomNotification();
      }
    }, 45000 + Math.random() * 45000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [items, type, isVisible]);

  if (!notification) return null;

  const position = scrollY > 300 ? "top-6" : "bottom-6";
  
  const colors = {
    "case study": {
      gradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
      border: "border-violet-200/50",
      glow: "shadow-violet-500/20",
      accent: "from-violet-500 to-fuchsia-500",
      dot: "bg-violet-500",
    },
    insight: {
      gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
      border: "border-cyan-200/50",
      glow: "shadow-cyan-500/20",
      accent: "from-cyan-500 to-indigo-500",
      dot: "bg-cyan-500",
    },
  };

  const colorScheme = colors[notification.type] || colors.insight;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, y: -20, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            opacity: { duration: 0.3 }
          }}
          className={`fixed ${position} right-6 z-50 max-w-sm pointer-events-none`}
        >
          <div className="relative">
            {/* Animated background glow */}
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`absolute -inset-2 bg-gradient-to-br ${colorScheme.gradient} blur-2xl rounded-3xl`}
            />

            {/* Main card with glassmorphism */}
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(20px)" }}
              className={`relative backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-2xl ${colorScheme.glow} border ${colorScheme.border} overflow-hidden`}
            >
              {/* Animated gradient border top */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className={`absolute top-0 left-0 h-1 bg-gradient-to-r ${colorScheme.accent}`}
              />

              {/* Sparkle particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      opacity: 0, 
                      x: Math.random() * 100 - 50,
                      y: Math.random() * 100 - 50,
                      scale: 0
                    }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.random() * 200 - 100,
                      y: Math.random() * 200 - 100,
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className={`absolute w-1 h-1 ${colorScheme.dot} rounded-full blur-[0.5px]`}
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + i * 10}%`,
                    }}
                  />
                ))}
              </div>

              <div className="relative p-5">
                <div className="flex items-start gap-4">
                  {/* Animated icon */}
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${colorScheme.accent} flex items-center justify-center shadow-lg`}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    {/* Live indicator */}
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className={`w-2 h-2 ${colorScheme.dot} rounded-full shadow-lg`}
                      />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Live Activity
                      </span>
                    </div>

                    {/* Location and action */}
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-sm mb-1"
                    >
                      <span className="font-semibold bg-gradient-to-r ${colorScheme.accent} bg-clip-text text-transparent">
                        Someone in {notification.location}
                      </span>
                    </motion.p>
                    
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xs text-gray-600 dark:text-gray-400 mb-2"
                    >
                      {notification.message}
                    </motion.p>

                    {/* Title with gradient background */}
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`mt-2 px-3 py-2 rounded-lg bg-gradient-to-r ${colorScheme.gradient} border ${colorScheme.border}`}
                    >
                      <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">
                        "{notification.title}"
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Animated shine effect */}
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}