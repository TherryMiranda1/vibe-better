// Types for the prompts feature

export type Prompt = {
  id: number | string; // Puede ser un número para prompts predefinidos o un string (MongoDB ID) para prompts de usuario
  template: string;
  placeholders: string[];
  nivel: string;
  etapa: string;
  categoría: string;
  instrucciones: string;
  notas_para_el_uso: string;
  userId?: string; // ID del usuario si es un prompt personalizado
  title?: string; // Título opcional para prompts personalizados
  createdAt?: Date; // Fecha de creación para prompts personalizados
  updatedAt?: Date; // Fecha de actualización para prompts personalizados
};

export type FilterState = {
  searchTerm: string;
  category: string | null;
  level: string | null;
  stage: string | null;
  sortBy: "id" | "nivel";
  sortDirection: "asc" | "desc";
};

export type PromptDetailViewProps = {
  prompt: Prompt;
  isOpen: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
};
