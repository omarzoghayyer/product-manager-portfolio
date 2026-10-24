import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analytics, logEvent } from "../firebase";
import { site } from "../content/site";

const DEFAULT_DESCRIPTION =
  "I build software and automation, explore hardware, and use AI to test ambitious ideas.";

// Sets the document title and meta description for a page, and records a
// page_view once the title is known. Pass `skip: true` when a child component
// (e.g. the 404 page) will set the meta instead.
export function usePageMeta({ title, description, skip = false } = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (skip) return;
    document.title = title ? `${title} · ${site.name}` : `${site.name} · ${site.role}`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description || DEFAULT_DESCRIPTION);

    logEvent(analytics, "page_view", { page_path: pathname, page_title: document.title });
  }, [title, description, pathname, skip]);
}
