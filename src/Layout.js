import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { createPageUrl } from "./utils";
import { site } from "./content/site";
import SocialLinks from "./components/site/SocialLinks";

const navigationItems = [
  { title: "Projects", url: createPageUrl("Projects") },
  { title: "Writing", url: createPageUrl("Writing") },
  { title: "About", url: createPageUrl("About") },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  // theOS keeps its own dark design; the header and footer follow it there.
  const isDark = location.pathname === createPageUrl("TheOS");

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const theme = isDark
    ? { shell: "bg-[#0a0a0a] text-white", header: "bg-[#0a0a0a]", text: "text-white", footer: "border-white/10 text-white/60" }
    : { shell: "bg-paper text-ink-2", header: "bg-paper/95 backdrop-blur", text: "text-ink", footer: "border-line text-ink-2" };

  return (
    <div className={`min-h-screen flex flex-col ${theme.shell}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <header className={`sticky top-0 z-50 ${theme.header}`}>
        <div className="mx-auto flex h-20 max-w-[72rem] items-center justify-between px-5 md:h-24 md:px-10">
          <Link
            to={createPageUrl("Home")}
            className={`logo-script text-[1.9rem] sm:text-[2.4rem] md:text-[2.75rem] ${theme.text}`}
            aria-label={`${site.name}, home`}
          >
            {site.name}
          </Link>

          <nav aria-label="Main" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navigationItems.map((item) => (
                <li key={item.url}>
                  <NavLink
                    to={item.url}
                    className={({ isActive }) =>
                      `border-b-2 pb-1 text-[1rem] font-semibold transition-colors ${theme.text} ${
                        isActive ? "border-[#2dd4bf]" : "border-transparent opacity-70 hover:opacity-100"
                      }`
                    }
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className={`-mr-2 rounded p-2 md:hidden ${theme.text}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-7 w-7" aria-hidden="true" /> : <Menu className="h-7 w-7" aria-hidden="true" />}
          </button>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Main" className={`border-t md:hidden ${isDark ? "border-white/10" : "border-line"}`}>
            <ul className="px-5 py-4">
              {[{ title: "Home", url: createPageUrl("Home") }, ...navigationItems].map((item) => (
                <li key={item.url} className="py-2">
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={({ isActive }) => `border-l-2 pl-3 text-xl font-semibold ${theme.text} ${isActive ? "border-[#2dd4bf]" : "border-transparent"}`}
                  >
                    {item.title}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      <footer className={`mt-20 border-t ${theme.footer}`}>
        <div className="mx-auto grid max-w-[72rem] gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center md:px-10">
          <div>
            <Link to={createPageUrl("Home")} className={`logo-script text-[1.6rem] ${theme.text}`}>
              {site.name}
            </Link>
            <p className="mt-2 text-sm">
              {site.role}. I build software and automation, and explore hardware and AI.
            </p>
          </div>
          <SocialLinks className={isDark ? "text-white/70" : "text-ink"} />
          <p className="text-xs md:col-span-2">
            © {new Date().getFullYear()} {site.name}. Built with React and Vite.
          </p>
          <p className="text-xs md:col-span-2">
            Design inspired by Greg Isenberg.
          </p>
        </div>
      </footer>
    </div>
  );
}
