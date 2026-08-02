// src/pages/Home.js
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Cpu, Activity } from "lucide-react";
import { motion } from "framer-motion";

import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";

// ⬇️ local hard-coded content
import { caseStudies } from "../data/caseStudies";

export default function Home() {
  // featured case studies (max 4). If fewer than 4 are explicitly featured,
  // fill the remainder with other case studies so the UI shows more items.
  const featuredCases = useMemo(() => {
    const featured = caseStudies.filter((c) => c.featured);
    if (featured.length >= 4) return featured.slice(0, 4);
    const needed = 4 - featured.length;
    const others = caseStudies.filter((c) => !c.featured).slice(0, needed);
    return [...featured, ...others];
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-20" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-sm text-[var(--primary)] font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Platform · Telemetry · Automation
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Omar Zoghayyer
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-light">
              Technical Program Manager building quality engineering, platform tools, and telemetry for Monopoly GO! at Scopely.
            </p>

            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              I partner with engineering and QA across studios to design and scale the tooling, data pipelines, and automation that keep our games performant and stable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("CaseStudies")}>
                <Button
                  size="lg"
                  className="bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white px-8 py-6 text-base"
                >
                  View My Work
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("About")}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 px-8 py-6 text-base"
                >
                  About & Timeline
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Accents */}
        <motion.div
          className="absolute top-1/4 left-10 w-16 h-16 bg-blue-100 rounded-2xl opacity-50"
          animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-10 w-14 h-14 bg-blue-200 rounded-full opacity-40"
          animate={{ y: [0, 15, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* What I Do Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What I Do</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I focus on systems that give teams the right signals, kill noise, and turn quality and performance into something automatic inside the pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Platform Tools */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Platform Tools</h3>
                <p className="text-gray-600">
                  Developer tooling that accelerates workflows - logging, profiling, validation, and the infrastructure that supports them.
                </p>
              </div>
            </motion.div>

            {/* Telemetry & Observability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Telemetry & Observability
                </h3>
                <p className="text-gray-600">
                  Unified telemetry pipelines and dashboards that surface performance, stability, and user-impact signals earlybefore they hit players.
                </p>
              </div>
            </motion.div>

            {/* Automation & ML */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Automation & ML</h3>
                <p className="text-gray-600">
                  Pipeline guardrails, not manuals. ML detects crashes, ANRs, and visual issues so QA scales without headcount.                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Currently Building — theOS */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden"
              style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0f1a35 50%, #0a0f1e 100%)" }}>
              {/* Stars */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="absolute rounded-full bg-white"
                    style={{
                      left: `${(i * 37 + 11) % 100}%`,
                      top: `${(i * 53 + 7) % 100}%`,
                      width: i % 4 === 0 ? 2 : 1,
                      height: i % 4 === 0 ? 2 : 1,
                      opacity: 0.15 + (i % 5) * 0.06,
                    }} />
                ))}
              </div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-8 py-10">
                {/* Orb */}
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 30px rgba(59,130,246,0.4)", "0 0 60px rgba(59,130,246,0.7)", "0 0 30px rgba(59,130,246,0.4)"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full"
                    style={{ background: "radial-gradient(circle at 38% 32%, #93c5fd 0%, #3b82f6 35%, #1e3a8a 75%, #060e3a 100%)" }}
                  >
                    <div className="w-full h-full rounded-full flex items-center justify-center">
                      <div className="w-5 h-3 rounded-full bg-white/25" style={{ filter: "blur(3px)", transform: "translate(-4px,-6px)" }} />
                    </div>
                  </motion.div>
                </div>

                {/* Text */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
                    style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.25)", color: "#93c5fd" }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Currently Building
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">theOS</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
                    A from-scratch bare-metal Rust OS for mobile. No Android. No SIM. No phone number.
                    Identity is Ed25519 keys. Comms route over a custom Kademlia DHT. Networking is WiFi-to-satellite.
                    <span className="text-gray-300"> 547 tests green.</span>
                  </p>
                </div>

                {/* CTA */}
                <div className="flex-shrink-0">
                  <Link to={createPageUrl("TheOS")}>
                    <Button className="text-white px-6 py-2 text-sm border-0 whitespace-nowrap"
                      style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)" }}>
                      See theOS
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Bottom gradient accent */}
              <div className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent)" }} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Case Studies */}
      {featuredCases.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Featured Work
                </h2>
                <p className="text-lg text-gray-600">
                  Real problems solved across gaming and platform tools
                </p>
              </div>
              <Link to={createPageUrl("CaseStudies")}>
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                  View All Cases
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCases.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={`${createPageUrl("CaseStudyDetail")}?id=${caseStudy.id}`}
                    state={{ caseStudy }}
                    className="block group"
                  >
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                      {caseStudy.thumbnail_url && (
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-50 overflow-hidden">
                          <img
                            src={caseStudy.thumbnail_url}
                            alt={caseStudy.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            width={640}
                            height={360}
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs font-medium text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-full">
                            {caseStudy.industry}
                          </span>
                          <span className="text-xs text-gray-500">
                            {caseStudy.company}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors">
                          {caseStudy.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {caseStudy.problem_statement}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12 md:hidden">
              <Link to={createPageUrl("CaseStudies")}>
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Cases
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA (neutral) */}
      <section className="py-24 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact Me</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Have a question, want to compare notes, or just say hi? I try to
              respond within a day or two.
            </p>
            <Link to={createPageUrl("Contact")}>
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-[var(--primary)] hover:bg-gray-50 border-0 px-8 py-6 text-base"
              >
                Say Hello
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
