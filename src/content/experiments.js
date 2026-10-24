// src/content/experiments.js
// Experiments: things I built or tried that didn't go as planned.
// Shown at /projects/experiments.
//
// Entry shape
// -----------
// slug        Unique id, used as the anchor: /projects/experiments#<slug>
// title       Short name of the experiment.
// period      Free text, e.g. "2025 – 2026". Optional.
// draft       true = only visible in development (`npm start`), hidden on the
//             live site.
// idea        What I wanted to try, and why.
// built       What I actually built.
// happened    What happened.
// links       Optional: [{ label, href }]. Internal links start with "/".
//
// Fields left as TODO show a "To fill in" note in development and are left
// out on the live site. Fields can use Markdown.

export const TODO = "TODO";

export const experiments = [
  {
    slug: "theos",
    title: "theOS: a phone with no number, no SIM, no carrier",
    period: TODO,
    draft: false,
    idea:
      "Phone numbers were designed for telephone networks, not private digital communication. I wanted to try another approach: a phone where your identity is a key stored on your device, with no number, SIM, or carrier.",
    built:
      "I wrote a phone operating system in Rust.\n\n- The phone creates an Ed25519 identity key. No username or account is needed.\n- Messages use end-to-end encryption (X3DH, Double Ratchet, and ChaCha20-Poly1305).\n- A custom distributed hash table (DHT) lets phones find each other without a central directory.\n- Messages, calls, and notifications use this network. The software passes 547 tests.\n- The kernel boots in a virtual device, and the screen interface renders.",
    happened:
      "Phase 2 is complete: the software passes its tests, and the kernel boots in a virtual device. In Phase 3, I'm working to run it on a Pixel 7 Pro. The phone still needs drivers for its screen, touch input, audio, Wi-Fi, and storage.",
    links: [{ label: "See the theOS page", href: "/the-os" }],
  },
];

const SHOW_DRAFTS = import.meta.env.DEV;

export const visibleExperiments = experiments.filter((e) => SHOW_DRAFTS || !e.draft);

export function isMissing(value) {
  return !value || value === TODO;
}

export const EXPERIMENT_FIELDS = [
  { key: "idea", label: "The idea" },
  { key: "built", label: "What I built" },
  { key: "happened", label: "What happened" },
];
