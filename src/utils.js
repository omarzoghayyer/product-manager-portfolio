import MyLab from "./components/MyLab";

// Keep this tiny and explicit so links always match routes exactly.
export function createPageUrl(name) {
  const map = {
    Home: "/",
    About: "/about",
    CaseStudies: "/case-studies",
    CaseStudyDetail: "/case-study",
    Contact: "/contact",


  };
  return map[name] || "/";
}
