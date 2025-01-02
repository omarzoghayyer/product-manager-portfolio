import React, { useState } from 'react';
import './style/Projects.css';
import battlefieldMobileImage from './Images/battlefield-mobile.png'; 
import zoox from './Images/zoox.png'; 
import battlefield2042 from './Images/battlefield-2042.png';
import sims from './Images/sims.PNG'; 
import FightPandemics from './Images/FightPandemics.png'

const projectsData = [
  {
    id: 1,
    title: 'Zoox; Acquired by Amazon',
    skills: "C++ - Linux Ubuntu - Planning & Strategy - JaaS - Agile Methodology - Quality Assurance - Product Planning ",
    description: "At Zoox, I worked as a Senior Technical Analyst, creating testing roadmaps and strategies to handle the rapid software updates from the development team. My team deployed new updates to the latest autonomous vehicles using Linux Ubuntu and executed detailed scenario-based testing to ensure the software was 100% error-free. We were also the first team to map and collect environment data to build a virtual map of downtown Seattle.",
    imageUrl: zoox 
  },
  { 
    id: 2,
    title: 'FightPandemics',
    skills: "React.Js - styled-components - Ant-Design - Javascript - Front-End development",
    description: "As a Front-End Software Engineer, I implemented a login feature that verifies email addresses, only approving verified ones, and added UI warnings to visually indicate incorrect email or password. I also integrated user messaging and took on fixing several bugs across different areas of the project. Additionally, I worked with product managers to plan future roadmaps.",
    imageUrl: FightPandemics
  },
  { 
    id: 3,
    title: 'Battlefield Mobile',
    skills: "Feature Ownership - Mobile Development - C++ - Unreal Engine 4 - Agile - Game Design - PowerBi/Grafana - Performance Planning - Figma  ",
    description: "As a Quality Designer I for the Battlefield Mobile franchise, I led the backend, core technology, and performance QA teams, with a focus on maintaining high quality standards and driving innovation. I developed and shipped both manual and automated testing solutions to identify early bugs and defects, ensuring the delivery of a high value product to the end user.",
    imageUrl: battlefieldMobileImage
   },
  { 
    id: 4,
    title: 'Battlefield HD',
    skills: "Product Management - BigQuery - Agile - System Design - Agile/Waterfall - Team Building - FrosntEd - Schematics (visual scripting)",
    description: "In my role as a Quality Designer I for the upcoming release of Battlefield, I led the QA automation team, focusing on collaborating with cross-functional studios across Sweden, Britain, and the USA to develop automated solutions for developers. Additionally, I researched, developed, and delivered automated gameplay solutions, creating PRDs and roadmaps for gameplay automation and in-game automatic screen capture for ML model experiments, which were adopted by over 300 internal users. The in-game screen capture system significantly reduced manual efforts by approximately 80%, replacing the need for teams to manually search for asset versions—a process that previously took 30 minutes per build—with an automated solution that allowed users to instantly view asset statuses by version directly from a locally built website.",
    imageUrl: battlefield2042
   },
  { 
    id: 5,
    title: 'The Sims - Mobile',
    skills: "Product Ownership - Leadership - Team Building - Mobile Development Data Analytics - BigQuery - UE5 - Figma - Tools & Infrastructure Design - Performance Planning",
    description: "In my role as Quality Designer II for the future Sims game, I led a cross-functional team to build an end-to-end product that captures critical data, including screenshots, logs, and device information, from mobile devices when users report bugs. This data is automatically shared via Slack, streamlining internal communication. The product was successfully adopted by over 200 internal users. I led efforts to research and develop PRDs for new ideas and features focused on delivering value to the end user. As the primary point of contact for automation efforts on the new Sims game, I developed and established PRDs to ensure clear and detailed specifications for the products we delivered. I worked closely with product managers, producers, and developers to craft a cohesive and well-defined roadmap, ensuring project alignment and smooth execution across all teams. I also focused on tracking and mitigating risks and dependencies to proactively address potential issues.",
    imageUrl: sims
   }
];

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  const handleClosePopup = () => {
    setSelectedProject(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('project-popup')) {
      handleClosePopup();
    }
  };

  // Helper function to convert skills string into an array
  const renderSkillsList = (skills) => {
    const skillsArray = skills.split(' - '); // Split skills string into an array
    return (
      <ul>
        {skillsArray.map((skill, index) => (
          <li key={index}>{skill}</li> // Map over the skills array and create <li> elements
        ))}
      </ul>
    );
  };

  return (
    <div className="projects-container">
      {projectsData.map((project) => (
        <div key={project.id} className="project">
          <div className="project-content" onClick={() => handleProjectClick(project)}>
            <img src={project.imageUrl} alt={project.title} />
            <h3>{project.title}</h3>
          </div>
          <p className="project-description">{project.description}</p>
          <div className="project-skills">
            {renderSkillsList(project.skills)} {/* Render the skills list */}
          </div>
        </div>
      ))}
      {selectedProject && (
        <div className="project-popup" onClick={handleOverlayClick}>
          <div className="popup-content">
            <button className="close-btn" onClick={handleClosePopup}>Close</button>
            <h2>{selectedProject.title}</h2>
            <img src={selectedProject.imageUrl} alt={selectedProject.title} />
            <p>{selectedProject.description}</p>
            <div className="project-skills">
              {renderSkillsList(selectedProject.skills)} {/* Render skills list in the popup */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
