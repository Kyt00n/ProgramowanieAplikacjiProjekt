import React, { useEffect } from "react";
import StoriesCard from "../components/StoriesCard";
import { ProjectService } from "../services/ProjectService";

interface StoriesProps {
  stories: any[];
  fetchStories: () => void;
}

const Stories: React.FC<StoriesProps> = ({ stories, fetchStories }) => {
  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const selectedProjectId = ProjectService.getSelectedProjectId();
  const filteredStories = selectedProjectId
    ? stories.filter((story) => story.projectId === selectedProjectId)
    : stories;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h2 style={{ color: "#00ff00", fontFamily: "Consolas, Courier New, monospace" }}>Stories</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredStories.length === 0 && (
          <div style={{ color: "#00ff00" }}>No stories found.</div>
        )}
        {filteredStories.map((story) => (
          <StoriesCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
};

export default Stories;