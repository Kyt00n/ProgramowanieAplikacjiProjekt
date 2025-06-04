import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import KanbanBoard from './views/Kanban'
import "./styles/KanbanBoard.css"

function App() {
  const [count, setCount] = useState(0)

  return (
      <div>
      <h1>Kanban Board</h1>
      <KanbanBoard />
    </div>
  )
}

export default App
