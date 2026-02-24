import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "../components/ui/button";
import { Award, Cpu, Activity, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import avatarImg from "../assets/oz.png";
import simsIcon from "../assets/sims.PNG";
import scuIcon from "../assets/Santa_Clara_U_Seal.svg.png";
import bf6Icon from "../assets/Battlefield-6.jpg";
import bfMobileIcon from "../assets/Battlefield_Mobile_Play_Store_App_Icon.PNG";
import zooxIcon from "../assets/zoox.png";

const TIMELINE = [
  {
    year: "2024 - Present",
    title: "Maxis (The Sims Lab)",
    organization: "Electronic Arts",
    description:
      "I lead performance systems, telemetry pipelines, and automation tooling that help engineers find issues faster, cut regressions, and ship more stable builds across multiple EA titles.",
    icon: simsIcon,
  },
  {
    year: "(Expected 2026)",
    title: "MBA Data Science Candidate",
    organization: "Santa Clara University",
    description:
      "Deepening skills in machine learning, NLP, deep learning, reinforcement learning, and predictive analytics, plus decision science, digital advertising, innovation/IP strategy, and managerial economics to support well-rounded technical product leadership.",
    icon: scuIcon,
  },
  {
    year: "2021 – 2024",
    title: "Battlefield 6 / EA DICE",
    organization: "Electronic Arts",
    description:
      "Owned performance and telemetry tooling for Battlefield, including automation pipelines that captured structured screenshots and in-game visuals for ML-based anomaly and visual regression detection. Drove crash/ANR diagnostics, UI stall detection, and stability checks that fed CI/CD gates and improved release quality across platforms.",
    icon: bf6Icon,
  },
  {
    year: "2020 – 2021",
    title: "Battlefield Mobile",
    organization: "Electronic Arts – Industrial Toys",
    description:
      "Worked on the Unreal Engine 4 upgrade, validating systems and updating studio tools. Supported in-house automation and profiling tools and improved front-end workflows for the equipment system while building anti-cheat, profanity, and performance test coverage.",
    icon: bfMobileIcon,
  },
  {
    year: "2019 – 2020",
    title: "Zoox Autonomous Vehicle Platform",
    organization: "Zoox",
    description:
      "Part of the first Zoox team to map downtown Seattle for autonomous driving. Supported prediction and planning teams with structured validation, data collection, and test workflows to ensure safe vehicle behavior on newly mapped routes.",
    icon: zooxIcon,
  },
];

const PILLARS = [
  {
    icon: Cpu,
    label: "Performance",
    body: "Thread stalls, ANRs, crashes, device heat-profile, baseline, and regress automatically.",
  },
  {
    icon: Activity,
    label: "Telemetry",
    body: "Unified logs/metrics, visual diffs, anomaly flags; usable dashboards over raw firehose.",
  },
  {
    icon: Award,
    label: "Automation",
    body: "Guardrails in pipelines, not docs. Ship checks where devs live.",
  },
];

const SKILLS = [
  {
    title: "Product & Strategy",
    items: ["Roadmaps & prioritization", "Test strategy & metrics", "Developer tooling UX", "Stakeholder alignment"],
  },
  {
    title: "Telemetry & Performance",
    items: ["Crash/ANR diagnostics", "Baselines & regression detection", "Observability dashboards", "Signal reliability"],
  },
  {
    title: "Automation & CI/CD",
    items: ["Pipeline validation gates", "Visual diffing & asset checks", "Guardrail enforcement", "Tool rollout & adoption"],
  },
  {
    title: "AI & Analytics",
    items: ["ML-assisted anomaly detection", "Risk scoring & early alerts", "BigQuery / SQL pipelines", "MBA Data Science (SCU)"],
  },
];

function FadeInSection({ children, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TimelineItem({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      viewport={{ once: true }}
      className="relative pl-12 pb-8 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
    >
      <div className="absolute -left-[1.6rem] top-0 w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--primary)] flex items-center justify-center bg-white">
        <img src={item.icon} alt={item.title} className="w-full h-full object-cover rounded-full" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow">
        <span className="inline-block text-sm font-semibold text-[var(--primary)] bg-blue-50 px-3 py-1 rounded-full mb-2">
          {item.year}
        </span>
        <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{item.organization}</p>
        <p className="text-gray-700">{item.description}</p>
      </div>
    </motion.div>
  );
}

function ApproachPillar({ icon: Icon, label, body }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="w-4 h-4 text-[var(--primary)]" />
        {label}
      </div>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
    </div>
  );
}

function SkillCard({ title, items }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-gray-100">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-gray-700">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="mb-8">
              <img
                src={avatarImg}
                alt="Omar Zoghayyer"
                className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              I build developer tooling for performance, telemetry, and automation, systems that shorten
              time-to-diagnose and raise stability at scale. I partner with engineering, infra, and ops to land
              tools people actually use. Currently at EA; MBA in Data Science (SCU).
            </p>
          </motion.div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeInSection>
            <h2 className="text-3xl font-bold mb-8 text-center">My Approach</h2>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Start with the signals and workflows: capture the right data, cut the noise, and wire it into
                CI/CD so quality becomes automatic. Keep the UX simple so teams actually use it. Focus on
                outcomes, not activity. I also like exploring open datasets on the side—testing different ML
                models to see what patterns or predictions fall out. It keeps my instincts sharp and feeds back
                into the systems I build.
              </p>

              <div className="grid gap-4 md:grid-cols-3">
                {PILLARS.map((p) => (
                  <ApproachPillar key={p.label} {...p} />
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeInSection>
            <h2 className="text-3xl font-bold mb-12 text-center">Experience Highlights</h2>

            <div className="space-y-8">
              {TIMELINE.map((item, index) => (
                <TimelineItem key={index} item={item} index={index} />
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* Skills */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <FadeInSection>
            <h2 className="text-3xl font-bold mb-12 text-center">Core Competencies</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {SKILLS.map((s) => (
                <SkillCard key={s.title} {...s} />
              ))}
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <FadeInSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Always Happy to Chat</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              I help teams ship cleaner builds, stronger telemetry, better signals, and automation baked into
              the pipeline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="bg-white text-[var(--primary)] hover:bg-gray-50 border-0 px-8">
                  Get In Touch
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("CaseStudies")}>
                <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 px-8">
                  View My Work
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
