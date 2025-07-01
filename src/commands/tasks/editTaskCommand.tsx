import React, { useState } from "react";
import { Task } from "../../entities/Task";
import { TaskService } from "../../services/TaskService";
import "../../styles/TaskModal.css";

export const EditTaskModal: React.FC<{
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
}> = ({ task, onClose, onEdit }) => {
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [storyId, setStoryId] = useState(task.storyId?.toString() || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(task.priority);
  const [status, setStatus] = useState<"todo" | "doing" | "done">(task.status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onEdit({
      ...task,
      name,
      description,
      storyId: Number(storyId) || 0,
      priority,
      status,
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
        <div className="taskmodal-title">Edit Task</div>
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
        <input
          placeholder="Story ID"
          value={storyId}
          onChange={(e) => setStoryId(e.target.value)}
          className="taskmodal-input"
        />
        <div className="taskmodal-row">
          <label>
            Priority:&nbsp;
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="taskmodal-select"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label>
            Status:&nbsp;
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="taskmodal-select"
            >
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
            </select>
          </label>
        </div>
        <button type="submit" className="taskmodal-submit-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export function handleEditTask(
  updatedTask: Task,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  TaskService.updateTask(updatedTask);
  setHistory((prev) => [...prev, `Task #${updatedTask.id} updated!`]);
}