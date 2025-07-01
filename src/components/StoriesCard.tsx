import React from "react";
import { Story } from "../entities/Story";
import "../styles/KanbanBoard.css";
import "../styles/TaskCard.css";

const StoriesCard: React.FC<{
  story: Story;
  onClick?: () => void;
}> = ({ story, onClick }) => (
  <div
    className="kanban-task jira-task-card"
    style={{ cursor: "pointer", position: "relative" }}
    tabIndex={0}
    role="button"
    aria-label={`Open details for ${story.name}`}
    onClick={onClick}
  >
    <span className="task-card-id">#{story.id}</span>
    <div className="jira-task-title">{story.name}</div>
    <div className="jira-task-desc">{story.description}</div>
    <div style={{ fontSize: 12, color: "#00ff00", marginTop: 4 }}>
      Priority: {story.priority} | Status: {story.status}
    </div>
  </div>
);

export default StoriesCard;