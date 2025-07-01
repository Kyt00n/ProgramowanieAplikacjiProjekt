import React from "react";
import { Task } from "../../entities/Task";
import { TaskService } from "../../services/TaskService";
import "../../styles/TaskModal.css";

export const DeleteTaskModal: React.FC<{
  task: Task;
  onClose: () => void;
  onDelete: (taskId: number) => void;
}> = ({ task, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete(task.id);
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
        <div className="taskmodal-title">Delete Task</div>
        <div style={{ marginBottom: 16 }}>
          Are you sure you want to delete task <b>#{task.id}</b> (<i>{task.name}</i>)?
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

export function handleDeleteTask(
  taskId: number,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  TaskService.deleteTask(taskId);
  setHistory((prev) => [...prev, `Task #${taskId} deleted!`]);
}