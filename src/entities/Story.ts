export class Story{
    constructor(
      public id: number,
      public name: string,
      public description: string,
      public priority: 'low' | 'medium' | 'high',
      public projectId: number,
      public status: 'todo' | 'doing' | 'done',
      public ownerId: number,
      public dateOfCreation: Date
    ){}
}