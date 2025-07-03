import { LOCAL_STORAGE_KEYS } from "../consts/localStorageConsts";
import { Project } from "../entities/Project";

export class ProjectService {
    static async getAllProjects(): Promise<Project[]> {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/projects", {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        return await res.json();
    }
    static async getProjectById(id: number): Promise<Project> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/projects/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch project");
        return await res.json();
    }

    static async saveProject(project: Omit<Project, "id">): Promise<Project> {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(project)
        });
        if (!res.ok) throw new Error("Failed to save project");
        return await res.json();
    }

    static async editProject(project: Project): Promise<Project> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/projects/${project.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(project)
        });
        if (!res.ok) throw new Error("Failed to edit project");
        return await res.json();
    }

    static async deleteProject(id: number): Promise<void> {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/projects/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to delete project");
    }
    static selectProject(id: number) {
        localStorage.setItem("selectedProjectId", id.toString());
    }

    static getSelectedProjectId(): number | null {
        const value = localStorage.getItem("selectedProjectId");
        return value ? Number(value) : null;
    }
}