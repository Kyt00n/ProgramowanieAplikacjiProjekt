import React from "react";
import { Project } from "../../entities/Project";
import { ProjectService } from "../../services/ProjectService";
import "../../styles/TaskModal.css";

export const DeleteProjectModal: React.FC<{
  project: Project;
  onClose: () => void;
  onDelete: (projectId: number) => void;
}> = ({ project, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete(project.id);
    onClose();
  };

  return (
    <div className="taskmodal-backdrop">
      <div className="taskmodal-form">
        <button
          type="button"
          onClick={onClose}
          className="taskmodal-close-btn"
        >
          ×
        </button>
        <div className="taskmodal-title">Delete Project</div>
        <div style={{ marginBottom: 16 }}>
          Are you sure you want to delete project <b>#{project.id}</b> (<i>{project.name}</i>)?
        </div>
        <div className="taskmodal-row">
          <button
            type="button"
            className="taskmodal-submit-btn"
            style={{ background: "#111", borderColor: "#ff0033", color: "#ff0033" }}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="taskmodal-submit-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export function handleDeleteProject(
  projectId: number,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  ProjectService.deleteProject(projectId);
  setHistory((prev) => [...prev, `Project #${projectId} deleted!`]);
}