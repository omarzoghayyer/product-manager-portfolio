// src/content/projects.js
// All project content lives here. Pages read from these arrays; nothing is
// hard-coded in the components.
//
// Entry shape
// -----------
// slug        URL segment: /projects/<slug>. Keep it stable once published.
// kind        "work" (professional roles) or "personal" (independent projects).
// title       Card and page heading.
// org         Company / context line shown above the title.
// company     Optional: name for the home page "Where I've worked" list (defaults to org).
// period      Free text, e.g. "2021 – 2024".
// role        Optional job title.
// summary     One or two sentences for the card. Keep it short.
// image       Imported asset. Optional.
// imageAlt    Describe what the image shows (it's read aloud by screen readers).
// imageFit    "cover" for photos/screenshots, "contain" for logos.
// imageBg     Background behind "contain" images, e.g. "#fff".
// gallery     Optional extra images on the detail page: [{ src, alt, fit, bg }].
// skills      Short list. Cards show the first three; detail pages show all.
// sections    Detail page body: [{ heading, body }]. `body` is Markdown.
// links       [{ label, href }]. External links open in a new tab.
// href        Optional: send the card somewhere other than /projects/<slug>.
// featured    true to show on the home page.
// legacyIds   Old /case-study?id=... ids that should redirect here.

import monopolyGoImg from "../assets/monopoly-go.PNG";
import simsImg from "../assets/sims.PNG";
import maxisImg from "../assets/MaxisGame.PNG";
import bf6Img from "../assets/Battlefield-6.jpg";
import bf2042Img from "../assets/battlefield-2042.png";
import bfMobileImg from "../assets/battlefield-mobile.png";
import zooxImg from "../assets/zoox.png";
import fightPandemicsImg from "../assets/FightPandemics.png";
import starlinkGif from "../assets/starlink_sweep_2025-11-13_0510UTC.gif";
import satellitesImg from "../assets/nxIh2.jpg";
import teslaImg from "../assets/Tesla.PNG";
import theosImg from "../assets/theos.PNG";

export const projects = [
  // ─── Professional work ──────────────────────────────────────────────────
  {
    slug: "scopely-monopoly-go",
    kind: "work",
    title: "Quality Engineering for Monopoly GO!",
    org: "Scopely",
    role: "Quality Tech Lead & Engineer",
    period: "July 2026 – Present",
    summary:
      "I build automation frameworks, tools, and systems for internal teams, using AI and traditional automation methods to reduce manual work.",
    image: monopolyGoImg,
    imageAlt: "Monopoly GO! app icon",
    imageFit: "contain",
    imageBg: "#ffffff",
    skills: [],
    sections: [],
  },
  {
    slug: "maxis-sims-lab",
    kind: "work",
    role: "Technical Designer & Engineer",
    title: "Tools, performance, and AI at The Sims Lab",
    org: "Electronic Arts · Maxis",
    period: "2024 – 2026",
    summary:
      "I led a team that built performance, telemetry, and automation tools for Maxis and other EA studios.",
    image: simsImg,
    imageAlt: "The Sims Labs logo",
    imageFit: "contain",
    imageBg: "#ffffff",
    gallery: [{ src: maxisImg, alt: "Maxis studio logo on a colorful geometric background", fit: "cover" }],
    skills: [
      "Product ownership",
      "Telemetry",
      "Tools & infrastructure design",
      "BigQuery",
      "Unreal Engine 5",
      "Performance planning",
      "Data analytics",
      "Figma",
      "Team building",
    ],
    sections: [
      {
        heading: "What I owned",
        body:
          "I led the team that built performance tools, telemetry systems, and automation for Maxis and other EA studios. I worked with teams across the studios to make sure the tools fit their development process.",
      },
      {
        heading: "Mobile bug-report capture",
        body:
          "For a new Sims mobile game, I led a team that built a tool to collect screenshots, logs, and device details when someone reports a bug. It sends reports to Slack and is used by more than 200 people at EA.",
      },
      {
        heading: "Product work",
        body:
          "I led automation planning for a new Sims game. I researched ideas, wrote product requirements, and worked with product managers, producers, and developers on a shared roadmap. I tracked risks and dependencies so the team could address problems early.",
      },
      {
        heading: "AI in the workflow",
        body:
          "I researched ways to use AI, including large language models, in the development process. The goal was to help teams work faster while protecting quality and safety.",
      },
    ],
  },
  {
    slug: "battlefield-dice",
    kind: "work",
    role: "Technical Designer & Engineer",
    title: "Performance, telemetry, and automation for Battlefield",
    org: "Electronic Arts · DICE",
    period: "2021 – 2024",
    summary:
      "I built performance and telemetry tools for Battlefield, including a system that used machine learning to find visual bugs in game screenshots.",
    image: bf6Img,
    imageAlt: "Battlefield 6 key art",
    imageFit: "cover",
    gallery: [{ src: bf2042Img, alt: "Battlefield 2042 key art", fit: "cover" }],
    skills: [
      "Product management",
      "System design",
      "BigQuery",
      "Frostbite / FrostEd",
      "Schematics (visual scripting)",
      "Agile & waterfall",
      "Team building",
    ],
    sections: [
      {
        heading: "Overview",
        body:
          "I led performance and telemetry tools for Battlefield. Automated screenshots helped machine learning find unusual images and visual bugs. I also worked on crash reports, app freezes, and stability checks in the build pipeline.",
      },
      {
        heading: "Automation across studios",
        body:
          "I led the test automation team and worked with developers in Sweden, the UK, and the US. I planned and built tools to automate gameplay and capture in-game screenshots for machine learning tests. More than 300 people at EA used these tools.",
      },
      {
        heading: "Asset status by build",
        body:
          "Teams spent about 30 minutes per build checking asset versions by hand. I built a website that showed each asset's status right away, cutting that work by about 80%.",
      },
    ],
  },
  {
    slug: "battlefield-mobile",
    kind: "work",
    role: "Technical Designer & Engineer",
    title: "Battlefield Mobile",
    org: "Electronic Arts · Industrial Toys",
    period: "2020 – 2021",
    summary:
      "I helped move the game to Unreal Engine 4 and built tests for performance, anti-cheat, and player equipment.",
    image: bfMobileImg,
    imageAlt: "Battlefield Mobile key art",
    imageFit: "cover",
    skills: [
      "Feature ownership",
      "Unreal Engine 4",
      "C++",
      "Mobile development",
      "Performance planning",
      "Power BI / Grafana",
      "Game design",
      "Figma",
      "Agile",
    ],
    sections: [
      {
        heading: "Overview",
        body:
          "I tested the Unreal Engine 4 upgrade and updated studio tools. I improved automation and performance tools, made the equipment system easier to test, and added tests for anti-cheat, chat filters, and performance.",
      },
      {
        heading: "Quality across three teams",
        body:
          "I led the backend, core technology, and performance testing teams. We built manual and automated tests to find bugs early and checked major Unreal Engine 4 updates before developers used them.",
      },
      {
        heading: "Tools I built",
        body:
          "- A C++ feature that showed testers and developers which equipment was available.\n- A C++ warning when a project used more than 90% of its available Unreal objects.\n- Unreal Engine BugIt support in the phone-to-Slack bug reporting tool.\n- Automated test cases and Power BI reports that made performance data easier to read.",
      },
    ],
  },
  {
    slug: "zoox",
    kind: "work",
    role: "Technical Analyst, QA",
    title: "Self-driving car testing and Seattle mapping",
    org: "Zoox (acquired by Amazon)",
    period: "2019 – 2020",
    summary:
      "I joined the first Zoox team that mapped downtown Seattle for self-driving cars.",
    image: zooxImg,
    imageAlt: "Zoox logo",
    imageFit: "cover",
    skills: [
      "Test planning & strategy",
      "C++",
      "Linux (Ubuntu)",
      "Quality assurance",
      "Product planning",
      "Agile",
      "JaaS",
    ],
    sections: [
      {
        heading: "Overview",
        body:
          "I joined the first Zoox team to map downtown Seattle for self-driving cars. I collected road data and helped the prediction and planning teams test how the cars handled new routes.",
      },
      {
        heading: "Testing at release speed",
        body:
          "I planned tests for frequent software updates. We installed new builds on Ubuntu-powered cars and tested them in different driving situations. I also tested new planning, prediction, and perception features, and prepared code for release testing.",
      },
      {
        heading: "Team",
        body:
          "I helped start and lead the team that tested driving algorithms. I reviewed daily drive scenarios, supported engineers across teams, and trained new software specialists.",
      },
    ],
  },
  {
    slug: "fightpandemics",
    kind: "work",
    title: "FightPandemics",
    org: "Open source · Palo Alto, CA",
    company: "FightPandemics",
    role: "Front-End Software Engineer",
    period: "2019 – 2020",
    summary:
      "I helped build an open-source app that connects people who need help with people who can offer it.",
    image: fightPandemicsImg,
    imageAlt: "FightPandemics logo: connecting those in need of help with those that can provide it",
    imageFit: "cover",
    skills: ["React", "JavaScript", "styled-components", "Ant Design", "react-hook-form", "Docker", "MongoDB"],
    sections: [
      {
        heading: "What I built",
        body:
          "I built a login flow that checks email addresses and validates passwords. I added clear error messages, connected the messaging feature, and fixed bugs across the app.",
      },
      {
        heading: "How I worked",
        body:
          "I worked with product managers and designers to build reusable interface components and plan the product roadmap.",
      },
    ],
  },

  // ─── Personal projects ──────────────────────────────────────────────────
  {
    slug: "theos",
    kind: "personal",
    title: "theOS",
    org: "Personal project",
    period: "Phase 3: hardware bring-up",
    summary:
      "A phone operating system I am building in Rust. It uses a device key for identity, with no SIM or phone number.",
    image: theosImg,
    imageAlt: "theOS project preview",
    imageFit: "cover",
    skills: ["Rust", "Cryptography", "Distributed systems"],
    href: "/the-os",
    sections: [],
  },
  {
    slug: "starlink-orbit-map",
    kind: "personal",
    title: "Starlink Swarm: live orbit map",
    org: "Independent project",
    period: "2025",
    summary:
      "A Python map of Starlink satellite positions, built from public data.",
    image: starlinkGif,
    imageAlt: "Animated world map with dots showing Starlink satellite positions sweeping across the globe",
    imageFit: "cover",
    skills: ["Python", "Skyfield", "Cartopy + Matplotlib"],
    featured: true,
    legacyIds: ["demo-003"],
    links: [
      { label: "Data source (Celestrak TLEs)", href: "https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=tle" },
    ],
    sections: [
      {
        heading: "The problem",
        body:
          "Thousands of Starlink satellites orbit Earth, but it is hard to picture their movement. Most available images are illustrations or coverage maps. They do not show how many satellites pass overhead or how quickly they move.",
      },
      {
        heading: "Why it's hard to see",
        body:
          "People often discuss Starlink using screenshots instead of data. Celestrak publishes satellite orbit data, but it is hard to read without technical tools. I wanted to turn that data into a clear map of satellite positions.",
      },
      {
        heading: "What I built",
        body:
          "I built a Python tool that downloads Starlink orbit data from Celestrak, calculates satellite positions with Skyfield, and draws a world map with Cartopy and Matplotlib. Each dot shows a satellite's position at a given time.",
      },
      {
        heading: "Why it matters",
        body:
          "- Help people understand what a low Earth orbit constellation looks like.\n- Use public data so others can reproduce the map.\n- Make it easier to discuss coverage, crowded orbits, and effects on the night sky.",
      },
      {
        heading: "What I learned",
        body:
          "A small tool can turn public data into a clear picture. A good map can show complex orbital movement at a glance.",
      },
    ],
  },
  {
    slug: "satellite-forecast-2030",
    kind: "personal",
    title: "Satellites in orbit by 2030: a forecast",
    org: "Independent research",
    period: "November 2025",
    summary:
      "Two models that estimate yearly satellite launches through 2030.",
    image: satellitesImg,
    imageAlt: "Illustration of thousands of satellites surrounding the Earth, labeled 'Every single satellite orbiting the Earth'",
    imageFit: "cover",
    skills: ["Python", "scikit-learn", "Forecasting"],
    legacyIds: ["demo-001"],
    links: [
      { label: "Code on GitHub", href: "https://github.com/omarzoghayyer/satellite-growth-2030" },
      { label: "Original post on X", href: "https://x.com/OZoghayyer/status/1986701399888109900" },
    ],
    sections: [
      {
        heading: "The problem",
        body:
          "Satellite launches rose quickly, mostly because of low Earth orbit internet networks such as Starlink. Many forecasts rely on company plans instead of launch history. I built two simple models as a clear starting point.",
      },
      {
        heading: "Limits of other forecasts",
        body:
          "- Industry reports often use company targets instead of launch history.\n- Launch growth changed after reusable rockets became common.\n- Simple forecasts do not always show uncertainty or explain how the model works.",
      },
      {
        heading: "Approach",
        body:
          "I used UCS yearly totals to build two models: **linear regression** for steady growth and **log-linear regression** for faster growth after 2019. The estimates give a range for 2030. The code is public so others can reproduce the results.",
      },
      {
        heading: "Code",
        body:
          "```python\nimport pandas as pd\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression\n\ndf = pd.read_csv(\"ucs_satellites_by_year.csv\")\nX = df[[\"year\"]].values\ny = df[\"total\"].values\n\nlin = LinearRegression().fit(X, y)\nloglin = LinearRegression().fit(X, np.log(y))\n\nprint(\"2030 linear:\", lin.predict([[2030]]))\nprint(\"2030 log-linear:\", np.exp(loglin.predict([[2030]])))\n```",
      },
      {
        heading: "What I learned",
        body:
          "- Launches grew faster after 2019. The models estimate 1,300 to 3,400 launches a year by 2030.\n- The estimates differ by more than 2 times, so a range is more useful than one number.\n- The jump in 2019–2020 may mark a lasting change in launch rates. Future models should separate orbit types and launch periods.\n- The code is public so others can review the work.",
      },
    ],
  },
  {
    slug: "tesla-open-safety-program",
    kind: "personal",
    title: "An open safety program for Tesla Autopilot",
    org: "Independent case study",
    period: "2025",
    summary:
      "An idea for making Autopilot safety data public, so people can see what the car can really do.",
    image: teslaImg,
    imageAlt: "Illustration of a Tesla on a highway at sunset with overlaid sensor and hazard annotations",
    imageFit: "cover",
    skills: ["Product strategy", "Safety metrics", "Telemetry"],
    featured: true,
    legacyIds: ["demo-002", "tesla-autopilot-safety"],
    links: [{ label: "Thread on X", href: "https://x.com/OZoghayyer/status/1984783106818392169" }],
    sections: [
      {
        heading: "The problem",
        body:
          "Autopilot crashes, unclear claims about self-driving, and limited safety data make it hard to judge the system. Drivers, regulators, and researchers lack shared data, so public debate often relies on individual stories and headlines.",
      },
      {
        heading: "Root cause",
        body:
          "Marketing can make Autopilot sound self-driving, though it is a driver-assistance system. Safety data is split across teams, and there is no public dashboard showing trends or failures. This makes it hard for people to compare claims with evidence.",
      },
      {
        heading: "Proposed solution",
        body:
          "I proposed an Open Safety Program to publish anonymous safety and near-miss data, use shared definitions for incidents, and support outside research. It would work with other safety tools:\n\n- **PROMETHEUS**: test changes in a virtual model before release\n- **AETHER**: test how driver feedback affects the system\n- **ORION**: share hazard alerts between cars and the cloud\n- **PERSEUS**: train and test with a fleet that uses LiDAR\n\nplus an open transparency layer so the public can track improvements over time.",
      },
      {
        heading: "Estimated results in the proposal",
        body:
          "The proposal aims to give drivers, regulators, and researchers clear evidence. The figures below are estimates from the proposal, not measured results:\n\n- +10-point improvement in a Trust Index within 12 months\n- +30% driver engagement from adaptive human-in-the-loop feedback (AETHER)\n- Up to a 99% projected reduction in Autopilot-related crashes from system-wide hazard sharing (ORION + PROMETHEUS)\n- 438% three-year ROI with payback in under a year, on a modeled $111.5M three-year cost and $600M benefit",
      },
      {
        heading: "What I learned",
        body:
          "Clear definitions and public data would make it easier to check safety claims and track progress. No automated system is perfect; it should be tested and improved over time.",
      },
    ],
  },
];

export const workProjects = projects.filter((p) => p.kind === "work");
export const personalProjects = projects.filter((p) => p.kind === "personal");
export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function findProjectByLegacyId(id) {
  return projects.find((p) => p.slug === id || p.legacyIds?.includes(id)) || null;
}

// Where a project card should link. Entries without a detail body (and no
// custom href) render as plain cards.
export function projectHref(project) {
  if (project.href) return project.href;
  if (project.sections?.length) return `/projects/${project.slug}`;
  return null;
}
