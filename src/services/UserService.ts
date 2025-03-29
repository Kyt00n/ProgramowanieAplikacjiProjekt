import { User } from "../entities/User";

export class UserService {
    private static loggedInUser: User | null = null;
    private static users: User[] = [
        new User(1, "John", "Kowalski", "developer"),
        new User(2, "Anna", "Nowak", "devops"),
        new User(3, "Piotr", "Zielinski", "admin"),
        new User(4, "Maria", "Wiśniewska", "developer"),
    ];
    static mockLoggedInUser(): void {
        this.loggedInUser = new User(1, "John", "Kowalski", "developer");
    }
    static getLoggedInUser(): User | null {
        return this.loggedInUser;
    }
    static clearLoggedInUser(): void {
        this.loggedInUser = null;
    }
}