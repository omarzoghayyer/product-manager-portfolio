import React from "react";

// Left-aligned page title with a small label and a marker underline on the
// key word.
export default function PageHeader({ eyebrow, title, intro, children }) {
  return (
    <header className="pt-12 pb-10 md:pt-16 md:pb-12">
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="text-[2.4rem] font-extrabold md:text-[3.25rem]">
        <span className="hl">{title}</span>
      </h1>
      {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-2">{intro}</p>}
      {children}
    </header>
  );
}
