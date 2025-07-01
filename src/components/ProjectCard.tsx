import React from "react";
import { Project } from "../entities/Project";
import "../styles/KanbanBoard.css";
import "../styles/TaskCard.css";

const ProjectCard: React.FC<{
  project: Project;
  onClick?: () => void;
}> = ({ project, onClick }) => (
  <div
    className="kanban-task jira-task-card"
    style={{ cursor: "pointer", position: "relative" }}
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

export default ProjectCard;