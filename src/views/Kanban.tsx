import React from "react";
import { Task } from "../entities/Task";
import "../styles/KanbanBoard.css";
import TaskCard from "../components/TaskCard";
import TaskView from "./Task";
import { TaskService } from "../services/TaskService";
import { ProjectService } from "../services/ProjectService";
import { Story } from "../entities/Story";

interface KanbanBoardProps {
  tasks: Task[];
  stories: Story[]; 
  fetchTasks: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, stories, fetchTasks }) => {
  const [selectedTaskId, setSelectedTaskId] = React.useState<number | null>(null);

  const selectedProjectId = ProjectService.getSelectedProjectId();

  const storyIdsForProject = selectedProjectId
    ? stories.filter(story => story.projectId === selectedProjectId).map(story => story.id)
    : [];

  const filteredTasks = selectedProjectId
    ? tasks.filter(task => storyIdsForProject.includes(task.storyId))
    : tasks;

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  const handleDrop = async (e: React.DragEvent, newStatus: Task["status"]) => {
    const taskId = parseInt(e.dataTransfer.getData("taskId"), 10);
    const taskToUpdate = tasks.find((task) => task.id === taskId);
    if (taskToUpdate && taskToUpdate.status !== newStatus) {
      let updatedTask = { ...taskToUpdate, status: newStatus };
      if (newStatus === "done") {
        updatedTask.dateEnd = new Date();
      }
      await TaskService.updateTask(updatedTask);
      fetchTasks();
    }
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
          {filteredTasks.filter((task) => task.status === status).length}
        </span>
      </div>
      <div className="jira-tasks-list">
        {filteredTasks
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

  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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