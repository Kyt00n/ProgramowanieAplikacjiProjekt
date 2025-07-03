export class User{
    constructor(
        public id: number,
        public login: string,
        public name: string,
        public surname: string,
        public role: 'admin' | 'devops' | 'developer',
    ){}
}