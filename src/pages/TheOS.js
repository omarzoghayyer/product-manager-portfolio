import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Globe, MessageSquare, Phone, User, ChevronRight, Bell, ChevronLeft, Video, Mic, Instagram, Satellite, Camera, Clock, X as XIcon, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";

// ─── Shared status bar ────────────────────────────────────────────────────────

function StatusBar({ time = "12:55" }) {
  return (
    <div className="flex items-center justify-between px-3 pt-1.5 pb-1 flex-shrink-0">
      <span className="font-mono font-semibold text-white/50" style={{ fontSize: 9 }}>
        ● Starlink · <span style={{ color: "#3b82f6" }}>47ms</span>
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-white font-medium" style={{ fontSize: 10 }}>{time}</span>
        <div className="w-3 h-1.5 rounded-sm border border-white/40 flex items-center p-px">
          <div className="w-2/3 h-full rounded-sm bg-white/80" />
        </div>
      </div>
    </div>
  );
}

// ─── Star field background ────────────────────────────────────────────────────

function Stars() {
  const stars = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.3 ? 1.5 : 1,
      opacity: 0.2 + Math.random() * 0.5,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div key={s.id} className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, opacity: s.opacity }} />
      ))}
    </div>
  );
}

// ─── Screen: Orb (home) ───────────────────────────────────────────────────────

// Stable spark definitions (outside component so they don't re-randomize)
const SPARKS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  angle: (360 / 12) * i,
  dist: 50 + (i % 3) * 12,
  size: i % 4 === 0 ? 3 : i % 3 === 0 ? 2.5 : 2,
  delay: i * 0.06,
  color: i % 3 === 0 ? "#93c5fd" : i % 3 === 1 ? "#ffffff" : "#60a5fa",
}));

function OrbSparkles() {
  return (
    <div className="absolute pointer-events-none" style={{ width: 160, height: 160, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
      {SPARKS.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * s.dist;
        const ty = Math.sin(rad) * s.dist;
        return (
          <motion.div
            key={s.id}
            className="absolute rounded-full"
            style={{
              width: s.size, height: s.size,
              top: "50%", left: "50%",
              marginTop: -s.size / 2, marginLeft: -s.size / 2,
              backgroundColor: s.color,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: [0, tx * 0.5, tx],
              y: [0, ty * 0.5, ty],
              opacity: [0, 1, 0],
              scale: [0, 1.4, 0],
            }}
            transition={{
              duration: 0.9,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

const ICON_ACTIONS = [
  { id: "msg",    Icon: MessageSquare, label: "Message",      demo: "chat" },
  { id: "call",   Icon: Phone,         label: "Call",         demo: "msgs" },
  { id: "ig",     Icon: Instagram,     label: "Instagram",    demo: "web"  },
  { id: "notif",  Icon: Bell,          label: "Alerts",       demo: "notif"},
  { id: "x",      Icon: XIcon,         label: "X",            demo: "x"    },
  { id: "sat",    Icon: Satellite,     label: "Satellite",    demo: null   },
  { id: "cam",    Icon: Camera,        label: "Camera",       demo: null   },
];

function OrbScreen({ listening, onChipClick }) {
  const [flashedId, setFlashedId] = useState(null);
  const [orbHovered, setOrbHovered] = useState(false);

  const handleAction = (action) => {
    if (action.demo && onChipClick) {
      onChipClick(action.demo);
    } else {
      setFlashedId(action.id);
      setTimeout(() => setFlashedId(null), 500);
    }
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden" style={{ background: "linear-gradient(180deg, #04060f 0%, #060a18 60%, #04060f 100%)" }}>
      <Stars />
      <StatusBar />
      <div className="flex-1 flex flex-col items-center justify-center relative z-10" style={{ marginTop: -8 }}>
        {/* Orb */}
        <div
          className="relative flex items-center justify-center mb-5 cursor-pointer"
          style={{ width: 160, height: 160 }}
          onMouseEnter={() => setOrbHovered(true)}
          onMouseLeave={() => setOrbHovered(false)}
        >
          <motion.div className="absolute rounded-full"
            style={{ width: 130, height: 130, background: "radial-gradient(circle, rgba(30,100,255,0.12) 0%, transparent 70%)" }}
            animate={{ scale: orbHovered ? 1.3 : [1, 1.15, 1], opacity: orbHovered ? 0.9 : [0.7, 0.3, 0.7] }}
            transition={{ duration: orbHovered ? 0.3 : 3, repeat: orbHovered ? 0 : Infinity, ease: "easeInOut" }} />
          <motion.div className="absolute rounded-full"
            style={{ width: 96, height: 96, background: "radial-gradient(circle, rgba(30,100,255,0.18) 0%, transparent 65%)" }}
            animate={{ scale: orbHovered ? 1.2 : [1, 1.08, 1], opacity: orbHovered ? 1 : [0.8, 0.4, 0.8] }}
            transition={{ duration: orbHovered ? 0.3 : 2.2, repeat: orbHovered ? 0 : Infinity, ease: "easeInOut", delay: 0.4 }} />
          <motion.div
            animate={orbHovered ? { scale: 1.25 } : listening ? { scale: [1, 1.1, 1] } : { scale: [1, 1.03, 1] }}
            transition={{ duration: orbHovered ? 0.25 : listening ? 0.7 : 4, repeat: orbHovered ? 0 : Infinity, ease: "easeInOut" }}
            className="rounded-full relative"
            style={{
              width: 72, height: 72,
              background: orbHovered
                ? "radial-gradient(circle at 38% 32%, #93c5fd 0%, #3b82f6 35%, #1e3a8a 75%, #060e3a 100%)"
                : "radial-gradient(circle at 38% 32%, #5b9bff 0%, #1456f0 40%, #0a2a8a 80%, #060e3a 100%)",
              boxShadow: orbHovered
                ? "0 0 60px rgba(59,130,246,0.9), 0 0 100px rgba(30,80,200,0.5), inset 0 2px 8px rgba(255,255,255,0.25)"
                : "0 0 36px rgba(30,100,255,0.6), 0 0 70px rgba(30,80,200,0.3), inset 0 2px 8px rgba(255,255,255,0.15)",
              zIndex: 2,
            }}>
            <div className="absolute w-4 h-2.5 rounded-full bg-white/30 top-2.5 left-3.5" style={{ filter: "blur(3px)" }} />
          </motion.div>
          {orbHovered && <OrbSparkles />}
        </div>

        <p className="text-white/80 text-xs font-medium mb-1">What do you want to do?</p>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full mb-5"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
          <span className="text-xs font-mono text-white/40">
            Hey OS · {listening ? "listening…" : "always listening"} · 5mW
          </span>
        </div>

        {/* Icon action grid: 4 + 3 */}
        <div className="flex flex-col items-center gap-3 px-4 w-full">
          <div className="flex justify-center gap-4">
            {ICON_ACTIONS.slice(0, 4).map((a) => (
              <IconButton key={a.id} action={a} flashing={flashedId === a.id} onPress={handleAction} />
            ))}
          </div>
          <div className="flex justify-center gap-4">
            {ICON_ACTIONS.slice(4).map((a) => (
              <IconButton key={a.id} action={a} flashing={flashedId === a.id} onPress={handleAction} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IconButton({ action, flashing, onPress }) {
  const { Icon, label, demo } = action;
  const linked = !!demo;
  return (
    <motion.button
      onClick={() => onPress(action)}
      whileHover={{ scale: 1.12, y: -2 }}
      whileTap={{ scale: 0.88 }}
      animate={flashing ? {
        boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 14px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0)"]
      } : {}}
      className="flex flex-col items-center gap-1.5"
      style={{ outline: "none", background: "none", border: "none", cursor: "pointer" }}
    >
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
        style={{
          background: linked ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${linked ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.1)"}`,
        }}>
        <Icon style={{ width: 18, height: 18, color: linked ? "#93c5fd" : "rgba(255,255,255,0.6)" }} />
      </div>
      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", letterSpacing: "0.02em" }}>{label}</span>
    </motion.button>
  );
}

// ─── Screen: Messages list ────────────────────────────────────────────────────

const CONTACTS = [
  { initials: "SC", color: "#7c3aed", name: "Sarah Chen", preview: "Sounds good, see you then!", time: "now", unread: 2 },
  { initials: "MW", color: "#b45309", name: "Marcus Webb", preview: "the call quality was perfect", time: "2m", unread: 0 },
  { initials: "LH", color: "#0e7490", name: "Leila Hassan", preview: "sent you my QR code", time: "14m", unread: 1 },
];

function MessagesScreen({ onBack, onNavigate }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0c12" }}>
      <StatusBar />
      <div className="px-3 py-2 flex-shrink-0 flex items-center gap-2">
        <button onClick={onBack} className="p-1 -ml-1">
          <ChevronLeft className="w-4 h-4 text-blue-400" />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-white font-semibold text-sm">Messages</h2>
          <div className="w-2 h-2 rounded-full bg-blue-400" />
        </div>
      </div>
      <div className="mx-3 mb-3 px-3 py-2 rounded-lg flex-shrink-0"
        style={{ background: "rgba(30,58,138,0.25)", border: "1px solid rgba(59,130,246,0.2)" }}>
        <p className="text-xs font-mono" style={{ color: "#60a5fa" }}>
          Opening messages — ChaCha20-Poly1305 encrypted, routed over Starlink DHT.
        </p>
      </div>
      <div className="flex-1 overflow-hidden px-3 space-y-1">
        {CONTACTS.map((c) => (
          <motion.div key={c.name}
            onClick={() => onNavigate && onNavigate("chat")}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-semibold"
              style={{ background: c.color }}>
              {c.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className="text-white text-xs font-medium">{c.name}</span>
                <span className="text-gray-500 text-xs">{c.time}</span>
              </div>
              <p className="text-gray-400 text-xs truncate mt-0.5">{c.preview}</p>
            </div>
            {c.unread > 0 && (
              <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
                style={{ background: "#3b82f6", fontSize: 9 }}>
                {c.unread}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Screen: Chat ─────────────────────────────────────────────────────────────

function ChatScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0c12" }}>
      <StatusBar />
      <div className="flex items-center gap-3 px-3 py-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button onClick={onBack} className="p-0.5 flex-shrink-0">
          <ChevronLeft className="w-4 h-4 text-blue-400" />
        </button>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
          style={{ background: "#7c3aed" }}>SC</div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-semibold">Sarah Chen</p>
          <p className="text-xs font-mono text-white/40" style={{ fontSize: 9 }}>E2E encrypted · Starlink · ChaCha20</p>
        </div>
        <Phone className="w-3.5 h-3.5 text-gray-400" />
        <Video className="w-3.5 h-3.5 text-gray-400" />
      </div>
      <div className="flex-1 overflow-hidden px-3 py-2 space-y-2">
        <div className="text-center">
          <span className="text-xs px-2 py-0.5 rounded font-mono text-white/30" style={{ background: "rgba(255,255,255,0.05)", fontSize: 9 }}>
            Today · ChaCha20-Poly1305 · ed25519
          </span>
        </div>
        <div className="flex justify-start">
          <div className="px-3 py-1.5 rounded-2xl rounded-tl-sm max-w-[78%]" style={{ background: "rgba(255,255,255,0.08)" }}>
            <p className="text-white text-xs">Hey! Got your connection request</p>
            <p className="text-gray-500 mt-0.5" style={{ fontSize: 9 }}>9:41</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="px-3 py-1.5 rounded-2xl rounded-tr-sm max-w-[78%]"
            style={{ background: "linear-gradient(135deg, #1e40af, #2563eb)" }}>
            <p className="text-white text-xs">First theOS contact! No SIM, no carrier 🔥</p>
            <p className="text-blue-300 mt-0.5" style={{ fontSize: 9 }}>9:42 ✓✓</p>
          </div>
        </div>
        <div className="flex justify-start">
          <div className="px-3 py-1.5 rounded-2xl rounded-tl-sm max-w-[78%]" style={{ background: "rgba(255,255,255,0.08)" }}>
            <p className="text-white text-xs">Call quality over satellite is incredible</p>
            <p className="text-gray-500 mt-0.5" style={{ fontSize: 9 }}>9:43</p>
          </div>
        </div>
        <div className="flex justify-end">
          <div className="px-3 py-1.5 rounded-2xl rounded-tr-sm max-w-[78%]"
            style={{ background: "linear-gradient(135deg, #1e40af, #2563eb)" }}>
            <p className="text-white text-xs">Starlink beam switch — RE-INVITE worked perfectly</p>
            <p className="text-blue-300 mt-0.5" style={{ fontSize: 9 }}>9:44 ✓✓</p>
          </div>
        </div>
      </div>
      <div className="px-3 py-2 flex items-center gap-2 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex-1 px-3 py-1.5 rounded-full text-gray-500 text-xs" style={{ background: "rgba(255,255,255,0.06)" }}>
          Message…
        </div>
        <Mic className="w-4 h-4 text-blue-400" />
      </div>
    </div>
  );
}

// ─── Screen: Web (Instagram) ──────────────────────────────────────────────────

function BrowserScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0c12" }}>
      <StatusBar />
      <div className="px-3 py-2 flex-shrink-0 flex items-center gap-2">
        <button onClick={onBack} className="p-0.5">
          <ChevronLeft className="w-4 h-4 text-blue-400" />
        </button>
        <h2 className="text-white font-semibold text-sm">Instagram</h2>
      </div>
      <div className="mx-3 mb-2 px-3 py-1.5 rounded-lg flex-shrink-0"
        style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
        <p className="text-xs" style={{ color: "#a78bfa" }}>Privacy sandbox — 60+ trackers blocked, no fingerprinting.</p>
      </div>
      <div className="mx-3 mb-3 px-3 py-1.5 rounded-lg flex items-center gap-2 flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <Shield className="w-3 h-3 flex-shrink-0 text-white/40" />
        <p className="text-xs font-mono text-white/40">60+ trackers blocked · no fingerprint</p>
      </div>
      {/* Stories row */}
      <div className="flex gap-2 px-3 mb-3 flex-shrink-0">
        {[{ i: "SC", c: "#7c3aed", n: "sarah_c" }, { i: "MW", c: "#b45309", n: "marcusw" }, { i: "LH", c: "#0e7490", n: "leila" }].map((s) => (
          <div key={s.n} className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ background: s.c, boxShadow: `0 0 0 2px ${s.c}` }}>{s.i}</div>
            <p className="text-gray-400 text-xs" style={{ fontSize: 9 }}>{s.n}</p>
          </div>
        ))}
      </div>
      {/* Post */}
      <div className="mx-3 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: "#7c3aed" }}>SC</div>
          <div>
            <p className="text-white text-xs font-medium">sarah_chen</p>
            <p className="text-gray-500 text-xs">San Francisco</p>
          </div>
          <p className="ml-auto text-gray-600 text-sm">…</p>
        </div>
        <div className="w-full aspect-video" style={{ background: "linear-gradient(135deg, #1e1b4b, #312e81, #1e3a8a)" }}>
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white/20 text-xs">Golden Gate</p>
          </div>
        </div>
        <div className="px-3 py-2">
          <p className="text-white text-xs"><span className="font-semibold">1,284 likes</span></p>
          <p className="text-white text-xs mt-0.5"><span className="font-semibold">sarah_chen</span> first time in SF ✈️</p>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Notifications ────────────────────────────────────────────────────

function NotificationsScreen({ onBack }) {
  const notifs = [
    { initials: "SC", color: "#7c3aed", name: "Sarah Chen", body: "Sent you a message", meta: "2 min · DHT · ad25519 signed", tag: "message", tagColor: "#3b82f6" },
    { initials: "MW", color: "#b45309", name: "Marcus Webb", body: "Incoming call", meta: "14 min · ChaCha20 · Starlink", tag: "call", tagColor: "#10b981" },
    { initials: "LH", color: "#0e7490", name: "Leila Hassan", body: "Contact request", meta: "1 hr · ad25519 signed", tag: "request", tagColor: "#8b5cf6" },
  ];
  return (
    <div className="flex flex-col h-full" style={{ background: "#0a0c12" }}>
      <StatusBar />
      <div className="px-3 py-2 flex-shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <button onClick={onBack} className="p-0.5">
            <ChevronLeft className="w-4 h-4 text-blue-400" />
          </button>
          <h2 className="text-white font-semibold text-sm">Notifications</h2>
        </div>
        <p className="text-xs font-mono text-white/40 ml-6">DHT push · no FCM · no APNs</p>
      </div>
      <div className="flex-1 overflow-hidden px-3 space-y-2">
        {notifs.map((n) => (
          <div key={n.name} className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5"
              style={{ background: n.color }}>{n.initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium">{n.name}</p>
              <p className="text-gray-400 text-xs">{n.body}</p>
              <p className="text-gray-600 mt-0.5 font-mono" style={{ fontSize: 9 }}>{n.meta}</p>
              <div className="mt-1.5">
                <span className="px-2 py-0.5 rounded text-white text-xs font-medium"
                  style={{ background: n.tagColor, fontSize: 9 }}>{n.tag}</span>
              </div>
            </div>
          </div>
        ))}
        {/* Tracker blocked */}
        <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <Shield className="w-4 h-4 text-white/50" />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-medium">3 trackers blocked</p>
            <p className="text-gray-400 text-xs">Meta Pixel, GA, Hotjar — Instagram</p>
            <p className="text-gray-600 font-mono mt-0.5" style={{ fontSize: 9 }}>Just now · web proxy</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: X (Twitter) ─────────────────────────────────────────────────────

function XScreen({ onBack }) {
  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: "#000" }}>
      <StatusBar time="12:56" />
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 flex-shrink-0">
        <button onClick={onBack} className="p-0.5">
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <div className="text-center">
          <p className="text-white font-bold text-xs flex items-center gap-1 justify-center">
            Omar Zoghayyer
            <span style={{ color: "#1d9bf0", fontSize: 10 }}>✓</span>
          </p>
          <p className="text-white/40" style={{ fontSize: 9 }}>41 posts</p>
        </div>
        <Search className="w-4 h-4 text-white" />
      </div>

      {/* Cover photo */}
      <div className="relative flex-shrink-0" style={{ height: 64 }}>
        <div className="w-full h-full" style={{
          background: "linear-gradient(180deg, #0e4f6e 0%, #1a7a9e 40%, #0d3d54 100%)"
        }}>
          {/* City silhouette suggestion */}
          <div className="absolute bottom-0 left-0 right-0 h-8 opacity-40" style={{
            background: "linear-gradient(transparent, #000)"
          }} />
        </div>
        {/* Avatar */}
        <div className="absolute -bottom-5 left-3 w-10 h-10 rounded-full border-2 border-black overflow-hidden"
          style={{ background: "#374151" }}>
          <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">OZ</div>
        </div>
      </div>

      {/* Profile info */}
      <div className="px-3 pt-7 pb-2 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex justify-end mb-1">
          <div className="px-3 py-1 rounded-full border border-white/30 text-white font-bold" style={{ fontSize: 10 }}>
            Edit profile
          </div>
        </div>
        <p className="text-white font-bold text-xs flex items-center gap-1">
          Omar Zoghayyer <span style={{ color: "#1d9bf0" }}>✓</span>
        </p>
        <p className="text-white/50" style={{ fontSize: 9 }}>@OZoghayyer</p>
        <p className="text-white/80 mt-1 leading-snug" style={{ fontSize: 9 }}>
          I build software – quality is engineered. AAA titles @ Electronic Arts: Battlefield, Maxis – The Sims. Applied ML experimentation @ IMI Labs
        </p>
        <div className="flex items-center gap-2 mt-1 text-white/40" style={{ fontSize: 9 }}>
          <span>📍 San Francisco, CA</span>
          <span>· Joined Nov 2018</span>
        </div>
        <div className="flex gap-3 mt-1" style={{ fontSize: 9 }}>
          <span className="text-white"><strong>59</strong> <span className="text-white/40">Following</span></span>
          <span className="text-white"><strong>7</strong> <span className="text-white/40">Followers</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto flex-shrink-0 border-b" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
        {["Posts", "Replies", "Media", "Likes"].map((t, i) => (
          <div key={t} className="flex-shrink-0 px-3 py-2 relative" style={{ fontSize: 10 }}>
            <span className={i === 0 ? "text-white font-bold" : "text-white/40"}>{t}</span>
            {i === 0 && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#1d9bf0" }} />}
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="flex-1 overflow-hidden">
        {[
          { date: "Feb 17", text: "It's almost 2 AM in San Francisco. Reading about smart agents, AGI, and where things are heading. Some jobs will disappear." },
          { date: "Feb 16", text: "Can AI predict stock movements from news?\n\nI trained a model on +5,000 labeled articles. Most news has little measurable impact." },
        ].map((post, i) => (
          <div key={i} className="flex gap-2 px-3 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold"
              style={{ background: "#374151", fontSize: 8 }}>OZ</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-white font-bold" style={{ fontSize: 9 }}>Omar Zoghayyer</span>
                <span className="text-white/40" style={{ fontSize: 8 }}>· {post.date}</span>
              </div>
              <p className="text-white/80 leading-snug" style={{ fontSize: 9 }}>{post.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Demo config ──────────────────────────────────────────────────────────────

const DEMOS = [
  { id: "orb",   backTo: null,   command: null,                    label: "AI Orb",        icon: User,          description: "Voice-first. No buttons. No home screen.", screen: (l, cb, onBack) => <OrbScreen listening={l} onChipClick={cb} /> },
  { id: "msgs",  backTo: "orb",  command: "Hey OS, messages",      label: "Messages",      icon: MessageSquare, description: "ChaCha20 encrypted. Routed over Starlink DHT.", screen: (l, cb, onBack, onNav) => <MessagesScreen onBack={onBack} onNavigate={onNav} /> },
  { id: "chat",  backTo: "msgs", command: "Hey OS, message Sarah", label: "Encrypted Chat",icon: MessageSquare, description: "E2E encrypted. ed25519 signed. No server copy.", screen: (l, cb, onBack) => <ChatScreen onBack={onBack} /> },
  { id: "web",   backTo: "orb",  command: "Hey OS, open Instagram",label: "Web Rendering", icon: Globe,         description: "60+ trackers blocked. No fingerprinting.", screen: (l, cb, onBack) => <BrowserScreen onBack={onBack} /> },
  { id: "notif", backTo: "orb",  command: "Hey OS, notifications", label: "Notifications", icon: Bell,          description: "DHT push only. No FCM. No Apple APNs.", screen: (l, cb, onBack) => <NotificationsScreen onBack={onBack} /> },
  { id: "x",     backTo: "orb",  command: "Hey OS, open X",        label: "X / Twitter",   icon: XIcon,         description: "Rendered natively. No tracking. No ads.", screen: (l, cb, onBack) => <XScreen onBack={onBack} /> },
];

const COMPARISONS = [
  { name: "GrapheneOS",  noNumber: false, noCarrier: false, noStore: false, noTracking: true,  aiFirst: false },
  { name: "Signal",      noNumber: false, noCarrier: false, noStore: false, noTracking: true,  aiFirst: false },
  { name: "Nothing OS",  noNumber: false, noCarrier: false, noStore: false, noTracking: false, aiFirst: false },
  { name: "Apple (iOS)", noNumber: false, noCarrier: false, noStore: false, noTracking: false, aiFirst: false },
  { name: "theOS",       noNumber: true,  noCarrier: true,  noStore: true,  noTracking: true,  aiFirst: true  },
];

const MODULES = [
  "Cryptographic identity (Ed25519)", "DHT peer discovery", "Encrypted messenger",
  "Signal bridge", "Camera + photo signing", "AI wake engine", "Power manager",
  "Web proxy + tracker blocking", "Encrypted message store", "Speech-to-text pipeline",
  "Push notification system", "VoIP (ChaCha20-Poly1305)", "DHT bootstrap server",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TheOS() {
  const [activeDemo, setActiveDemo] = useState("orb");
  const [isListening, setIsListening] = useState(false);

  const handleCommand = (demo) => {
    if (demo.id === activeDemo) return;
    setIsListening(true);
    setTimeout(() => { setActiveDemo(demo.id); setIsListening(false); }, 600);
  };

  const handleChipClick = (demoId) => {
    if (demoId === activeDemo) return;
    setIsListening(true);
    setTimeout(() => { setActiveDemo(demoId); setIsListening(false); }, 500);
  };

  const handleBack = () => {
    const current = DEMOS.find((d) => d.id === activeDemo);
    if (current?.backTo) setActiveDemo(current.backTo);
  };

  const handleNavigate = (demoId) => {
    if (demoId !== activeDemo) setActiveDemo(demoId);
  };

  const active = DEMOS.find((d) => d.id === activeDemo);

  return (
    <div className="min-h-screen text-white" style={{ background: "#0a0a0a" }}>

      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(30,58,138,0.2) 0%, transparent 60%)" }} />
        <Stars />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6 border"
              style={{ background: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.25)", color: "#4ade80" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Currently Building
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4" style={{
              background: "linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #3b82f6 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              theOS
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-3 max-w-2xl mx-auto font-light">
              A mobile OS that replaces the phone number, the carrier, and the app store with cryptography, satellites, and AI.
            </p>
            <p className="text-sm text-gray-500 max-w-xl mx-auto mb-8">
              Your identity is an Ed25519 keypair. Your connectivity is Starlink. Nobody can take either away from you.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {[{ v: "317", l: "Tests passing" }, { v: "13", l: "Rust modules" }, { v: "0", l: "Phone numbers" }, { v: "Rust", l: "Language" }].map((s) => (
                <div key={s.l} className="text-center">
                  <p className="text-2xl font-bold text-white">{s.v}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.l}</p>
                </div>
              ))}
            </div>
            <a href="#demo">
              <Button className="text-white px-6 py-2 text-sm border-0"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>
                See the Demo <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo */}
      <section id="demo" className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">No buttons. No home screen. Just speak.</h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">Click a command to see what theOS renders.</p>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10">
            {/* Phone */}
            <div className="flex-shrink-0">
              <div className="relative" style={{ width: 240, height: 490 }}>
                <div className="absolute inset-0 rounded-[2.8rem]"
                  style={{ background: "#111", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 0 60px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.04)" }} />
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full z-10" style={{ background: "#1a1a1a" }} />
                <div className="absolute inset-[10px] rounded-[2.2rem] overflow-hidden bg-black">
                  <AnimatePresence mode="wait">
                    <motion.div key={activeDemo} className="w-full h-full"
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
                      {active.screen(isListening, handleChipClick, handleBack, handleNavigate)}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
              </div>
            </div>

            {/* Commands */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {DEMOS.map((demo) => {
                const Icon = demo.icon;
                const isActive = activeDemo === demo.id;
                return (
                  <motion.button key={demo.id} onClick={() => handleCommand(demo)} whileHover={{ x: 3 }}
                    className="text-left px-3 py-2.5 rounded-xl border transition-all duration-200 w-full"
                    style={{
                      background: isActive ? "rgba(30,58,138,0.28)" : "rgba(255,255,255,0.025)",
                      borderColor: isActive ? "rgba(59,130,246,0.45)" : "rgba(255,255,255,0.07)",
                    }}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: isActive ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)" }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: isActive ? "#60a5fa" : "#6b7280" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        {demo.command && (
                          <p className="font-mono mb-0.5 truncate" style={{ fontSize: 10, color: isActive ? "#93c5fd" : "#374151" }}>
                            "{demo.command}"
                          </p>
                        )}
                        <p className="text-xs font-medium" style={{ color: isActive ? "#fff" : "#9ca3af" }}>{demo.label}</p>
                        <p className="text-gray-600 truncate" style={{ fontSize: 10, marginTop: 1 }}>{demo.description}</p>
                      </div>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0 animate-pulse" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">The 150-year-old problem</h2>
            <div className="rounded-xl p-6 md:p-8" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Phone numbers are an artifact of copper wire telephone networks. Every modern phone still requires one —
                not because it's technically necessary, but because carriers built the infrastructure and governments
                assigned the spectrum, creating a system where{" "}
                <span className="text-white font-medium">nobody can communicate without a carrier's permission.</span>
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                theOS removes that dependency entirely. Your identity is an Ed25519 keypair. Your connectivity is
                Starlink. You can only be reached by people who have scanned your QR code. No carrier can deactivate you.
                No spam caller can reach you. Mathematically enforced — not policy enforced.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Everyone else hardened the existing system.</h2>
          <p className="text-gray-500 text-sm text-center mb-8">theOS replaces the foundation.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <th className="text-left py-2.5 pr-6 text-gray-500 font-medium text-xs">System</th>
                  {["No phone #", "No carrier", "No app store", "No tracking", "AI-first"].map((h) => (
                    <th key={h} className="text-center py-2.5 px-3 text-gray-500 font-medium text-xs whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISONS.map((row, i) => (
                  <motion.tr key={row.name} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }} viewport={{ once: true }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: row.name === "theOS" ? "rgba(30,58,138,0.15)" : "transparent" }}>
                    <td className="py-3 pr-6">
                      <span className={`text-sm font-medium ${row.name === "theOS" ? "text-blue-400" : "text-gray-400"}`}>{row.name}</span>
                    </td>
                    {[row.noNumber, row.noCarrier, row.noStore, row.noTracking, row.aiFirst].map((val, j) => (
                      <td key={j} className="text-center py-3 px-3">
                        {val ? <span className="text-green-400 text-sm">✓</span> : <span className="text-gray-800 text-sm">✗</span>}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">317 tests. 13 modules. Pure Rust.</h2>
            <p className="text-gray-500 text-sm">Platform-independent — runs on Windows, Linux, Android, anything with a Rust compiler.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {MODULES.map((mod, i) => (
              <motion.div key={mod} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }} viewport={{ once: true }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{mod}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestone */}
      <section className="py-16" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">The next milestone</h2>
            <div className="rounded-xl p-6 md:p-8 mb-8"
              style={{ background: "rgba(30,58,138,0.12)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <p className="text-sm text-gray-200 leading-relaxed mb-3">
                A 60-second video of two OnePlus 6 devices making an encrypted voice call —
                <span className="text-white font-semibold"> no SIM cards, no carrier, no phone numbers</span> —
                identified only by Ed25519 keypairs, routed over Starlink.
              </p>
              <p className="text-gray-500 text-sm">
                That video is the entire pitch. Everything else follows from 60 seconds of proof.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["Show HN", "NLnet Grant", "YC Application", "Seed Funding"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-full text-gray-300 text-xs"
                    style={{ border: "1px solid rgba(255,255,255,0.12)" }}>{step}</div>
                  {i < 3 && <ChevronRight className="w-3.5 h-3.5 text-gray-700" />}
                </div>
              ))}
            </div>
            <Link to={createPageUrl("Contact")}>
              <Button className="text-white px-6 py-2 text-sm border-0"
                style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>
                Get in Touch <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
