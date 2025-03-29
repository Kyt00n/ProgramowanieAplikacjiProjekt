import { LOCAL_STORAGE_KEYS } from "../consts/localStorageConsts";
import { Project } from "../entities/Project";

export class ProjectService{
    static saveProject(project: Project): void{
        const projects = this.getAllProjects();
        const existingIndex = projects.findIndex(p => p.id === project.id);

        if (existingIndex !== -1) {
            projects[existingIndex] = project; 
        } else {
            projects.push(project); 
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    }
    static getAllProjects(): Project[] {
        const projectsJson = localStorage.getItem(LOCAL_STORAGE_KEYS.PROJECTS);
        return projectsJson ? JSON.parse(projectsJson) : [];
    }
    static getProjectById(id: number): Project | undefined {
        const projects = this.getAllProjects();
        return projects.find(project => project.id === id);
    }
    static deleteProject(id: number): void {
        const projects = this.getAllProjects();
        const updatedProjects = projects.filter(project => project.id !== id);
        localStorage.setItem(LOCAL_STORAGE_KEYS.PROJECTS, JSON.stringify(updatedProjects));
        const selectedProjectId = this.getSelectedProjectId();
        if (selectedProjectId === id) {
            this.clearSelectedProject();
        }
    }
    static selectProject(id: number): void {
        const project = this.getProjectById(id);
        if (!project) {
            throw new Error(`Project with ID ${id} does not exist.`);
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_PROJECT_ID, id.toString());
    }

    static getSelectedProject(): Project | null {
        const selectedProjectId = this.getSelectedProjectId();
        if (selectedProjectId === null) {
            return null;
        }
        return this.getProjectById(selectedProjectId) || null;
    }

    private static getSelectedProjectId(): number | null {
        const selectedProjectId = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_PROJECT_ID);
        return selectedProjectId ? parseInt(selectedProjectId, 10) : null;
    }

    static clearSelectedProject(): void {
        localStorage.removeItem(LOCAL_STORAGE_KEYS.SELECTED_PROJECT_ID);
    }
}