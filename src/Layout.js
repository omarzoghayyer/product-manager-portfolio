import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Menu, X } from "lucide-react";
import { analytics, logEvent } from "./firebase";
import './style/index.css';

const navigationItems = [
  { title: "Home", url: createPageUrl("Home") },
  { title: "About", url: createPageUrl("About") },
  { title: "Problem Solving", url: createPageUrl("CaseStudies") },
  { title: "theOS", url: createPageUrl("TheOS") },
  { title: "Contact Me", url: createPageUrl("Contact") },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = location.pathname === createPageUrl("TheOS");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Fire a page_view event on every route change
  useEffect(() => {
    logEvent(analytics, "page_view", {
      page_path: location.pathname,
      page_title: document.title,
    });
  }, [location.pathname]);

  const navScrolledBg = isDark ? "backdrop-blur-md shadow-sm shadow-black/60" : "bg-white/95 backdrop-blur-md shadow-sm";
  const navLinkActive = isDark ? "text-white" : "text-[var(--primary)]";
  const navLinkDefault = isDark ? "text-white/50 hover:text-white" : "text-[var(--text-secondary)] hover:text-[var(--primary)]";
  const logoColor = isDark ? "text-white" : "text-gray-900";

  return (
    <div className={`min-h-screen ${isDark ? "bg-[#0a0a0a]" : "bg-[#FAFAF9]"}`} style={isDark ? { "--nav-scrolled-bg": "#0a0a0a" } : {}}>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? navScrolledBg : "bg-transparent"}`}
        style={scrolled && isDark ? { backgroundColor: "#0a0a0a" } : {}}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl("Home")} className={`text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity ${logoColor}`}>
              Zoghayyer
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`text-sm font-medium transition-colors ${location.pathname === item.url ? navLinkActive : navLinkDefault}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <button
              className={`md:hidden p-2 transition-colors ${isDark ? "text-white/60 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${isDark ? "border-white/10" : "bg-white border-gray-100"}`} style={isDark ? { backgroundColor: "#0a0a0a" } : {}}>
            <div className="px-6 py-4 space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium ${location.pathname === item.url ? navLinkActive : isDark ? "text-white/50" : "text-gray-600"}`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">{children}</main>

      <footer className={`border-t ${isDark ? "border-white/10 mt-0" : "bg-white border-gray-100 mt-32"}`} style={isDark ? { backgroundColor: "#0a0a0a" } : {}}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Omar Zoghayyer</p>
              <p className={`text-sm mt-1 ${isDark ? "text-white/40" : "text-gray-500"}`}>Technical Product Leader</p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/in/omarjzoghayyer/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm transition-colors ${isDark ? "text-white/40 hover:text-white" : "text-gray-500 hover:text-[var(--primary)]"}`}
              >
                LinkedIn
              </a>
              <Link to={createPageUrl("Contact")} className={`text-sm transition-colors ${isDark ? "text-white/40 hover:text-white" : "text-gray-500 hover:text-[var(--primary)]"}`}>
                Contact
              </Link>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t text-center ${isDark ? "border-white/10" : "border-gray-100"}`}>
            <p className={`text-xs ${isDark ? "text-white/25" : "text-gray-400"}`}>© {new Date().getFullYear()} Omar Zoghayyer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
