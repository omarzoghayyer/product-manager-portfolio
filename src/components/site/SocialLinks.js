import React from "react";
import { Linkedin, Github, Mail } from "lucide-react";
import { site } from "../../content/site";

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.74H5.58l11.09 14.43Z" />
    </svg>
  );
}

const ICONS = { LinkedIn: Linkedin, GitHub: Github, X: XIcon };

// Small outlined icons with optional underlined labels, used in the home
// footer, and About page.
export default function SocialLinks({ withLabels = false, includeEmail = true, className = "" }) {
  const items = [
    ...(includeEmail ? [{ label: "Email", href: `mailto:${site.email}`, Icon: Mail }] : []),
    ...site.socials.map((s) => ({ ...s, Icon: ICONS[s.label] })),
  ];

  return (
    <ul className={`flex flex-wrap items-center ${withLabels ? "gap-x-6 gap-y-2" : "gap-4"} ${className}`}>
      {items.map(({ label, href, Icon }) => {
        const external = href.startsWith("http");
        return (
          <li key={href}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center gap-2 text-[0.95rem] hover:text-accent transition-colors"
              aria-label={withLabels ? undefined : label}
            >
              {Icon && <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
              {withLabels && <span className="underline underline-offset-[3px]">{label}</span>}
              {external && withLabels && <span className="sr-only"> (opens in a new tab)</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
