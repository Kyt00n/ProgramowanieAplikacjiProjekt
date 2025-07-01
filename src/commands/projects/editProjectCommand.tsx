import React, { useState } from "react";
import { Project } from "../../entities/Project";
import { ProjectService } from "../../services/ProjectService";
import "../../styles/TaskModal.css";

export const EditProjectModal: React.FC<{
  project: Project;
  onClose: () => void;
  onEdit: (project: Project) => void;
}> = ({ project, onClose, onEdit }) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onEdit({
      ...project,
      name,
      description,
    });
    onClose();
  };

  return (
    <div className="taskmodal-backdrop">
      <form
        onSubmit={handleSubmit}
        className="taskmodal-form"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="taskmodal-close-btn"
        >
          ×
        </button>
        <div className="taskmodal-title">Edit Project</div>
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="taskmodal-input"
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="taskmodal-input"
        />
        <button type="submit" className="taskmodal-submit-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export function handleEditProject(
  updatedProject: Project,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  ProjectService.saveProject(updatedProject);
  setHistory((prev) => [...prev, `Project #${updatedProject.id} updated!`]);
}