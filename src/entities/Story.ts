import { Project } from "./Project";
import { User } from "./User";

export class Story{
    constructor(
      public id: number,
      public name: string,
      public description: string,
      public priority: 'low' | 'medium' | 'high',
      public project: Project,
      public status: 'todo' | 'doing' | 'done',
      public owner: User,
      public dateOfCreation: Date
    ){}
}