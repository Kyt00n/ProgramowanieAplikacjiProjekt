import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  id: number;
  name: string;
  description: string;
}

const ProjectSchema = new Schema<IProject>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
});

export const ProjectModel = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);