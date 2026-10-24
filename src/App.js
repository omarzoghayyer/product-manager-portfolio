import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Layout from "./Layout";
import { findProjectByLegacyId } from "./content/projects";

const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Experiments = lazy(() => import("./pages/Experiments"));
const Writing = lazy(() => import("./pages/Writing"));
const WritingPost = lazy(() => import("./pages/WritingPost"));
const About = lazy(() => import("./pages/About"));
const TheOS = lazy(() => import("./pages/TheOS"));
const NotFound = lazy(() => import("./pages/NotFound"));

// New page: scroll to top. URL with #anchor: scroll to that element once the
// (lazy-loaded) page has rendered it.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    let tries = 0;
    let timer;
    const find = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) el.scrollIntoView();
      else if (tries++ < 20) timer = setTimeout(find, 50);
    };
    find();
    return () => clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}

// Old /case-study?id=demo-001 links point to the new project pages.
function LegacyCaseStudyRedirect() {
  const { search } = useLocation();
  const id = new URLSearchParams(search).get("id");
  const project = id ? findProjectByLegacyId(id) : null;
  return <Navigate to={project ? `/projects/${project.slug}` : "/projects"} replace />;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/experiments" element={<Experiments />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/the-os" element={<TheOS />} />
              <Route path="/writing" element={<Writing />} />
              <Route path="/writing/:slug" element={<WritingPost />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Navigate to="/about#say-hi" replace />} />
              <Route path="/case-studies" element={<Navigate to="/projects" replace />} />
              <Route path="/case-study" element={<LegacyCaseStudyRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </MotionConfig>
  );
}
