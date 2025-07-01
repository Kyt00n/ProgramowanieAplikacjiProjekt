import React, { useState } from "react";
import { Story } from "../../entities/Story";
import { StoryService } from "../../services/StoryService";
import "../../styles/TaskModal.css";

export const AddStoryModal: React.FC<{
  onClose: () => void;
  onAdd: (story: Omit<Story, "id" | "dateOfCreation">) => void;
}> = ({ onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");
  const [ownerId, setOwnerId] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      description,
      priority,
      projectId: StoryService["getSelectedProjectId"]?.() ?? 0,
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
        <div className="taskmodal-title">Add Story</div>
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
          Add
        </button>
      </form>
    </div>
  );
};

export function handleAddStory(
  story: Omit<Story, "id" | "dateOfCreation">,
  setHistory: React.Dispatch<React.SetStateAction<string[]>>
) {
  const stories = StoryService.getStoriesForSelectedProject();
  const newId = stories.length > 0 ? Math.max(...stories.map((s) => s.id)) + 1 : 1;
  const newStory: Story = {
    ...story,
    id: newId,
    dateOfCreation: new Date(),
  };
  StoryService.saveStory(newStory);
  setHistory((prev) => [...prev, "Story added!"]);
}