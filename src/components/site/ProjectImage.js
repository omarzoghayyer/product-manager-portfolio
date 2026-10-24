import React from "react";

// Every project image sits in the same 16:9 frame. Logos use `contain` on a
// flat background; photos and screenshots use `cover`.
export default function ProjectImage({ src, alt, fit = "cover", bg, eager = false, className = "" }) {
  return (
    <div
      className={`aspect-[16/9] w-full overflow-hidden bg-[#f1eee7] ${className}`}
      style={bg ? { backgroundColor: bg } : undefined}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full ${fit === "contain" ? "object-contain p-8" : "object-cover"}`}
      />
    </div>
  );
}
