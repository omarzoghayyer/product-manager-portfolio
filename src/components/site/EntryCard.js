import React from "react";
import { Link } from "react-router-dom";

// White card with a bold title and short description: the basic
// building block for project, writing, and experiment lists.
export default function EntryCard({
  to,
  title,
  description,
  meta,
  badge,
  image,
  imageAlt,
  imageFit = "cover",
  imageBg,
  headingLevel = 3,
}) {
  const Heading = `h${headingLevel}`;
  const external = to && /^https?:\/\//.test(to);

  const inner = (
    <div className="flex items-center gap-5 px-5 py-5 md:px-6 md:py-6">
      <div className="min-w-0 flex-1">
        {(meta || badge) && (
          <p className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted">
            {meta && <span>{meta}</span>}
            {badge && (
              <span className="tag">{badge}</span>
            )}
          </p>
        )}
        <Heading className="text-[1.15rem] leading-snug text-ink md:text-[1.25rem]">{title}</Heading>
        {description && <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-2">{description}</p>}
      </div>
      {image && (
        <img
          src={image}
          alt={imageAlt || ""}
          loading="lazy"
          decoding="async"
          className={`hidden h-16 w-24 shrink-0 rounded-md sm:block ${
            imageFit === "contain" ? "object-contain p-1.5 ring-1 ring-line" : "object-cover"
          }`}
          style={imageBg ? { backgroundColor: imageBg } : undefined}
        />
      )}
    </div>
  );

  if (!to) return <article className="card">{inner}</article>;
  if (external) {
    return (
      <article>
        <a href={to} target="_blank" rel="noopener noreferrer" className="card">
          {inner}
        </a>
      </article>
    );
  }
  return (
    <article>
      <Link to={to} className="card">
        {inner}
      </Link>
    </article>
  );
}
