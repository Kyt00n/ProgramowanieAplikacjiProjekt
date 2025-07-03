import { User } from "../entities/User";

export class UserService {
    private static loggedInUser: User | null = null;

    static setLoggedInUser(user: User) {
        this.loggedInUser = user;
    }
    static getLoggedInUser(): User | null {
        return this.loggedInUser;
    }
    static clearLoggedInUser(): void {
        this.loggedInUser = null;
    }
}