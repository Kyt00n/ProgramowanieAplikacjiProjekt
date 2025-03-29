import { Project } from "../entities/Project";

export class ProjectService{
    private static storageKey = 'projects';

    static saveProject(project: Project): void{
        const projects = this.getAllProjects();
        const existingIndex = projects.findIndex(p => p.id === project.id);

        if (existingIndex !== -1) {
            projects[existingIndex] = project; 
        } else {
            projects.push(project); 
        }
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
    }
    static getAllProjects(): Project[] {
        const projectsJson = localStorage.getItem(this.storageKey);
        return projectsJson ? JSON.parse(projectsJson) : [];
    }
    static getProjectById(id: number): Project | undefined {
        const projects = this.getAllProjects();
        return projects.find(project => project.id === id);
    }
    static deleteProject(id: number): void {
        const projects = this.getAllProjects();
        const updatedProjects = projects.filter(project => project.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(updatedProjects));
    }
}