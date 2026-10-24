import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { usePageMeta } from "../lib/usePageMeta";

export default function NotFound() {
  usePageMeta({ title: "Page not found" });

  return (
    <div className="mx-auto max-w-page px-5 py-24 md:px-8 md:py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-4xl md:text-5xl">This page doesn't exist.</h1>
      <p className="mt-5 max-w-xl text-lg text-ink-2">
        The link may be old. Try one of these pages:
      </p>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        <li><Link to={createPageUrl("Home")} className="link">Home</Link></li>
        <li><Link to={createPageUrl("Projects")} className="link">Projects</Link></li>
        <li><Link to={createPageUrl("Writing")} className="link">Writing</Link></li>
        <li><Link to={createPageUrl("About")} className="link">About</Link></li>
      </ul>
    </div>
  );
}
