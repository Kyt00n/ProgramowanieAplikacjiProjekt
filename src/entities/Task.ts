import { User } from "./User";

export class Task{
    public user?: User;
    public dateStart?: Date;
    public dateEnd?: Date;
    public estimatedTime?: number;

    constructor(
      public id: number,
      public name: string,
      public description: string,
      public priority: 'low' | 'medium' | 'high',
      public status: 'todo' | 'doing' | 'done',
      public dateOfCreation: Date,
    ){}
}