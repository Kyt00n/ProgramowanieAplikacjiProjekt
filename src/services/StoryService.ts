import { LOCAL_STORAGE_KEYS } from "../consts/localStorageConsts";
import { Story } from "../entities/Story";

export class StoryService {
    static saveStory(story: Story): void {
        const projectId = this.getSelectedProjectId();
        if (projectId === null) {
            throw new Error("No project is currently selected.");
        }

        const storiesByProject = this.getAllStories();
        if (!storiesByProject[projectId]) {
            storiesByProject[projectId] = [];
        }

        const existingIndex = storiesByProject[projectId].findIndex(s => s.id === story.id);
        if (existingIndex !== -1) {
            storiesByProject[projectId][existingIndex] = story; // Update existing story
        } else {
            storiesByProject[projectId].push(story); // Add new story
        }

        localStorage.setItem(LOCAL_STORAGE_KEYS.STORIES, JSON.stringify(storiesByProject));
    }
    private static getSelectedProjectId(): number | null {
        const selectedProjectId = localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_PROJECT_ID);
        return selectedProjectId ? parseInt(selectedProjectId, 10) : null;
    }

    static getAllStories(): { [projectId: number]: Story[] } {
        const storiesJson = localStorage.getItem(LOCAL_STORAGE_KEYS.STORIES);
        return storiesJson ? JSON.parse(storiesJson) : {};
    }
    static getStoriesForSelectedProject(): Story[] {
        const projectId = this.getSelectedProjectId();
        if (projectId === null) {
            throw new Error("No project is currently selected.");
        }

        const storiesByProject = this.getAllStories();
        return storiesByProject[projectId] || [];
    }

    // Get a single story by ID for the currently selected project
    static getStoryById(storyId: number): Story | undefined {
        const stories = this.getStoriesForSelectedProject();
        return stories.find(story => story.id === storyId);
    }

    // Delete a story by ID for the currently selected project
    static deleteStory(storyId: number): void {
        const projectId = this.getSelectedProjectId();
        if (projectId === null) {
            throw new Error("No project is currently selected.");
        }
        const storiesByProject = this.getAllStories();
        if (!storiesByProject[projectId]) {
            return;
        }

        storiesByProject[projectId] = storiesByProject[projectId].filter(story => story.id !== storyId);

        // If no stories remain for the project, remove the project key
        if (storiesByProject[projectId].length === 0) {
            delete storiesByProject[projectId];
        }

        localStorage.setItem(LOCAL_STORAGE_KEYS.STORIES, JSON.stringify(storiesByProject));
    }
}