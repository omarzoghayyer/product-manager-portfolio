// Keep this tiny and explicit so links always match routes exactly.
export function createPageUrl(name) {
  const map = {
    Home: "/",
    Projects: "/projects",
    Experiments: "/projects/experiments",
    Writing: "/writing",
    About: "/about",
    TheOS: "/the-os",
  };
  return map[name] || "/";
}
