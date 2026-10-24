import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { visibleExperiments, EXPERIMENT_FIELDS, isMissing } from "../content/experiments";
import PageHeader from "../components/site/PageHeader";
import Markdown from "../components/site/Markdown";
import { usePageMeta } from "../lib/usePageMeta";

// Unwritten fields are flagged in development and left out on the live site.
const SHOW_MISSING = import.meta.env.DEV;

function FieldValue({ value }) {
  if (isMissing(value)) {
    return (
      <p className="rounded border border-dashed border-accent bg-accent-soft px-3 py-2 text-sm text-accent">
        Add details
      </p>
    );
  }
  return <Markdown compact>{value}</Markdown>;
}

function ExperimentEntry({ entry }) {
  return (
    <article id={entry.slug} aria-labelledby={`${entry.slug}-title`} className="card mb-8 scroll-mt-28 p-6 md:p-8">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {!isMissing(entry.period) && <span>{entry.period}</span>}
          {entry.draft && <span className="tag border-accent text-accent">Draft · only visible in development</span>}
        </div>
        <h2 id={`${entry.slug}-title`} className="mt-2 text-2xl">
          {entry.title}
        </h2>
      </header>

      <dl className="space-y-7">
        {EXPERIMENT_FIELDS.filter(({ key }) => SHOW_MISSING || !isMissing(entry[key])).map(({ key, label }) => (
          <div key={key} className="grid gap-2 md:grid-cols-[11rem_1fr] md:gap-8">
            <dt className="font-medium text-ink">{label}</dt>
            <dd>
              <FieldValue value={entry[key]} />
            </dd>
          </div>
        ))}
      </dl>

      {entry.links?.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 md:pl-[13rem]">
          {entry.links.map((l) => (
            <li key={l.href}>
              {l.href.startsWith("/") ? (
                <Link to={l.href} className="link text-[0.95rem] font-semibold">
                  {l.label}
                </Link>
              ) : (
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="link text-[0.95rem] font-semibold">
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function Experiments() {
  usePageMeta({
    title: "Experiments",
    description: "Experiments Omar tried, what he built, and what he learned.",
  });

  return (
    <div className="mx-auto max-w-[48rem] px-5">
      <div>
        <nav aria-label="Breadcrumb" className="pt-10 md:pt-14 text-sm">
          <Link to={createPageUrl("Projects")} className="link text-muted">
            ← Projects
          </Link>
        </nav>

        <PageHeader
          eyebrow="Projects"
          title="Experiments"
          intro="Here are ideas I tried, what I built, and what I learned."
        />

        {visibleExperiments.length > 0 ? (
          visibleExperiments.map((entry) => <ExperimentEntry key={entry.slug} entry={entry} />)
        ) : (
          <p className="text-center text-ink-2">
            No experiments yet. In the meantime, see my{" "}
            <Link to={createPageUrl("Projects")} className="link">
              projects
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}
