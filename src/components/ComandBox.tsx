import React, { useState } from "react";
import { Task } from "../entities/Task";
import { AddTaskModal, handleAddTask } from "../commands/tasks/addTaskCommand";
import { EditTaskModal, handleEditTask } from "../commands/tasks/editTaskCommand";
import { DeleteTaskModal, handleDeleteTask } from "../commands/tasks/deleteTaskCommand";
import { LoginModal, handleLogin } from "../commands/login/loginCommand";
import { Story } from "../entities/Story";
import { AddStoryModal, handleAddStory } from "../commands/stories/addStoryCommand";
import { EditStoryModal, handleEditStory } from "../commands/stories/editStoryCommand";
import { DeleteStoryModal, handleDeleteStory } from "../commands/stories/deleteStoryCommand";
import { AddProjectModal, handleAddProject } from "../commands/projects/addProjectCommand";
import { EditProjectModal, handleEditProject } from "../commands/projects/editProjectCommand";
import { DeleteProjectModal, handleDeleteProject } from "../commands/projects/deleteProjectCommand";
import { Project } from "../entities/Project";
import { ProjectService } from "../services/ProjectService";
import { TaskService } from "../services/TaskService";
import { StoryService } from "../services/StoryService";
import "../styles/CommandBox.css";

const CommandBox: React.FC<{ onRequestViewChange?: (view: "kanban" | "stories" | "projects") => void }> = ({ onRequestViewChange }) => {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);

  // Story modals
  const [showAddStoryModal, setShowAddStoryModal] = useState(false);
  const [editStory, setEditStory] = useState<Story | null>(null);
  const [deleteStory, setDeleteStory] = useState<Story | null>(null);

  // Project modals
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [deleteProject, setDeleteProject] = useState<Project | null>(null);

  const [showLoginModal, setShowLoginModal] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };

  const handleCommand = async (cmd: string) => {
    let response = "";
    const trimmed = cmd.trim();
    const lower = trimmed.toLowerCase();

    // Task commands
    if (lower === "add task") {
      setShowAddModal(true);
      response = "Opening Add Task modal...";
    } 
    else if (lower.startsWith("edit task")) {
      const parts = trimmed.split(" ");
      const id = Number(parts[2]);
      if (!isNaN(id)) {
        const task = TaskService.getTaskById(id);
        if (task) {
          setEditTask(task);
          response = `Opening Edit Task modal for #${id}...`;
        } else {
          response = `Task #${id} not found.`;
        }
      } else {
        response = "Usage: edit task <id>";
      }
    } 
    else if (lower.startsWith("delete task")) {
      const parts = trimmed.split(" ");
      const id = Number(parts[2]);
      if (!isNaN(id)) {
        const task = TaskService.getTaskById(id);
        if (task) {
          setDeleteTask(task);
          response = `Opening Delete Task modal for #${id}...`;
        } else {
          response = `Task #${id} not found.`;
        }
      } else {
        response = "Usage: delete task <id>";
      }
    }
    // Story commands
    else if (lower === "add story") {
      setShowAddStoryModal(true);
      response = "Opening Add Story modal...";
    } else if (lower.startsWith("edit story")) {
      const parts = trimmed.split(" ");
      const id = Number(parts[2]);
      if (!isNaN(id)) {
        const story = StoryService.getStoryById(id);
        if (story) {
          setEditStory(story);
          response = `Opening Edit Story modal for #${id}...`;
        } else {
          response = `Story #${id} not found.`;
        }
      } else {
        response = "Usage: edit story <id>";
      }
    } else if (lower.startsWith("delete story")) {
      const parts = trimmed.split(" ");
      const id = Number(parts[2]);
      if (!isNaN(id)) {
        const story = StoryService.getStoryById(id);
        if (story) {
          setDeleteStory(story);
          response = `Opening Delete Story modal for #${id}...`;
        } else {
          response = `Story #${id} not found.`;
        }
      } else {
        response = "Usage: delete story <id>";
      }
    }else if (lower === "add project") {
      setShowAddProjectModal(true);
      response = "Opening Add Project modal...";
    } else if (lower.startsWith("edit project")) {
      const parts = trimmed.split(" ");
      const id = Number(parts[2]);
      if (!isNaN(id)) {
        ProjectService.getProjectById(id).then(project => {
      if (project) {
        setEditProject(project);
        response = `Opening Edit Project modal for #${id}...`;
      } else {
        response = `Project #${id} not found.`;
      }
      setHistory((prev) => [...prev, `> ${cmd}`, response]);
    }).catch(() => {
      response = `Project #${id} not found.`;
      setHistory((prev) => [...prev, `> ${cmd}`, response]);
    });
    return;
      } else {
        response = "Usage: edit project <id>";
      }
    } else if (lower.startsWith("delete project")) {
      const parts = trimmed.split(" ");
      const id = Number(parts[2]);
      if (!isNaN(id)) {
        const project = ProjectService.getProjectById(id).then(project => {
        if (project) {
          setDeleteProject(project);
          response = `Opening Delete Project modal for #${id}...`;
        } else {
          response = `Project #${id} not found.`;
        }
        setHistory((prev) => [...prev, `> ${cmd}`, response]);
      }).catch(() => {
          response = `Project #${id} not found.`;
          setHistory((prev) => [...prev, `> ${cmd}`, response]);
        });
        return;
      } else {
        response = "Usage: delete project <id>";
      }
    } 
    else if (lower === "login") {
      setShowLoginModal(true);
      response = "Opening Login modal...";
    } else if (lower === "kanban") {
        onRequestViewChange?.("kanban");
        response = "Switched to Kanban view.";
    } else if (lower === "stories") {
      onRequestViewChange?.("stories");
      response = "Switched to Stories view.";
    }
    else if (lower === "projects") {
      onRequestViewChange?.("projects");
      response = "Switched to Projects view.";
    }
    else if (trimmed === "") {
      response = "";
    } else {
      response = `Unknown command: ${cmd}`;
    }
    setHistory((prev) => [...prev, `> ${cmd}`, response]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCommand(command);
    setCommand("");
  };


  // Task handlers
  const onAddTask = (task: Omit<Task, "id" | "dateOfCreation">) => {
    handleAddTask(task, setHistory);
  };
  const onEditTask = (task: Task) => {
    handleEditTask(task, setHistory);
  };
  const onDeleteTask = (taskId: number) => {
    handleDeleteTask(taskId, setHistory);
  };

  // Story handlers
  const onAddStory = (story: Omit<Story, "id" | "dateOfCreation">) => {
    handleAddStory(story, setHistory);
  };
  const onEditStory = (story: Story) => {
    handleEditStory(story, setHistory);
  };
  const onDeleteStory = (storyId: number) => {
    handleDeleteStory(storyId, setHistory);
  };

  // Project handlers
  const onAddProject = (project: Omit<Project, "id">) => {
    handleAddProject(project, setHistory);
  };
  const onEditProject = (project: Project) => {
    handleEditProject(project, setHistory);
  };
  const onDeleteProject = (projectId: number) => {
    handleDeleteProject(projectId, setHistory);
  };

  return (
    <>
      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onAdd={onAddTask}
        />
      )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onEdit={onEditTask}
        />
      )}
      {deleteTask && (
        <DeleteTaskModal
          task={deleteTask}
          onClose={() => setDeleteTask(null)}
          onDelete={onDeleteTask}
        />
      )}
      {showAddStoryModal && (
        <AddStoryModal
          onClose={() => setShowAddStoryModal(false)}
          onAdd={onAddStory}
        />
      )}
      {editStory && (
        <EditStoryModal
          story={editStory}
          onClose={() => setEditStory(null)}
          onEdit={onEditStory}
        />
      )}
      {deleteStory && (
        <DeleteStoryModal
          story={deleteStory}
          onClose={() => setDeleteStory(null)}
          onDelete={onDeleteStory}
        />
      )}
      {showAddProjectModal && (
        <AddProjectModal
          onClose={() => setShowAddProjectModal(false)}
          onAdd={onAddProject}
        />
      )}
      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEditProject(null)}
          onEdit={onEditProject}
        />
      )}
      {deleteProject && (
        <DeleteProjectModal
          project={deleteProject}
          onClose={() => setDeleteProject(null)}
          onDelete={onDeleteProject}
        />
      )}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={() => setShowLoginModal(false)}
        />
      )}
      <div className="commandbox-root">
        <div className="commandbox-history">
          {history.map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="commandbox-form">
          <span className="commandbox-prompt">&gt;</span>
          <input
            type="text"
            value={command}
            onChange={handleInputChange}
            className="commandbox-input"
            autoFocus
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      </div>
    </>
  );
};

export default CommandBox;