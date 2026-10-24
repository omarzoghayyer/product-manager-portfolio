import React from "react";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { getPost, formatDate } from "../content/writing";
import { site } from "../content/site";
import Markdown from "../components/site/Markdown";
import { usePageMeta } from "../lib/usePageMeta";
import NotFound from "./NotFound";

export default function WritingPost() {
  const { slug } = useParams();
  const post = getPost(slug);

  usePageMeta({ title: post?.title, description: post?.description, skip: !post });

  if (!post) return <NotFound />;

  return (
    <article className="mx-auto max-w-prose px-5 pb-20 md:px-0">
      <nav aria-label="Breadcrumb" className="pt-10 md:pt-14 text-sm">
        <Link to={createPageUrl("Writing")} className="link text-muted">
          ← Writing
        </Link>
      </nav>

      <header className="pt-10 pb-10 md:pt-14">
        {post.draft && (
          <p className="mb-6 rounded border border-dashed border-accent bg-accent-soft px-3 py-2 text-sm text-accent">
            Draft. Only visible in development; this post isn't published.
          </p>
        )}
        <h1 className="text-[2.1rem] leading-tight md:text-5xl md:leading-[1.1]">{post.title}</h1>
        {post.subtitle && <p className="mt-4 text-xl leading-relaxed text-ink-2">{post.subtitle}</p>}
        <p className="mt-6 text-sm text-muted">
          {site.name}
          {post.date && (
            <>
              {" · "}
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </>
          )}
        </p>
      </header>

      <div className="border-t border-line pt-10">
        <Markdown>{post.body}</Markdown>
      </div>

      <footer className="mt-16 border-t border-line pt-8 text-ink-2">
        <p>
          Want to discuss this post? Email me at{" "}
          <a href={`mailto:${site.email}`} className="link">
            {site.email}
          </a>
          .
        </p>
      </footer>
    </article>
  );
}
