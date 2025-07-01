import React from "react";
import { StoryService } from "../services/StoryService";
import StoriesCard from "../components/StoriesCard";

const Stories: React.FC = () => {
  const stories = StoryService.getStoriesForSelectedProject();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ color: "#00ff00", fontFamily: "Consolas, Courier New, monospace" }}>Stories</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {stories.length === 0 && (
          <div style={{ color: "#00ff00" }}>No stories found.</div>
        )}
        {stories.map((story) => (
          <StoriesCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default Stories