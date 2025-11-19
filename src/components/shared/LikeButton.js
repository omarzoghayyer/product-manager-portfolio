import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WAVE_STAGES = [
  { emoji: "🌊", label: "Wave sent", threshold: 0, color: "#06b6d4", glow: 1.3, rippleSize: 1 },
  { emoji: "💫", label: "Making waves", threshold: 5, color: "#3b82f6", glow: 1.45, rippleSize: 1 },
  { emoji: "✨", label: "Rising tide", threshold: 15, color: "#8b5cf6", glow: 1.6, rippleSize: 1 },
  { emoji: "🌟", label: "Legendary", threshold: 30, color: "#a855f7", glow: 1.8, rippleSize: 1 },
  { emoji: "🔥", label: "On fire", threshold: 50, color: "#f97316", glow: 2.0, rippleSize: 1 },
  { emoji: "🚀", label: "Launch mode", threshold: 75, color: "#22c55e", glow: 2.1, rippleSize: 1 },
  { emoji: "🌈", label: "Signal boost", threshold: 100, color: "#eab308", glow: 2.2, rippleSize: 1 },
  { emoji: "⚡", label: "Supercharged", threshold: 150, color: "#facc15", glow: 2.3, rippleSize: 1 },
  { emoji: "🌀", label: "Whirlpool", threshold: 200, color: "#0ea5e9", glow: 2.4, rippleSize: 1 },
  { emoji: "🌋", label: "Eruption", threshold: 300, color: "#ef4444", glow: 2.5, rippleSize: 1 },
  { emoji: "🌌", label: "Cosmic swell", threshold: 400, color: "#4f46e5", glow: 2.6, rippleSize: 1 },
  { emoji: "🏆", label: "Hall of fame", threshold: 500, color: "#f97316", glow: 2.7, rippleSize: 1 },
  { emoji: "👑", label: "King tide", threshold: 750, color: "#22c55e", glow: 2.8, rippleSize: 1 },
  { emoji: "∞", label: "Infinity wave", threshold: 1000, color: "#a855f7", glow: 3.0, rippleSize: 1 },
];

export default function LikeButton({ itemId, section, initialLikes, onLike, size = "default" }) {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const storageKey = `wave:${section}:${itemId}`;
    const hasLiked = localStorage.getItem(storageKey) === "true";
    setIsLiked(hasLiked);
  }, [itemId, section]);

  useEffect(() => {
    setLikes(initialLikes || 0);
  }, [initialLikes]);

  const getCurrentStage = (count) => {
    for (let i = WAVE_STAGES.length - 1; i >= 0; i--) {
      if (count >= WAVE_STAGES[i].threshold) {
        return WAVE_STAGES[i];
      }
    }
    return WAVE_STAGES[0];
  };

  const stage = getCurrentStage(likes);
  const nextStage = WAVE_STAGES.find((s) => s.threshold > likes);
  const maxThreshold = WAVE_STAGES[WAVE_STAGES.length - 1].threshold;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.debug("LikeButton: click", { itemId, section, isLiked });

    if (isLiked) {
      console.debug("LikeButton: already liked, ignoring");
      return;
    }

    // Debounce to prevent spam
    if (debounceTimer.current) return;

    debounceTimer.current = setTimeout(() => {
      debounceTimer.current = null;
    }, 300);

    const newLikes = likes + 1;
    const storageKey = `wave:${section}:${itemId}`;

    // Optimistic UI
    setIsAnimating(true);
    setIsLiked(true);
    setShowFeedback(true);
    setLikes(newLikes);

    // Remember on this browser
    localStorage.setItem(storageKey, "true");

    try {
      console.debug("LikeButton: calling onLike prop");
      await onLike();
      console.debug("LikeButton: onLike resolved");
    } catch (error) {
      console.error("Error sending wave:", error);
      // Revert on error
      setIsLiked(false);
      setLikes(likes);
      localStorage.removeItem(storageKey);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    setTimeout(() => {
      setShowFeedback(false);
    }, 2500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleLike(e);
    }
  };

  const sizeMap = {
    small: { icon: 20, container: 28 },
    default: { icon: 24, container: 32 },
    large: { icon: 32, container: 40 },
  };

  const dimensions = sizeMap[size];

  return (
    <button
      onClick={handleLike}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      // don't disable so hover still fires; we block extra likes in handleLike
      role="button"
      aria-pressed={isLiked}
      aria-label={`Send wave${isLiked ? " (already sent)" : ""}`}
      className={`relative inline-flex items-center gap-2 transition-all cursor-pointer group ${isLiked ? "opacity-100" : "opacity-60 hover:opacity-100"
        }`}
      style={{ pointerEvents: "auto" }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: dimensions.container, height: dimensions.container }}
      >
        {/* Wave SVG */}
        <motion.svg
          viewBox="0 0 24 24"
          style={{ width: dimensions.icon, height: dimensions.icon }}
          animate={
            isAnimating
              ? {
                x: [-2, 2, -2, 2, 0],
                scale: [1, 1.2, 1],
              }
              : isLiked
                ? {
                  x: [-1, 1, -1],
                }
                : {}
          }
          transition={
            isAnimating
              ? { duration: 0.6, ease: "easeOut" }
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <defs>
            <linearGradient id={`waveGradient-${itemId}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLiked ? stage.color : "#94a3b8"} />
              <stop offset="100%" stopColor={isLiked ? "#0ea5e9" : "#64748b"} />
            </linearGradient>
            <filter id={`glow-${itemId}`}>
              <feGaussianBlur stdDeviation={stage.glow * 3} result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Flowing wave path */}
          <motion.path
            d="M2 12c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm7 0c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm7 0c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3z"
            fill={isLiked ? `url(#waveGradient-${itemId})` : "none"}
            stroke={isLiked ? stage.color : "currentColor"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={isLiked ? `url(#glow-${itemId})` : "none"}
            animate={
              isLiked
                ? {
                  d: [
                    "M2 12c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm7 0c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm7 0c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3z",
                    "M2 10c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm7 2c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm7 0c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3z",
                    "M2 12c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm7 0c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3zm7 0c0-1.5 1.5-3 3-3s3 1.5 3 3-1.5 3-3 3-3-1.5-3-3z",
                  ],
                }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>

        {/* Ripple rings when liked */}
        <AnimatePresence>
          {isLiked && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 2.2 * stage.rippleSize, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  repeatDelay: 0.3,
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${stage.color}`,
                  opacity: stage.glow * 0.6,
                }}
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0.4 }}
                animate={{ scale: 2.2 * stage.rippleSize, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeOut",
                  repeatDelay: 0.3,
                  delay: 0.4,
                }}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${stage.color}`,
                  opacity: stage.glow * 0.4,
                }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Wave burst particles on click */}
        <AnimatePresence>
          {isAnimating && (
            <>
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * 360) / 6;
                return (
                  <motion.div
                    key={i}
                    initial={{
                      scale: 0,
                      x: 0,
                      y: 0,
                      opacity: 1,
                    }}
                    animate={{
                      scale: [0, 1, 0.5, 0],
                      x: Math.cos((angle * Math.PI) / 180) * 30,
                      y: Math.sin((angle * Math.PI) / 180) * 30,
                      opacity: [1, 0.8, 0.4, 0],
                    }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: stage.color,
                        boxShadow: `0 0 8px ${stage.color}`,
                      }}
                    />
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>

        {/* Ambient glow when liked */}
        {isLiked && (
          <motion.div
            animate={{
              opacity: [stage.glow * 0.2, stage.glow * 0.4, stage.glow * 0.2],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 -z-10 blur-2xl rounded-full"
            style={{
              background: `radial-gradient(circle, ${stage.color}40, transparent)`,
              transform: "scale(1.8)",
            }}
          />
        )}
      </div>

      {/* Stage + count tooltip on hover */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-50"
          >
            <div className="px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-xs font-medium shadow-lg flex items-center gap-2">
              <span>{stage.emoji}</span>
              <span>
                {stage.label}
                <span className="ml-2 opacity-80">
                  · {likes} {likes === 1 ? "wave" : "waves"}
                </span>
              </span>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback message */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-50"
          >
            <div
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-white backdrop-blur-sm shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${stage.color}f0, ${stage.color}e0)`,
                boxShadow: `0 4px 12px ${stage.color}60`,
              }}
            >
              <span className="mr-1">{stage.emoji}</span>
              {stage.label}
              {nextStage && likes < maxThreshold && (
                <span className="ml-2 opacity-70 text-[10px]">
                  {nextStage.threshold - likes} to {nextStage.emoji}
                </span>
              )}
            </div>
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-1"
              style={{
                width: 0,
                height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderTop: `5px solid ${stage.color}f0`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
