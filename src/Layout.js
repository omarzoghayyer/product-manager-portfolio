import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// src/Layout.js
import { createPageUrl } from "./utils";
import { Menu, X } from "lucide-react";

import './style/index.css';

const navigationItems = [
  { title: "Home", url: createPageUrl("Home") },
  { title: "About", url: createPageUrl("About") },
  { title: "Problem Solving", url: createPageUrl("CaseStudies") },
  { title: "Contact Me", url: createPageUrl("Contact") },
];

export default function Layout({ children }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Inline CSS variables (kept from your version) */}
      <style>{`
        :root {
          --primary: #1e3a8a;
          --primary-light: #3b82f6;
          --text-primary: #1a1a1a;
          --text-secondary: #6b7280;
          --border: #e5e7eb;
        }
        .gradient-text {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .geometric-pattern {
          background-image: 
            linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
            linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
          background-size: 40px 40px;
          background-position: 0 0, 0 20px, 20px -20px, -20px 0px;
        }
      `}</style>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl("Home")} className="text-xl font-semibold tracking-tight hover:opacity-70 transition-opacity">
              Omar Zoghayyer
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`text-sm font-medium transition-colors hover:text-[var(--primary)] ${location.pathname === item.url ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"
                    }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>

            <button
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-6 py-4 space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-base font-medium ${location.pathname === item.url ? "text-[var(--primary)]" : "text-gray-600"
                    }`}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">{children}</main>

      <footer className="bg-white border-t border-gray-100 mt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm font-medium text-gray-900">Omar Zoghayyer</p>
              <p className="text-sm text-gray-500 mt-1">Technical Product & Strategy Professional</p>
            </div>
            <div className="flex gap-6">
              <a
                href="https://www.linkedin.com/in/omarjzoghayyer/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-[var(--primary)] transition-colors"
              >
                LinkedIn
              </a>
              <Link to={createPageUrl("Contact")} className="text-sm text-gray-500 hover:text-[var(--primary)] transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Omar Zoghayyer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
