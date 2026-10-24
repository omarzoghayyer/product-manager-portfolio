// src/content/writing/index.js
// Loads every Markdown file in ./posts at build time. See README.md in this
// folder for how to add a post.

const files = import.meta.glob("./posts/*.md", { query: "?raw", import: "default", eager: true });

const SHOW_DRAFTS = import.meta.env.DEV;

// Minimal frontmatter parser: `key: value` lines between two `---` lines.
// Values may be wrapped in quotes. `true` / `false` become booleans.
function parseFrontmatter(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!match) return { data: {}, body: raw };

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    if (value === "true") value = true;
    else if (value === "false") value = false;
    if (key) data[key] = value;
  }
  return { data, body: match[2].trim() };
}

function toPost(path, raw) {
  const slug = path.split("/").pop().replace(/\.md$/, "");
  const { data, body } = parseFrontmatter(raw);
  return {
    slug,
    title: data.title || slug,
    subtitle: data.subtitle || "",
    description: data.description || data.subtitle || "",
    date: data.date || "",
    draft: data.draft === true,
    body,
  };
}

export const posts = Object.entries(files)
  .filter(([path]) => !path.split("/").pop().startsWith("_"))
  .map(([path, raw]) => toPost(path, raw))
  .filter((post) => SHOW_DRAFTS || !post.draft)
  // Newest first; undated posts go last.
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null;
}

export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
