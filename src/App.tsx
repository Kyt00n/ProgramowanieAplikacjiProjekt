import { useState, useCallback } from 'react'
import './styles/App.css'
import KanbanBoard from './views/Kanban'
import "./styles/KanbanBoard.css"
import Stories from './views/Stories'
import CommandBox from './components/ComandBox'
import Projects from './views/Projects'
import { ProjectService } from './services/ProjectService'
import { StoryService } from './services/StoryService'
import { TaskService } from './services/TaskService'

function App() {
  const [view, setView] = useState<"kanban" | "stories" | "projects">("kanban");

  const [projects, setProjects] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchProjects = useCallback(() => {
    ProjectService.getAllProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
  }, []);
  const fetchStories = useCallback(() => {
    StoryService.getAllStories()
      .then(setStories)
      .catch(() => setStories([]));
  }, []);
  const fetchTasks = useCallback(() => {
    TaskService.getAllTasks()
      .then(setTasks)
      .catch(() => setTasks([]));
  }, []);

  const refreshAll = useCallback(() => {
    fetchProjects();
    fetchStories();
    fetchTasks();
  }, [fetchProjects, fetchStories, fetchTasks]);

  return (
    <div>
      {view === "kanban" && <KanbanBoard tasks={tasks} stories={stories} fetchTasks={fetchTasks} />}
      {view === "stories" && <Stories stories={stories} fetchStories={fetchStories} />}
      {view === "projects" && <Projects projects={projects} fetchProjects={fetchProjects} />}
      <div style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100vw",
        background: "#111",
        borderTop: "2px solid #00ff00",
        zIndex: 1100,
        padding: "8px 0"
      }}>
        <CommandBox
          onRequestViewChange={setView}
          onProjectsChanged={fetchProjects}
          onStoriesChanged={fetchStories}
          onTasksChanged={fetchTasks}
          onAnyChanged={refreshAll}
        />
      </div>
    </div>
  )
}

export default App
