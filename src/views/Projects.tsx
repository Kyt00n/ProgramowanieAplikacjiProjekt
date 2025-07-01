import React from "react";
import { ProjectService } from "../services/ProjectService";
import ProjectCard from "../components/ProjectCard";

const Projects: React.FC = () => {
  const projects = ProjectService.getAllProjects();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ color: "#00ff00", fontFamily: "Consolas, Courier New, monospace" }}>Projects</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {projects.length === 0 && (
          <div style={{ color: "#00ff00" }}>No projects found.</div>
        )}
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;