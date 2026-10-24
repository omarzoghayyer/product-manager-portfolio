import React, { useState } from "react";
import { posts, formatDate } from "../content/writing";
import { personalProjects, projectHref } from "../content/projects";
import PageHeader from "../components/site/PageHeader";
import EntryCard from "../components/site/EntryCard";
import { usePageMeta } from "../lib/usePageMeta";

// Long-form project write-ups double as reading material until there are
// more essays.
const writeUps = personalProjects.filter((p) => !p.href && p.sections?.length);

const FILTERS = [
  { id: "all", label: "All" },
  { id: "essays", label: "Essays" },
  { id: "writeups", label: "Project write-ups" },
];

export default function Writing() {
  usePageMeta({
    title: "Writing",
    description: "Essays and notes on software, quality engineering, hardware, and AI by Omar Zoghayyer.",
  });

  const [filter, setFilter] = useState("all");

  return (
    <div className="mx-auto max-w-[48rem] px-5">
      <PageHeader
        eyebrow="Writing"
        title="Writing"
        intro="Notes on software, products, hardware, and AI."
      />

      <div className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-line" role="group" aria-label="Filter writing">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="chip"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filter !== "writeups" && (
        <section aria-labelledby="essays-heading" className="mb-12">
          <h2 id="essays-heading" className="mb-4 text-xl">
            Essays
          </h2>
          {posts.length > 0 ? (
            <ul className="space-y-5">
              {posts.map((post) => (
                <li key={post.slug}>
                  <EntryCard
                    to={`/writing/${post.slug}`}
                    title={post.title}
                    description={post.description}
                    meta={formatDate(post.date)}
                    badge={post.draft ? "Draft · only visible in development" : undefined}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-ink-2">
              No essays yet. You can read my project write-ups in the meantime.
            </p>
          )}
        </section>
      )}

      {filter !== "essays" && writeUps.length > 0 && (
        <section aria-labelledby="writeups-heading">
          <h2 id="writeups-heading" className="mb-4 text-xl">
            Project write-ups
          </h2>
          <ul className="space-y-5">
            {writeUps.map((p) => (
              <li key={p.slug}>
                <EntryCard to={projectHref(p)} title={p.title} description={p.summary} meta={`${p.org} · ${p.period}`} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
