import React, { useState } from 'react';
import './style/Projects.css';
import battlefieldMobileImage from './Images/battlefield-mobile.png'; 
import battlefield2042 from './Images/battlefield-2042.png';
import sims from './Images/sims.png'; 

const projectsData = [
  { id: 1, title: 'Battlefield Mobile', description: "As a Quality Designer for the Battlefield Mobile franchise, I led the backend, core technology, and performance QA teams, with a focus on maintaining high quality standards and driving innovation. I developed and shipped both manual and automated testing solutions to identify early bugs and defects, ensuring the delivery of a high value product to the end user.", imageUrl: battlefieldMobileImage },
  { id: 2, title: 'Battlefield HD', description: "In my role as a Quality Designer I for the upcoming release of Battlefield, I led the QA automation team, focusing on collaborating with cross-functional studios across Sweden, Britain, and the USA to develop automated solutions for developers. Additionally, I researched, developed, and delivered automated gameplay solutions, creating PRDs and roadmaps for gameplay automation and in-game automatic screen capture for ML model experiments, which were adopted by over 300 internal users. The in-game screen capture system significantly reduced manual efforts by approximately 80%, replacing the need for teams to manually search for asset versions—a process that previously took 30 minutes per build—with an automated solution that allowed users to instantly view asset statuses by version directly from a locally built website.", imageUrl: battlefield2042 },
  { id: 3, title: 'The Sims', description: "In my role as Quality Designer II for the future Sims game, I led a cross-functional team to build an end-to-end product that captures critical data, including screenshots, logs, and device information, from mobile devices when users report bugs. This data is automatically shared via Slack, streamlining internal communication. The product was successfully adopted by over 200 internal users. I led efforts to research and develop PRDs for new ideas and features focused on delivering value to the end user. As the primary point of contact for automation efforts on the new Sims game, I developed and established PRDs to ensure clear and detailed specifications for the products we delivered. I worked closely with product managers, producers, and developers to craft a cohesive and well-defined roadmap, ensuring project alignment and smooth execution across all teams. I also focused on tracking and mitigating risks and dependencies to proactively address potential issues.", imageUrl: sims }
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

  return (
    <div className="projects-container">
      {projectsData.map((project) => (
        <div key={project.id} className="project">
          <div className="project-content" onClick={() => handleProjectClick(project)}>
            <img src={project.imageUrl} alt={project.title} />
            <h3>{project.title}</h3>
          </div>
          <p className="project-description">{project.description}</p>
        </div>
      ))}
      {selectedProject && (
        <div className="project-popup" onClick={handleOverlayClick}>
          <div className="popup-content">
            <button className="close-btn" onClick={handleClosePopup}>Close</button>
            <h2>{selectedProject.title}</h2>
            <img src={selectedProject.imageUrl} alt={selectedProject.title} />
            <p>{selectedProject.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
