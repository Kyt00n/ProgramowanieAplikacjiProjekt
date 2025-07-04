import React from "react";
import { Task } from "../entities/Task";
import { TaskService } from "../services/TaskService";
import "../styles/KanbanBoard.css";

interface TaskViewProps {
  taskId: number;
  onClose: () => void;
}

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString();
};

const TaskView: React.FC<TaskViewProps> = ({ taskId, onClose }) => {
  const [task, setTask] = React.useState<Task | undefined>(undefined);

  React.useEffect(() => {
    const fetchTask = async () => {
      try {
        const t = await TaskService.getTaskById(taskId);
        setTask(t);
      } catch {
        setTask(undefined);
      }
    };
    fetchTask();
  }, [taskId]);

  if (!task) {
    return (
      <div className="jira-task-card" style={{ maxWidth: 480, margin: "40px auto", padding: 32 }}>
        <div className="jira-task-title">Task not found</div>
        <button className="jira-task-close-btn" onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div className="jira-task-card" style={{ maxWidth: 480, margin: "40px auto", padding: 32, position: "relative" }}>
      <button
        className="jira-task-close-btn"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "#ebecf0",
          border: "none",
          borderRadius: "50%",
          width: 32,
          height: 32,
          cursor: "pointer",
          fontWeight: 600,
          color: "#42526e"
        }}
        aria-label="Close"
      >
        ×
      </button>
      <div className="jira-task-title" style={{ fontSize: 22, marginBottom: 8 }}>{task.name}</div>
      <div className="jira-task-desc" style={{ marginBottom: 16 }}>{task.description}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <strong>Status:</strong>{" "}
          <span style={{
            color:
              task.status === "done"
                ? "#36b37e"
                : task.status === "doing"
                ? "#0052cc"
                : "#ffab00",
            fontWeight: 600,
            textTransform: "capitalize"
          }}>
            {task.status}
          </span>
        </div>
        <div>
          <strong>Priority:</strong>{" "}
          <span style={{
            color:
              task.priority === "high"
                ? "#de350b"
                : task.priority === "medium"
                ? "#ffab00"
                : "#36b37e",
            fontWeight: 600,
            textTransform: "capitalize"
          }}>
            {task.priority}
          </span>
        </div>
        <div>
          <strong>Story ID:</strong> {task.storyId}
        </div>
        <div>
          <strong>Assigned User:</strong> {task.userId ?? "-"}
        </div>
        <div>
          <strong>Date Created:</strong> {formatDate(task.dateOfCreation)}
        </div>
        <div>
          <strong>Start:</strong> {formatDate(task.dateStart)}
        </div>
        <div>
          <strong>End:</strong> {formatDate(task.dateEnd)}
        </div>
        <div>
          <strong>Estimated Time:</strong> {task.estimatedTime ? `${task.estimatedTime}h` : "-"}
        </div>
      </div>
    </div>
  );
};

export default TaskView;