import React from "react";
import { Project } from "../entities/Project";
import { ProjectService } from "../services/ProjectService";
import "../styles/KanbanBoard.css";
import "../styles/TaskCard.css";

const ProjectCard: React.FC<{
  project: Project;
  onClick?: () => void;
}> = ({ project, onClick }) => {
  const selectedProjectId = ProjectService.getSelectedProjectId();
  const isSelected = selectedProjectId === project.id;

  return (
    <div
      className="kanban-task jira-task-card"
      style={{
        cursor: "pointer",
        position: "relative",
        borderColor: isSelected ? "white" : undefined,
        borderWidth: isSelected ? 2 : undefined,
        borderStyle: isSelected ? "solid" : undefined,
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open details for ${project.name}`}
      onClick={onClick}
    >
      <span className="task-card-id">#{project.id}</span>
      <div className="jira-task-title">{project.name}</div>
      <div className="jira-task-desc">{project.description}</div>
    </div>
  );
};

export default ProjectCard;