import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { projects, getProject, projectHref } from "../content/projects";
import Markdown from "../components/site/Markdown";
import ProjectImage from "../components/site/ProjectImage";
import { usePageMeta } from "../lib/usePageMeta";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProject(slug);

  usePageMeta({ title: project?.title, description: project?.summary, skip: !project });

  if (!project) return <NotFound />;
  // Entries with their own page (theOS) or no write-up don't use this view.
  if (project.href) return <Navigate to={project.href} replace />;
  if (!project.sections?.length) return <Navigate to={createPageUrl("Projects")} replace />;

  // Previous / next within the same group, skipping entries without a page.
  const siblings = projects.filter((p) => p.kind === project.kind && projectHref(p));
  const index = siblings.findIndex((p) => p.slug === project.slug);
  const prev = siblings[index - 1];
  const next = siblings[index + 1];

  return (
    <article className="mx-auto max-w-page px-5 md:px-8">
      <div className="mx-auto max-w-prose">
        <nav aria-label="Breadcrumb" className="pt-10 md:pt-14 text-sm">
          <Link to={createPageUrl("Projects")} className="link text-muted">
            ← Projects
          </Link>
        </nav>

        <header className="pt-8 pb-8">
          <p className="text-[0.95rem] text-muted">
            {project.org}
            {project.period && <> · {project.period}</>}
          </p>
          <h1 className="mt-3 text-[2rem] font-extrabold leading-tight md:text-[2.75rem]">{project.title}</h1>
          {project.role && <p className="mt-3 text-ink-2">{project.role}</p>}
          <p className="mt-5 text-lg md:text-xl leading-relaxed text-ink-2">{project.summary}</p>
        </header>
      </div>

      {project.image && (
        <figure className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-line">
          <ProjectImage src={project.image} alt={project.imageAlt} fit={project.imageFit} bg={project.imageBg} eager />
        </figure>
      )}

      <div className="mx-auto max-w-prose py-12">
        {project.sections.map((section) => (
          <section key={section.heading} className="mb-10 last:mb-0">
            <h2 className="mb-4 text-xl md:text-2xl">{section.heading}</h2>
            <Markdown compact>{section.body}</Markdown>
          </section>
        ))}

        {(project.skills?.length > 0 || project.links?.length > 0) && (
          <dl className="mt-12 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
            {project.skills?.length > 0 && (
              <div>
                <dt className="eyebrow mb-3">Skills &amp; tools</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {project.skills.map((s) => (
                      <li key={s} className="tag">
                        {s}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            {project.links?.length > 0 && (
              <div>
                <dt className="eyebrow mb-3">Links</dt>
                <dd>
                  <ul className="space-y-2">
                    {project.links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                          {l.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
          </dl>
        )}

        {project.gallery?.length > 0 && (
          <div className="mt-12 grid gap-4">
            {project.gallery.map((g) => (
              <figure key={g.alt} className="overflow-hidden rounded-lg border border-line">
                <ProjectImage src={g.src} alt={g.alt} fit={g.fit} bg={g.bg} />
              </figure>
            ))}
          </div>
        )}

        {(prev || next) && (
          <nav aria-label="More projects" className="mt-14 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            {prev ? (
              <Link to={projectHref(prev)} className="group">
                <span className="block text-sm text-muted">← Previous</span>
                <span className="mt-1 block font-medium group-hover:text-accent transition-colors">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={projectHref(next)} className="group sm:text-right">
                <span className="block text-sm text-muted">Next →</span>
                <span className="mt-1 block font-medium group-hover:text-accent transition-colors">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>
    </article>
  );
}
