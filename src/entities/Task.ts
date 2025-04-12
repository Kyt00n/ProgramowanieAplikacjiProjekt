export class Task{
    public userId?: number;
    public dateStart?: Date;
    public dateEnd?: Date;
    public estimatedTime?: number;

    constructor(
      public id: number,
      public name: string,
      public description: string,
      public storyId: number,
      public priority: 'low' | 'medium' | 'high',
      public status: 'todo' | 'doing' | 'done',
      public dateOfCreation: Date,
    ){}
}