import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { site } from "../content/site";
import { featuredProjects, workProjects, projectHref } from "../content/projects";
import { education } from "../content/about";
import { posts, formatDate } from "../content/writing";
import EntryCard from "../components/site/EntryCard";
import ProjectImage from "../components/site/ProjectImage";
import SocialLinks from "../components/site/SocialLinks";
import { usePageMeta } from "../lib/usePageMeta";
import avatarImg from "../assets/profile.jpeg";

function Section({ id, label, title, action, children }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-14 md:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{label}</p>
          <h2 id={id} className="mt-2 text-2xl md:text-3xl">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function ProjectTile({ project }) {
  return (
    <Link to={projectHref(project)} className="card group h-full overflow-hidden">
      <div className="border-b border-line">
        <ProjectImage src={project.image} alt={project.imageAlt} fit={project.imageFit} bg={project.imageBg} />
      </div>
      <div className="p-5 md:p-6">
        <p className="text-sm text-muted">
          {project.org} · {project.period}
        </p>
        <h3 className="mt-1.5 text-[1.2rem] leading-snug group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-2">{project.summary}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  usePageMeta();

  const showcase = featuredProjects.filter((p) => p.slug !== "theos" && p.image);
  const recentPosts = posts.slice(0, 3);
  const mba = education[0];

  const now = [
    { label: "Working on", body: "Quality engineering for Monopoly GO! at Scopely.", to: null },
    { label: "Studying", body: `${mba.title} at ${mba.org}.`, to: null },
  ];

  return (
    <div className="mx-auto max-w-[72rem] px-5 md:px-10">
      {/* Hero */}
      <section className="grid items-center gap-10 pt-10 pb-14 md:grid-cols-[1fr_auto] md:gap-16 md:pt-16 md:pb-20">
        <div>
          <p className="eyebrow">{site.role}</p>
          <h1 className="mt-4 max-w-3xl text-[2.4rem] font-extrabold leading-[1.1] sm:text-[3rem] lg:text-[3.6rem]">
            I build software, explore hardware, and use AI to test bold ideas.
          </h1>
          <p className="mt-6 max-w-2xl text-[1.15rem] leading-relaxed text-ink-2">
            I've worked on Battlefield, The Sims, and self-driving cars. I now lead quality engineering for Monopoly GO! at Scopely.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              to={createPageUrl("Projects")}
              className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-[0.95rem] font-semibold text-white transition-colors hover:bg-accent"
            >
              View projects
            </Link>
            <Link to={createPageUrl("About")} className="link font-semibold">
              More about me
            </Link>
          </div>
        </div>
        <figure className="order-first md:order-none">
          <img
            src={avatarImg}
            alt="Portrait of Omar Zoghayyer"
            width={208}
            height={208}
            fetchpriority="high"
            className="h-28 w-28 rounded-2xl object-cover ring-4 ring-highlight md:h-52 md:w-52 md:rotate-2"
          />
        </figure>
      </section>

      {/* Now */}
      <section aria-labelledby="now-heading" className="mb-14 md:mb-16">
        <h2 id="now-heading" className="sr-only">
          What I'm doing now
        </h2>
        <ul className="grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
          {now.map((item) => (
            <li key={item.label} className="bg-surface p-5 md:p-6">
              <p className="eyebrow">{item.label}</p>
              <p className="mt-2 text-[0.98rem] leading-relaxed text-ink">
                {item.to ? (
                  <Link to={item.to} className="link">
                    {item.body}
                  </Link>
                ) : (
                  item.body
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Selected projects */}
      <Section
        id="projects-heading"
        label="Projects"
        title="Selected projects"
        action={
          <Link to={createPageUrl("Projects")} className="link text-[0.95rem] font-semibold">
            All projects
          </Link>
        }
      >
        <ul className="grid gap-6 md:grid-cols-2">
          {showcase.map((p) => (
            <li key={p.slug}>
              <ProjectTile project={p} />
            </li>
          ))}
        </ul>
      </Section>

      {/* Writing, only once something is published */}
      {recentPosts.length > 0 && (
        <Section
          id="writing-heading"
          label="Writing"
          title="Recent essays"
          action={
            <Link to={createPageUrl("Writing")} className="link text-[0.95rem] font-semibold">
              All writing
            </Link>
          }
        >
          <ul className="space-y-4">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <EntryCard
                  to={`/writing/${post.slug}`}
                  title={post.title}
                  description={post.description}
                  meta={formatDate(post.date)}
                  badge={post.draft ? "Draft" : undefined}
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Experience */}
      <Section
        id="experience-heading"
        label="Work"
        title="Where I've worked"
        action={
          <Link to={createPageUrl("About")} className="link text-[0.95rem] font-semibold">
            More about me
          </Link>
        }
      >
        <ol className="divide-y divide-line border-y border-line">
          {workProjects.map((p) => {
            const href = projectHref(p);
            const row = (
              <div className="grid gap-1 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="text-sm text-muted">{p.period}</span>
                <span>
                  <span className="font-semibold text-ink">{p.company || p.org}</span>
                  <span className="text-ink-2"> · {p.title === p.company ? p.role || p.org : p.title}</span>
                </span>
                {href && (
                  <span className="hidden text-sm font-semibold text-accent sm:inline" aria-hidden="true">
                    Read →
                  </span>
                )}
              </div>
            );
            return (
              <li key={p.slug}>
                {href ? (
                  <Link to={href} className="block hover:bg-accent-soft transition-colors sm:-mx-3 sm:px-3">
                    {row}
                  </Link>
                ) : (
                  <div className="sm:-mx-3 sm:px-3">{row}</div>
                )}
              </li>
            );
          })}
        </ol>
      </Section>

      {/* Contact */}
      <section
        aria-labelledby="contact-heading"
        className="mb-4 grid gap-6 rounded-2xl bg-ink p-8 text-white md:grid-cols-[1fr_auto] md:items-center md:p-10"
      >
        <div>
          <h2 id="contact-heading" className="text-2xl text-white md:text-3xl">
            Say hi.
          </h2>
          <p className="mt-2 text-white/70">
            Want to talk about software, hardware, AI, or games? Email me at{" "}
            <a href={`mailto:${site.email}`} className="text-white underline decoration-[#2dd4bf] underline-offset-[3px]">
              {site.email}
            </a>
            .
          </p>
        </div>
        <SocialLinks className="text-white [&_svg]:h-5 [&_svg]:w-5" />
      </section>
    </div>
  );
}
