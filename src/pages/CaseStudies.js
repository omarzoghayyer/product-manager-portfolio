// src/pages/CaseStudies.js
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { zog } from "../api/zogClient";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { motion } from "framer-motion";
import LikeButton from "../components/shared/LikeButton";
import ReaderNotification from "../components/shared/ReaderNotification";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Filter, Tag, Zap } from "lucide-react";

const INDUSTRIES = [
  "All",
  "Automotive",
  "Gaming",
  "Technology",
  "Energy",
  "Healthcare",
  "Finance",
];

const SECTORS = [
  "All",
  "AI & Automation",
  "Data Strategy",
  "Product Management",
  "Performance Systems",
  "Safety & Compliance",
  "Operations",
];

/**
 * ✅ Demo case studies used as a fallback when the backend is empty/offline.
 */
const demoCases = [
  {
    id: "demo-002",
    title: "Tesla Autopilot – Open Safety Program",
    company: "Tesla",
    industry: "Automotive",
    sector: "Safety & Compliance",
    problem_statement:
      "High-profile Autopilot incidents and opaque safety data widened the trust gap between what people think Autopilot is and what it actually does. I designed an Open Safety Program—open telemetry, near-miss taxonomy, and public dashboards—to start closing that gap.",
    thumbnail_url: `${process.env.PUBLIC_URL}/Images/thumbs/Tesla.PNG`,
    Post_on_x: "https://x.com/OZoghayyer/status/1984783106818392169",
    created_date: "2025-09-10T09:00:00Z",
    likes: 41,
  },
  {
    id: "demo-001",
    title: "2030 Satellite Launch Forecast – Linear vs Log-Linear Models",
    company: "Independent Research",
    industry: "Space & Data",
    sector: "Forecasting & Analytics",
    problem_statement:
      "I ran quick linear and log-linear baselines on UCS satellite data (2000–2022) to estimate how many satellites could be in orbit by 2030.",
    thumbnail_url: "/Images/thumbs/nxIh2.jpg",
    created_date: "2025-11-07T12:00:00Z",
    likes: 1000,
    external_url: "https://x.com/OZoghayyer/status/1986701399888109900",
    figure_url: "https://github.com/omarzoghayyer/satellite-growth-2030",
    code_snippet: `# quick-and-dirty baseline
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

df = pd.read_csv("ucs_satellites_by_year.csv")
X = df[['year']].values
y = df['total'].values

lin = LinearRegression().fit(X, y)
loglin = LinearRegression().fit(X, np.log(y))

print("2030 linear:", lin.predict([[2030]]))
print("2030 log-linear:", np.exp(loglin.predict([[2030]])))`,
  },
  {
    id: "demo-003",
    title: "Starlink Swarm – Live Orbit Map",
    company: "Personal Project On Starlink",
    industry: "Space & Data",
    sector: "Open Data & Astronomy",
    problem_statement:
      "Most Starlink visuals are polished renders or marketing coverage maps. I wanted a live, data-backed view of the actual constellation that anyone could reason about.",
    problem_description:
      "People hear that 'thousands of Starlink satellites are in low Earth orbit,' but it’s hard to grasp what that really looks like in motion. Static images don’t convey density, coverage, or how quickly a satellite passes overhead. I set out to build a reproducible pipeline that turns raw orbital elements into an explorable, time-aware map.",
    root_cause_analysis:
      "Public conversation around Starlink is driven by screenshots, not data. Coverage claims are often opaque, most maps are proprietary, and raw TLE data is accessible but not user-friendly. There was a gap between rich open data (Celestrak TLEs) and a clean, story-ready visualization that shows where satellites actually are right now.",
    proposed_solution:
      "A Python-based pipeline that ingests live Starlink TLEs from Celestrak, propagates orbits with Skyfield, and renders a global map with Cartopy + Matplotlib. Each dot represents a real satellite position at a specific timestamp, making it obvious how many vehicles are overhead and how quickly coverage sweeps across the planet.",
    expected_impact:
      "Give non-specialists—product folks, policy makers, and curious people on X—a concrete mental model for modern LEO constellations. Make it easier to talk about coverage, congestion, and night-sky impact with a single artifact instead of abstract numbers.",
    key_learnings:
      "Open data plus a small, well-structured pipeline can turn something abstract (thousands of satellites in LEO) into an intuitive picture. Good visuals do more than decorate a post—they compress a lot of orbital mechanics into one glance.",
    thumbnail_url: "/Images/thumbs/starlink_sweep_2025-11-13_0510UTC.gif",

    figure_url:
      "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle",
    likes: 100,
  },
];

export default function CaseStudies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedSector, setSelectedSector] = useState("All");

  const queryClient = useQueryClient();

  const { data: caseStudies = [], isLoading } = useQuery({
    queryKey: ["case-studies"],
    queryFn: async () => {
      try {
        const list = await zog.entities.CaseStudy.list("-created_date");
        return Array.isArray(list) && list.length ? list : demoCases;
      } catch (e) {
        console.warn(
          "CaseStudies: using demoCases (backend unavailable).",
          e
        );
        return demoCases;
      }
    },
    initialData: demoCases,
  });

  const handleLike = async (caseStudyId) => {
    const previousCaseStudies = queryClient.getQueryData(["case-studies"]);
    const current = previousCaseStudies?.find((c) => c.id === caseStudyId);
    if (!current) return;

    const newLikes = (current.likes || 0) + 1;

    queryClient.setQueryData(["case-studies"], (old) =>
      (old || []).map((c) =>
        c.id === caseStudyId ? { ...c, likes: newLikes } : c
      )
    );

    try {
      // Use server-side increment when available. Expect response like { likes: number } or the updated resource.
      const res = await zog.entities.CaseStudy.increment(caseStudyId);
      // If server returns an object with likes, use it; otherwise, if it returns the updated resource, try to read .likes
      const serverLikes =
        typeof res === "number" ? res : res?.likes ?? newLikes;

      queryClient.setQueryData(["case-studies"], (old) =>
        (old || []).map((c) =>
          c.id === caseStudyId ? { ...c, likes: serverLikes } : c
        )
      );
    } catch (err) {
      // Backend may be unavailable (demo mode). Keep the optimistic local increment.
      console.warn(
        "Like increment failed (backend unreachable). Keeping optimistic count.",
        err
      );
    }
  };

  const filteredCases = useMemo(() => {
    return (caseStudies || []).filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.problem_statement
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesIndustry =
        selectedIndustry === "All" || c.industry === selectedIndustry;
      const matchesSector =
        selectedSector === "All" || c.sector === selectedSector;

      return matchesSearch && matchesIndustry && matchesSector;
    });
  }, [caseStudies, searchQuery, selectedIndustry, selectedSector]);

  return (
    <div className="min-h-screen py-20">
      <ReaderNotification items={caseStudies} type="case study" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Problem Solving
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-world case studies of problems I've analyzed and solved across
            multiple industries
          </p>
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Industry Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex gap-2">
                {INDUSTRIES.map((industry) => (
                  <Badge
                    key={industry}
                    variant={
                      selectedIndustry === industry ? "default" : "outline"
                    }
                    className={`cursor-pointer whitespace-nowrap ${selectedIndustry === industry
                      ? "bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white"
                      : "hover:bg-gray-100"
                      }`}
                    onClick={() => setSelectedIndustry(industry)}
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Sector Filter */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto">
            <Tag className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex gap-2">
              {SECTORS.map((sector) => (
                <Badge
                  key={sector}
                  variant={selectedSector === sector ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap ${selectedSector === sector
                    ? "bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSelectedSector(sector)}
                >
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold">{filteredCases.length}</span> case
            studies
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
          </div>
        ) : filteredCases.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No case studies found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
                  <Link
                    to={`${createPageUrl("CaseStudyDetail")}?id=${caseStudy.id}`}
                    className="flex-1 flex flex-col"
                  >

                    {caseStudy.thumbnail_url ? (
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                        {caseStudy.thumbnail_url
                          .toLowerCase()
                          .endsWith(".mp4") ? (
                          <video
                            src={caseStudy.thumbnail_url}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            autoPlay
                            loop
                            muted
                            playsInline
                          />
                        ) : (
                          <img
                            src={caseStudy.thumbnail_url}
                            alt={caseStudy.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                        <Zap className="w-16 h-16 text-blue-300" />
                      </div>
                    )}

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge className="bg-blue-50 text-[var(--primary)] border-blue-100">
                          {caseStudy.industry}
                        </Badge>
                        <Badge variant="outline" className="text-gray-600">
                          {caseStudy.sector}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-500">
                          {caseStudy.company}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors">
                        {caseStudy.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                        {caseStudy.problem_statement}
                      </p>

                      {caseStudy.figure_url && (
                        <p className="mt-2 text-xs text-gray-400">
                          Data source:{" "}
                          <a
                            href={caseStudy.figure_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-[var(--primary)]"
                            onClick={(e) => {
                              // Don't trigger the parent <Link> navigation
                              e.stopPropagation();
                            }}
                          >
                            View source
                          </a>
                        </p>
                      )}
                      {caseStudy.Post_on_x && (
                        <p className="mt-1 text-xs text-gray-400">
                          Post on X:{" "}
                          <a
                            href={caseStudy.Post_on_x}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 underline hover:text-[var(--primary)]"
                            onClick={(e) => {
                              // prevent the parent <Link> from hijacking the click
                              e.stopPropagation();
                            }}
                          >
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-[4px] border border-current text-[10px] leading-none font-semibold">
                              X
                            </span>
                            <span>View thread</span>
                          </a>
                        </p>
                      )}

                    </div>
                  </Link>

                  <div className="px-6 pb-4 pt-2 border-t border-gray-100 flex justify-start">
                    <LikeButton
                      itemId={caseStudy.id}
                      section="case-studies"
                      initialLikes={caseStudy.likes || 0}
                      onLike={() => handleLike(caseStudy.id)}
                      size="small"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
