export class User{
    constructor(
        public id: number,
        public name: string,
        public surname: string,
        public role: 'admin' | 'devops' | 'developer',
    ){}
}