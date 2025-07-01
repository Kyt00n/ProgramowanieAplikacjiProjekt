import React from "react";
import { Story } from "../../entities/Story";
import { StoryService } from "../../services/StoryService";
import "../../styles/TaskModal.css";

export const DeleteStoryModal: React.FC<{
  story: Story;
  onClose: () => void;
  onDelete: (storyId: number) => void;
}> = ({ story, onClose, onDelete }) => {
  const handleDelete = () => {
    onDelete(story.id);
    onClose();
  };

  return (
    <div className="taskmodal-backdrop">
      <div className="taskmodal-form">
        <button
          type="button"
          onClick={onClose}
          className="taskmodal-close-btn"
        >
          ×
        </button>
        <div className="taskmodal-title">Delete Story</div>
        <div style={{ marginBottom: 16 }}>
          Are you sure you want to delete story <b>#{story.id}</b> (<i>{story.name}</i>)?
        </div>
        <div className="taskmodal-row">
          <button
            type="button"
            className="taskmodal-submit-btn"
            style={{ background: "#111", borderColor: "#ff0033", color: "#ff0033" }}
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            type="button"
            className="taskmodal-submit-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export function handleDeleteStory(
  storyId: number,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  StoryService.deleteStory(storyId);
  setHistory((prev) => [...prev, `Story #${storyId} deleted!`]);
}