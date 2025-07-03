import React, { useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import "../styles/Projects.css";

interface ProjectsProps {
  projects: any[];
  fetchProjects: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, fetchProjects }) => {
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="projects-container">
      <h2 className="projects-title">Projects</h2>
      <div className="projects-list">
        {projects === undefined ? (
          <div className="projects-message">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="projects-message">No projects found.</div>
        ) : (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;