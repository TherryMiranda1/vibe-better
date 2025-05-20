import mongoose, { Schema, Document } from "mongoose";

export interface IUserPrompt extends Document {
  userId: string;
  template: string;
  placeholders: string[];
  nivel: string;
  etapa: string;
  categoría: string;
  instrucciones: string;
  notas_para_el_uso: string;
  title: string;
}

const UserPromptSchema = new Schema<IUserPrompt>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    template: {
      type: String,
      required: true,
    },
    placeholders: [{
      type: String,
    }],
    nivel: {
      type: String,
      required: true,
    },
    etapa: {
      type: String,
      required: true,
    },
    categoría: {
      type: String,
      required: true,
    },
    instrucciones: {
      type: String,
      required: true,
    },
    notas_para_el_uso: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const UserPrompt = mongoose.models.UserPrompt || mongoose.model<IUserPrompt>("UserPrompt", UserPromptSchema);
