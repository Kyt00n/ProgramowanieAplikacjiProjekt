import { LOCAL_STORAGE_KEYS } from "../consts/localStorageConsts";
import { Task } from "../entities/Task";

export class TaskService {
    private static storageKey = LOCAL_STORAGE_KEYS.TASKS;

    // Create or Update a Task
    static saveTask(task: Task): void {
        const tasks = this.getAllTasks();
        const existingIndex = tasks.findIndex(t => t.id === task.id);

        if (existingIndex !== -1) {
            tasks[existingIndex] = task; // Update existing task
        } else {
            tasks.push(task); // Add new task
        }

        localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }

    // Get all Tasks
    static getAllTasks(): Task[] {
        const tasksJson = localStorage.getItem(this.storageKey);
        return tasksJson ? JSON.parse(tasksJson) : [];
    }

    // Get a single Task by ID
    static getTaskById(id: number): Task | undefined {
        const tasks = this.getAllTasks();
        return tasks.find(task => task.id === id);
    }

    // Delete a Task by ID
    static deleteTask(id: number): void {
        const tasks = this.getAllTasks();
        const updatedTasks = tasks.filter(task => task.id !== id);
        localStorage.setItem(this.storageKey, JSON.stringify(updatedTasks));
    }
}