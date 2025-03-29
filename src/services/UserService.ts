import { User } from "../entities/User";

export class UserService {
    private static storageKey = 'users';
    private static loggedInUser: User | null = null;
    static mockLoggedInUser(): void {
        this.loggedInUser = new User(1, "John", "Kowalski");
    }
    static getLoggedInUser(): User | null {
        return this.loggedInUser;
    }
    static clearLoggedInUser(): void {
        this.loggedInUser = null;
    }
}