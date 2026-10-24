import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { workProjects, personalProjects, projectHref } from "../content/projects";
import PageHeader from "../components/site/PageHeader";
import EntryCard from "../components/site/EntryCard";
import { usePageMeta } from "../lib/usePageMeta";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "personal", label: "Personal" },
];

function ProjectList({ id, title, items }) {
  return (
    <section aria-labelledby={id} className="mt-10 first:mt-0">
      <h2 id={id} className="mb-4 text-xl">
        {title}
      </h2>
      <ul className="space-y-5">
        {items.map((p) => (
          <li key={p.slug}>
            <EntryCard
              to={projectHref(p)}
              title={p.title}
              description={p.summary}
              meta={[p.org, p.period].filter(Boolean).join(" · ")}
              image={p.image}
              imageAlt=""
              imageFit={p.imageFit}
              imageBg={p.imageBg}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Projects() {
  usePageMeta({
    title: "Projects",
    description: "Projects Omar has worked on at Scopely, EA, Zoox, and FightPandemics, plus independent projects.",
  });

  const [filter, setFilter] = useState("all");

  return (
    <div className="mx-auto max-w-[48rem] px-5">
      <PageHeader
        eyebrow="Work"
        title="Projects"
        intro="Projects from my work and independent projects I've built."
      />

      <div className="mb-10 flex flex-wrap gap-x-6 gap-y-2 border-b border-line" role="group" aria-label="Filter projects">
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
        <Link to={createPageUrl("Experiments")} className="chip">
          Experiments
        </Link>
      </div>

      {filter !== "personal" && <ProjectList id="work-heading" title="Work" items={workProjects} />}
      {filter !== "work" && <ProjectList id="personal-heading" title="Personal projects" items={personalProjects} />}

      <section aria-labelledby="experiments-heading" className="mt-14 rounded-xl bg-accent-soft p-6">
        <h2 id="experiments-heading" className="text-xl">
          Experiments
        </h2>
        <p className="mt-2 text-ink-2">
          Experiments that taught me something, even when they didn't work out.
        </p>
        <Link to={createPageUrl("Experiments")} className="link mt-4 inline-block font-semibold">
          See experiments
        </Link>
      </section>
    </div>
  );
}
