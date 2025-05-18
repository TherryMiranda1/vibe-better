// Types for the prompts feature

export type Prompt = {
  id: number;
  template: string;
  placeholders: string[];
  nivel: string;
  etapa: string;
  categoría: string;
  instrucciones: string;
  notas_para_el_uso: string;
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
