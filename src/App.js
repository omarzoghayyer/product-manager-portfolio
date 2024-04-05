import React, { useRef, useEffect } from "react";
import "./style/App.css";
import ProfileInfo from "./profileInfo.js";
// import Terminal from "./terminal.js";
import Projects from "./projects.js";
import Photo from "./photo.js";
import Summary from "./summary.js";
import Contact from "./contact.js";
import Recording from "./recording.js";

function App() {
  const aboutRef = useRef(null);

  useEffect(() => {
    // Focus on the About section when the component mounts
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="App">
      <header>
        <nav className="navigation">
          <ul>
            <li>
              <a href="#profile" className="highlighted">
                About
              </a>
            </li>
            <li>
              <a href="#projects" className="highlighted" >Projects</a>
            </li>
            {/* <li>
              <a href="#terminal">Terminal</a>
            </li> */}
            <li>
              <a href="#contact"className="highlighted" >Contact</a>
            </li>
          </ul>
        </nav>
      </header>
      <div className="content">
        <p className="construction">The website is currently in development. If you have any suggestions or feedback, kindly report them through the bug submission section of my repository at https://github.com/omarzoghayyer/product-manager-portfolio.</p>
        <div ref={aboutRef}>
          <ProfileInfo />
          <Photo />
          <Recording />
          <Summary />
        </div>

        <section id="projects" style={{ minHeight: "50vh" }}>
          <Projects />
        </section>

        {/* <section id="terminal" style={{ minHeight: "50vh" }}>
          <Terminal />
        </section>
         */}
        <section id="contact" style={{ minHeight: "50vh" }}>
          <Contact />
        </section>
      </div>
    </div>
  );
}

export default App;
