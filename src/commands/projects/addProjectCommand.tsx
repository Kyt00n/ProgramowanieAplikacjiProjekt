import React, { useState } from "react";
import { Project } from "../../entities/Project";
import { ProjectService } from "../../services/ProjectService";
import "../../styles/TaskModal.css";

export const AddProjectModal: React.FC<{
  onClose: () => void;
  onAdd: (project: Omit<Project, "id">) => void;
}> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
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
        <div className="taskmodal-title">Add Project</div>
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
          Add
        </button>
      </form>
    </div>
  );
};

export function handleAddProject(
  project: Omit<Project, "id">,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  const allProjects = ProjectService.getAllProjects();
  const newId =
    allProjects.length > 0
      ? Math.max(...allProjects.map((p) => p.id)) + 1
      : 1;
  const newProject: Project = {
    ...project,
    id: newId,
  };
  ProjectService.saveProject(newProject);
  setHistory((prev) => [...prev, "Project added!"]);
}