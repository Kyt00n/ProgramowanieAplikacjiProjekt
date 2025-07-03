import { Task } from "../entities/Task";

export class TaskService {
    static async getAllTasks(): Promise<Task[]> {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/tasks", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return await res.json();
    }

    static async getTaskById(id: number): Promise<Task> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/tasks/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch task");
        return await res.json();
    }

    static async saveTask(task: Omit<Task, "id">): Promise<Task> {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(task)
        });
        if (!res.ok) throw new Error("Failed to save task");
        return await res.json();
    }

    static async updateTask(task: Task): Promise<Task> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(task)
        });
        if (!res.ok) throw new Error("Failed to update task");
        return await res.json();
    }

    static async deleteTask(id: number): Promise<void> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to delete task");
    }

    static async getTasksByStoryId(storyId: number): Promise<Task[]> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/tasks?storyId=${storyId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch tasks by story");
        return await res.json();
    }

    static async assignTaskToUser(taskId: number, userId: number): Promise<Task> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/tasks/${taskId}/assign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ userId })
        });
        if (!res.ok) throw new Error("Failed to assign task");
        return await res.json();
    }
}