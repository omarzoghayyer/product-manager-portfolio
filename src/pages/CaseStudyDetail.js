// src/pages/CaseStudyDetail.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Building2, Target, Search, Lightbulb, TrendingUp, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import LikeButton from "../components/shared/LikeButton";
import { createPageUrl } from "../utils";
import { zog } from "../api/zogClient";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";

const demoCases = [
  {
    id: "demo-001",
    title: "Satellites in Orbit by 2030 - Baseline Forecast",
    company: "Independent",
    industry: "Space & Data",
    sector: "Forecasting & Analytics",
    problem_statement:
      "How many satellites will be in orbit by 2030? I ran quick linear and log-linear baselines on UCS data (2000–2022) to bracket a plausible range.",
    problem_description:
      "Satellite counts have been accelerating (Starlink et al.). I wanted a fast, transparent baseline before building richer models or segmenting by LEO/MEO/GEO.",
    root_cause_analysis:
      "Most public discussions cite growth loosely; few show calibrated, reproducible baselines with simple model fit and clear assumptions.",
    proposed_solution:
      "Fit linear and log-linear regressions to annual totals; report R² and a 2030 point estimate range; flag where segmentation or non-linear models might improve fit.",
    expected_impact:
      "Set a transparent baseline for future, more nuanced models\n- Communicate uncertainty with a range vs. single-point hype\n- Create a reproducible artifact (code + chart)",
    key_learnings:
      "Growth is non-linear. Even simple models bracket ~1.3K–3.4K launches/year by 2030; better splits (LEO vs non-LEO, constellation eras) should improve fit.",
    thumbnail_url: "/Images/thumbs/nxIh2.jpg",

    figure_url:
      "https://images.unsplash.com/photo-1447433909565-04bfc496fe5e?auto=format&fit=crop&w=1600&q=60",
  },

  {
    id: "demo-002",
    title: "Tesla Autopilot – Open Safety Program",
    company: "Tesla",
    industry: "Automotive",
    sector: "Safety & Compliance",

    problem_statement:
      "Autopilot incidents, confusing 'self-driving' messaging, and opaque safety data widened the trust gap between public perception and Autopilot’s actual capabilities.",

    problem_description:
      "Drivers, regulators, and media lacked shared baselines. Safety debates were shaped by anecdotes, lawsuits, and headlines-not consistent telemetry. Without transparency into near-misses, intervention rates, or model uncertainty, trust continued to fall.",

    root_cause_analysis:
      "Marketing frames Autopilot like autonomy while the real system is still driver assistance. Telemetry is siloed, near-miss taxonomies vary across teams, and there is no publicly accessible dashboard showing performance trends or failure context. This mismatch between perception and reality fuels the Trust Gap.",

    proposed_solution:
      "An Open Safety Program that publishes anonymized safety and near-miss data, creates a unified incident taxonomy, and incentivizes external research. This sits alongside a broader safety ecosystem: PROMETHEUS (digital-twin simulations before release), AETHER (human-in-the-loop behavior/adaptiveness), ORION (vehicle-to-cloud hazard network), PERSEUS (LiDAR-assisted training fleet), and a fully open transparency layer that allows the public to track improvements over time.",

    expected_impact:
      "Reduce misinformation, align expectations, and provide a reproducible evidence trail for regulators, researchers, and drivers. Modeled impact from the slide deck includes: a +10-point improvement in the Trust Index in 12 months, significantly faster regulatory iteration, and long-term crash reduction based on systemwide hazard sharing.",

    impact_metrics:
    {
      driver_engagement: "+30% engagement increase from adaptive human-in-the-loop feedback (AETHER)",
      projected_crash_reduction: "99% projected reduction in Autopilot-related crashes with ORION + PROMETHEUS",
      deployment_scale: "ORION hazard-sharing network live in 150+ cities",
      trust_rank: "#1 globally in driver safety confidence (projected)",
      financials: {
        roi_3yr: "438% ROI over 3 years",
        payback: "< 1 year",
        cost_midpoint: "$111.5M total 3-year cost",
        benefit_midpoint: "$600M 3-year modeled financial benefit"
      }
    },

    key_learnings:
      "Transparency is a performance accelerator. When definitions become reproducible and telemetry becomes public, debate becomes data, trust rises, and safety iterates faster. The safest car isn’t the one with perfect automation-it’s the one that keeps learning.",

    thumbnail_url: `${process.env.PUBLIC_URL}/Images/thumbs/Tesla.PNG`,
    likes: 1,
  },
  {
    id: "demo-003",
    title: "Starlink Swarm – Live Orbit Map",
    company: "Independent",
    industry: "Space & Data",
    sector: "Open Data Visualization",

    problem_statement:
      "Most Starlink maps online are renders or static marketing visuals. I wanted a real-time view of the actual Starlink constellation using live orbital data.",

    problem_description:
      "People hear about 'thousands of Starlink satellites' but rarely see the constellation as it exists in the sky. Static images hide density, coverage sweeps, and LEO traffic flow. I built a pipeline that turns raw TLEs into an accurate, timestamped global map.",

    root_cause_analysis:
      "Public discussions rely on screenshots or coverage claims instead of reproducible orbit data. Raw TLEs exist on Celestrak, but there’s no simple, transparent tool that processes them into a clean, intuitive visualization anyone can understand.",

    proposed_solution:
      "Pull fresh Starlink TLEs from Celestrak; propagate orbits with Skyfield; then generate a global Cartopy + Matplotlib plot where each dot represents a real satellite position at that moment. The output is a true 'live snapshot' of the swarm.",

    expected_impact:
      "- Make Starlink’s scale and movement intuitive, not abstract\n- Provide a transparent, reproducible visualization using only open data\n- Enable better conversations around coverage, congestion, and astronomy impact",

    key_learnings:
      "Open orbital data + a simple Python pipeline can compress complex orbital mechanics into a single glance. The live map shows how quickly LEO satellites sweep coverage and why the constellation feels 'everywhere' within minutes.",


    thumbnail_url: "/Images/thumbs/starlink_sweep_2025-11-13_0510UTC.gif",
    figure_url:
      "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle",
  }

];

export default function CaseStudyDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const caseStudyId = urlParams.get("id");

  const location = useLocation();
  const passed = location.state?.caseStudy || null;

  const queryClient = useQueryClient();

  /**
   * Data resolution order:
   * 1) If a case was passed via router state, use it immediately.
   * 2) Else fetch it by id from zog.
   * 3) If still nothing, fall back to demoCases (so demo links work).
   */
  const { data: caseStudy, isLoading } = useQuery({
    queryKey: ["case-study", caseStudyId],
    queryFn: async () => {
      if (passed) return passed;
      if (!caseStudyId) return null;

      // Try backend
      try {
        const fromApi = await zog.entities.CaseStudy.filter({ id: caseStudyId });
        if (Array.isArray(fromApi) && fromApi[0]) return fromApi[0];
      } catch (e) {
        // ignore and try demo
      }

      // Demo fallback by id
      return demoCases.find((d) => d.id === caseStudyId) || null;
    },
    enabled: !!caseStudyId || !!passed,
    initialData: passed || null,
  });

  const handleLike = async () => {
    if (!caseStudy) return;
    const newLikes = (caseStudy.likes || 0) + 1;

    // Optimistic update
    queryClient.setQueryData(["case-study", caseStudyId], (old) =>
      old ? { ...old, likes: newLikes } : old
    );

    try {
      // If backend exists, persist; if not, UI will still reflect optimistic value.
      await zog.entities.CaseStudy.update(caseStudy.id, { likes: newLikes });
    } catch (e) {
      // no-op in demo mode
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Case study not found</h1>
          <Link to={createPageUrl("CaseStudies")}>
            <Button variant="outline">Back to Case Studies</Button>
          </Link>
        </div>
      </div>
    );
  }

  const sections = [
    { title: "The Problem", content: caseStudy.problem_description, icon: Target, color: "from-red-500 to-orange-500" },
    { title: "Root Cause Analysis", content: caseStudy.root_cause_analysis, icon: Search, color: "from-purple-500 to-pink-500" },
    { title: "Proposed Solution", content: caseStudy.proposed_solution, icon: Lightbulb, color: "from-blue-500 to-cyan-500" },
    { title: "Expected Impact", content: caseStudy.expected_impact, icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { title: "Key Learnings", content: caseStudy.key_learnings, icon: BookOpen, color: "from-yellow-500 to-amber-500" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link to={createPageUrl("CaseStudies")} className="inline-flex items-center gap-2 text-gray-600 hover:text-[var(--primary)] transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Case Studies
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge className="bg-blue-50 text-[var(--primary)] border-blue-100">{caseStudy.industry}</Badge>
              <Badge variant="outline" className="text-gray-600">{caseStudy.sector}</Badge>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">{caseStudy.company}</span>
              </div>
            </div>
            {/* Author line */}
            <div className="text-sm text-gray-500 mb-4">
              By {caseStudy.author || "Omar Zoghayyer"}
            </div>
            <div className="flex items-start justify-between gap-6 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold flex-1">{caseStudy.title}</h1>
              <LikeButton itemId={caseStudy.id} section="case-studies" initialLikes={caseStudy.likes || 0} onLike={handleLike} size="large" />
            </div>

            <p className="text-xl text-gray-600 leading-relaxed">{caseStudy.problem_statement}</p>
          </motion.div>
        </div>
      </section>

      {/* Thumbnail */}
      {caseStudy.thumbnail_url && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={caseStudy.thumbnail_url} alt={caseStudy.title} className="w-full h-auto" />
            </motion.div>
          </div>
        </section>
      )}

      {/* Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-16">
          {sections.map((section, i) =>
            section.content ? (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center flex-shrink-0`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">{section.title}</h2>
                  </div>
                </div>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed pl-16">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </motion.div>
            ) : null
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Want to Solve Similar Problems?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto"></p>
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" variant="outline" className="bg-white text-[var(--primary)] hover:bg-gray-50 border-0 px-8">
                Let's Work Together
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
