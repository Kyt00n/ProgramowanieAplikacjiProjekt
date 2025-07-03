import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  id: number;
  name: string;
  description: string;
  storyId: number;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'doing' | 'done';
  dateOfCreation: Date;
  userId?: number;
  dateStart?: Date;
  dateEnd?: Date;
  estimatedTime?: number;
}

const TaskSchema = new Schema<ITask>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  storyId: { type: Number, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  status: { type: String, enum: ['todo', 'doing', 'done'], required: true },
  dateOfCreation: { type: Date, required: true },
  userId: { type: Number },
  dateStart: { type: Date },
  dateEnd: { type: Date },
  estimatedTime: { type: Number }
});

export const TaskModel = mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);