import React from "react";
import { Link } from "react-router-dom";
import { site } from "../content/site";
import { experience, education } from "../content/about";
import PageHeader from "../components/site/PageHeader";
import SocialLinks from "../components/site/SocialLinks";
import { usePageMeta } from "../lib/usePageMeta";
import avatarImg from "../assets/profile.jpeg";

function Section({ id, title, children }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28 border-t border-line py-12">
      <h2 id={`${id}-heading`} className="mb-6 text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function TimelineEntry({ item }) {
  return (
    <li className="grid gap-1 py-6 first:pt-0 last:pb-0 sm:grid-cols-[9.5rem_1fr] sm:gap-6">
      <p className="text-sm text-muted sm:pt-0.5">{item.period}</p>
      <div>
        <h3 className="text-lg">{item.org}</h3>
        <p className="text-[0.95rem] font-medium text-accent">{item.title}</p>
        <p className="mt-2 leading-relaxed text-ink-2">{item.description}</p>
        {item.project && (
          <Link to={`/projects/${item.project}`} className="link mt-2 inline-block text-sm font-semibold">
            Read more<span className="sr-only"> about {item.title}</span>
          </Link>
        )}
      </div>
    </li>
  );
}

export default function About() {
  usePageMeta({
    title: "About",
    description: "I build software and automation, explore hardware, and use AI to test ambitious ideas.",
  });

  return (
    <div className="mx-auto max-w-[48rem] px-5">
      <PageHeader eyebrow="About" title="About me">
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
          <img
            src={avatarImg}
            alt="Portrait of Omar Zoghayyer"
            width={112}
            height={112}
            className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-4 ring-highlight"
          />
          <div className="space-y-4 text-lg leading-relaxed text-ink-2">
            <p>Hi, I'm Omar. I lead quality engineering.</p>
            <p>
              I build software and automation, enjoy working with hardware, and use AI to explore new ideas. At work,
              I help teams find problems before players do.
            </p>
            <p>{site.current}</p>
            <p>
              Before Scopely, I worked on Battlefield and The Sims at Electronic Arts. Before games, I tested
              self-driving cars at Zoox.
            </p>
          </div>
        </div>
      </PageHeader>

      <Section id="experience" title="Where I've worked">
        <ol className="divide-y divide-line">
          {experience.map((item) => (
            <TimelineEntry key={`${item.org}-${item.period}`} item={item} />
          ))}
        </ol>
      </Section>

      <Section id="education" title="School">
        <ol>
          {education.map((item) => (
            <TimelineEntry key={item.org} item={item} />
          ))}
        </ol>
      </Section>

      <Section id="say-hi" title="Say hi">
        <p className="leading-relaxed text-ink-2">
          Email me at{" "}
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          . I'm also on LinkedIn, X, and GitHub.
        </p>
        <SocialLinks withLabels className="mt-6 text-ink" />
      </Section>
    </div>
  );
}
