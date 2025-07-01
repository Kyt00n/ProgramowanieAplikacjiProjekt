import React from "react";
import { Task } from "../entities/Task";
import { TaskService } from "../services/TaskService";
import "../styles/KanbanBoard.css";
import TaskCard from "../components/TaskCard";
import TaskView from "./Task";

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>(() => TaskService.getAllTasks());
  const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task["status"]) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    TaskService.saveTask(
      tasks.find((task) => task.id === taskId)!
    );
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseTaskView = () => {
    setSelectedTaskId(null);
  };

  const renderColumn = (status: "todo" | "doing" | "done", title: string) => (
    <div
      className={`kanban-column jira-column jira-column-${status}`}
      onDrop={(e) => handleDrop(e, status)}
      onDragOver={allowDrop}
    >
      <div className="jira-column-header">
        <h3>{title}</h3>
        <span className="jira-task-count">
          {tasks.filter((task) => task.status === status).length}
        </span>
      </div>
      <div className="jira-tasks-list">
        {tasks
          .filter((task) => task.status === status)
          .map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDragStart={handleDragStart}
              onClick={() => handleTaskClick(task.id)}
            />
          ))}
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div className="kanban-board jira-board" style={{ filter: selectedTaskId ? "blur(2px)" : undefined }}>
        {renderColumn("todo", "To Do")}
        {renderColumn("doing", "In Progress")}
        {renderColumn("done", "Done")}
      </div>
      {selectedTaskId !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(9,30,66,0.18)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onClick={handleCloseTaskView}
        >
          <div onClick={e => e.stopPropagation()}>
            <TaskView taskId={selectedTaskId} onClose={handleCloseTaskView} />
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;