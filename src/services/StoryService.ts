import { LOCAL_STORAGE_KEYS } from "../consts/localStorageConsts";
import { Story } from "../entities/Story";

export class StoryService {
    static async getAllStories(): Promise<Story[]> {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/stories", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch stories");
        return await res.json();
    }

    static async getStoryById(id: number): Promise<Story> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/stories/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch story");
        return await res.json();
    }

    static async saveStory(story: Omit<Story, "id">): Promise<Story> {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/stories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(story)
        });
        if (!res.ok) throw new Error("Failed to save story");
        return await res.json();
    }

    static async editStory(story: Story): Promise<Story> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/stories/${story.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(story)
        });
        if (!res.ok) throw new Error("Failed to edit story");
        return await res.json();
    }

    static async deleteStory(id: number): Promise<void> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/stories/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to delete story");
    }
}