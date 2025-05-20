import { connectToDatabase } from "../../db";
import { UserPrompt } from "../../../models/userPrompt.model";

export interface CreateUserPromptParams {
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

export interface UserPromptResult {
  id: string;
  userId: string;
  template: string;
  placeholders: string[];
  nivel: string;
  etapa: string;
  categoría: string;
  instrucciones: string;
  notas_para_el_uso: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function saveUserPrompt(
  promptData: CreateUserPromptParams
): Promise<UserPromptResult> {
  try {
    await connectToDatabase();

    const newPrompt = await UserPrompt.create(promptData);
    
    return {
      id: newPrompt._id.toString(),
      userId: newPrompt.userId,
      template: newPrompt.template,
      placeholders: newPrompt.placeholders,
      nivel: newPrompt.nivel,
      etapa: newPrompt.etapa,
      categoría: newPrompt.categoría,
      instrucciones: newPrompt.instrucciones,
      notas_para_el_uso: newPrompt.notas_para_el_uso,
      title: newPrompt.title,
      createdAt: newPrompt.createdAt,
      updatedAt: newPrompt.updatedAt,
    };
  } catch (error) {
    console.error("Error saving user prompt:", error);
    throw error;
  }
}

export async function getUserPromptsByUserId(
  userId: string
): Promise<UserPromptResult[]> {
  try {
    await connectToDatabase();

    const prompts = await UserPrompt.find({ userId }).sort({ createdAt: -1 });

    return prompts.map((prompt) => ({
      id: prompt._id.toString(),
      userId: prompt.userId,
      template: prompt.template,
      placeholders: prompt.placeholders,
      nivel: prompt.nivel,
      etapa: prompt.etapa,
      categoría: prompt.categoría,
      instrucciones: prompt.instrucciones,
      notas_para_el_uso: prompt.notas_para_el_uso,
      title: prompt.title,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching user prompts:", error);
    throw error;
  }
}

export async function getUserPromptById(
  id: string
): Promise<UserPromptResult | null> {
  try {
    await connectToDatabase();

    const prompt = await UserPrompt.findById(id);

    if (!prompt) return null;

    return {
      id: prompt._id.toString(),
      userId: prompt.userId,
      template: prompt.template,
      placeholders: prompt.placeholders,
      nivel: prompt.nivel,
      etapa: prompt.etapa,
      categoría: prompt.categoría,
      instrucciones: prompt.instrucciones,
      notas_para_el_uso: prompt.notas_para_el_uso,
      title: prompt.title,
      createdAt: prompt.createdAt,
      updatedAt: prompt.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching user prompt by ID:", error);
    throw error;
  }
}

export async function updateUserPrompt(
  id: string,
  userId: string,
  updateData: Partial<CreateUserPromptParams>
): Promise<UserPromptResult | null> {
  try {
    await connectToDatabase();

    const updatedPrompt = await UserPrompt.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true }
    );

    if (!updatedPrompt) return null;

    return {
      id: updatedPrompt._id.toString(),
      userId: updatedPrompt.userId,
      template: updatedPrompt.template,
      placeholders: updatedPrompt.placeholders,
      nivel: updatedPrompt.nivel,
      etapa: updatedPrompt.etapa,
      categoría: updatedPrompt.categoría,
      instrucciones: updatedPrompt.instrucciones,
      notas_para_el_uso: updatedPrompt.notas_para_el_uso,
      title: updatedPrompt.title,
      createdAt: updatedPrompt.createdAt,
      updatedAt: updatedPrompt.updatedAt,
    };
  } catch (error) {
    console.error("Error updating user prompt:", error);
    throw error;
  }
}

export async function deleteUserPrompt(
  id: string,
  userId: string
): Promise<boolean> {
  try {
    await connectToDatabase();

    const result = await UserPrompt.deleteOne({ _id: id, userId });

    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting user prompt:", error);
    throw error;
  }
}
