import { useState } from 'react'
import './App.css'
import KanbanBoard from './views/Kanban'
import "./styles/KanbanBoard.css"
import Stories from './views/Stories'
import CommandBox from './components/ComandBox'
import Projects from './views/Projects'


function App() {
  const [view, setView] = useState<"kanban" | "stories" | "projects">("kanban");

  return (
    <div>
      {view === "kanban" && <KanbanBoard />}
      {view === "stories" && <Stories />}
      {view === "projects" && <Projects />}
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
        <CommandBox onRequestViewChange={setView} />
      </div>
    </div>
  )
}

export default App
