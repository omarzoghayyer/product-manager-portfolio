import React from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// Internal links use the router; external links open in a new tab.
function MarkdownLink({ href = "", children }) {
  if (href.startsWith("/")) return <Link to={href}>{children}</Link>;
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

export default function Markdown({ children, compact = false, className = "" }) {
  return (
    <div className={["prose-article", compact && "prose-compact", className].filter(Boolean).join(" ")}>
      <ReactMarkdown components={{ a: MarkdownLink }}>{children}</ReactMarkdown>
    </div>
  );
}
