import mongoose, { Schema, Document } from "mongoose";

export interface IStory extends Document {
  id: number;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  projectId: number;
  status: 'todo' | 'doing' | 'done';
  ownerId: number;
  dateOfCreation: Date;
}

const StorySchema = new Schema<IStory>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  projectId: { type: Number, required: true },
  status: { type: String, enum: ['todo', 'doing', 'done'], required: true },
  ownerId: { type: Number, required: true },
  dateOfCreation: { type: Date, required: true }
});

export const StoryModel = mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);

