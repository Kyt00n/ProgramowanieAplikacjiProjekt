import React from "react";
import { Task } from "../entities/Task";
import "../styles/KanbanBoard.css";
import "../styles/TaskCard.css"; 

const TaskCard: React.FC<{
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: number) => void;
  onClick: () => void;
}> = ({ task, onDragStart, onClick }) => (
  <div
    className="kanban-task jira-task-card"
    draggable
    onDragStart={(e) => onDragStart(e, task.id)}
    onClick={onClick}
    style={{ cursor: "pointer", position: "relative" }}
    tabIndex={0}
    role="button"
    aria-label={`Open details for ${task.name}`}
  >
    <span className="task-card-id">#{task.id}</span>
    <div className="jira-task-title">{task.name}</div>
    <div className="jira-task-desc">{task.description}</div>
  </div>
);

export default TaskCard;