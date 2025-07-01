import React, { useState } from "react";
import { Task } from "../../entities/Task";
import { TaskService } from "../../services/TaskService";
import "../../styles/TaskModal.css";

// Simple modal for adding a task
export const AddTaskModal: React.FC<{
  onClose: () => void;
  onAdd: (task: Omit<Task, "id" | "dateOfCreation">) => void;
}> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [storyId, setStoryId] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      description,
      storyId: Number(storyId) || 0,
      priority,
      status,
      userId: undefined,
      dateStart: undefined,
      dateEnd: undefined,
      estimatedTime: undefined,
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
        <div className="taskmodal-title">Add Task</div>
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
          Add
        </button>
      </form>
    </div>
  );
};

// handleAddTask logic extracted as a utility function
export function handleAddTask(
  task: Omit<Task, "id" | "dateOfCreation">,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  const allTasks = TaskService.getAllTasks();
  const newId =
    allTasks.length > 0
      ? Math.max(...allTasks.map((t) => t.id)) + 1
      : 1;
  const newTask: Task = {
    ...task,
    id: newId,
    dateOfCreation: new Date(),
  };
  TaskService.saveTask(newTask);
  setHistory((prev) => [...prev, "Task added!"]);
}