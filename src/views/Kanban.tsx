import React from "react";
import { Task } from "../entities/Task";
import { TaskService } from "../services/TaskService";

const KanbanBoard: React.FC = () => {
    const [tasks, setTasks] = React.useState<Task[]>(() => TaskService.getAllTasks());
    
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
      const renderColumn = (status: "todo" | "doing" | "done", title: string) => (
        <div
          className="kanban-column"
          onDrop={(e) => handleDrop(e, status)}
          onDragOver={allowDrop}
        >
          <h3>{title}</h3>
          {tasks
            .filter((task) => task.status === status)
            .map((task) => (
              <div
                key={task.id}
                className="kanban-task"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
              >
                <h4>{task.name}</h4>
                <p>{task.description}</p>
              </div>
            ))}
        </div>
      );
    

 return (
    <div>
      <h1>Kanban Board</h1>
        <div className="kanban-board">
            {renderColumn("todo", "To Do")}
            {renderColumn("doing", "Doing")}
            {renderColumn("done", "Done")}
        </div>
    </div>
  );
};
export default KanbanBoard;