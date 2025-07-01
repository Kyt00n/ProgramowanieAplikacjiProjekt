import React, { useState } from "react";
import { Story } from "../../entities/Story";
import { StoryService } from "../../services/StoryService";
import "../../styles/TaskModal.css";

export const EditStoryModal: React.FC<{
  story: Story;
  onClose: () => void;
  onEdit: (story: Story) => void;
}> = ({ story, onClose, onEdit }) => {
  const [name, setName] = useState(story.name);
  const [description, setDescription] = useState(story.description || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(story.priority);
  const [status, setStatus] = useState<"todo" | "doing" | "done">(story.status);
  const [ownerId, setOwnerId] = useState<number>(story.ownerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onEdit({
      ...story,
      name,
      description,
      priority,
      status,
      ownerId,
    });
    onClose();
  };

  return (
    <div className="taskmodal-backdrop">
      <form
        onSubmit={handleSubmit}
        className="taskmodal-form"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="taskmodal-close-btn"
        >
          ×
        </button>
        <div className="taskmodal-title">Edit Story</div>
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="taskmodal-input"
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="taskmodal-input"
        />
        <input
          placeholder="Owner ID"
          type="number"
          value={ownerId}
          onChange={(e) => setOwnerId(Number(e.target.value))}
          className="taskmodal-input"
        />
        <div className="taskmodal-row">
          <label>
            Priority:&nbsp;
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="taskmodal-select"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
          <label>
            Status:&nbsp;
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="taskmodal-select"
            >
              <option value="todo">todo</option>
              <option value="doing">doing</option>
              <option value="done">done</option>
            </select>
          </label>
        </div>
        <button type="submit" className="taskmodal-submit-btn">
          Save
        </button>
      </form>
    </div>
  );
};

export function handleEditStory(
  updatedStory: Story,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  StoryService.saveStory(updatedStory);
  setHistory((prev) => [...prev, `Story #${updatedStory.id} updated!`]);
}