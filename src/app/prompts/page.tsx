"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  categories,
  levels,
  prompts as predefinedPrompts,
  stages,
} from "@/constants/prompts";
import { getUserPrompts } from "@/lib/services/client/userPrompt.service";
import { Search, Copy, Tag } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PromptDetailView } from "@/components/prompt-detail-view";
import { Prompt, FilterState } from "@/types/prompts";
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/seo/PageHeader";
import { UserPromptsSection } from "@/components/user-prompts-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const PromptsPage = () => {
  const { user } = useUser();
  // State for filters and sorting
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: "",
    category: null,
    level: null,
    stage: null,
    sortBy: "id",
    sortDirection: "asc",
  });

  // State for prompt detail modal
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Helper functions to map string values to enum values
  const mapToCategory = useCallback((value: string): string => {
    return value;
  }, []);

  const mapToLevel = useCallback((value: string): string => {
    return value;
  }, []);

  const mapToStage = useCallback((value: string): string => {
    return value;
  }, []);

  // Memoized level order for sorting
  const levelOrder = useMemo(
    () => ({
      ["Principiante"]: 1,
      ["Intermedio"]: 2,
      ["Avanzado"]: 3,
    }),
    []
  );

  // Memoize prompt metadata for faster filtering
  const promptsWithMetadata = useMemo(() => {
    return predefinedPrompts.map((prompt) => {
      // Pre-process the metadata for each prompt to avoid repeated splitting during filtering
      const categoryValues = prompt.categoría.split(" | ").map(mapToCategory);
      const levelValues = prompt.nivel.split(" | ").map(mapToLevel);
      const stageValues = prompt.etapa.split(" | ").map(mapToStage);
      const searchableText = [
        prompt.template.toLowerCase(),
        prompt.instrucciones.toLowerCase(),
        prompt.notas_para_el_uso.toLowerCase(),
      ];

      // Pre-calculate first level for sorting
      const firstLevelValue =
        levelOrder[
          mapToLevel(prompt.nivel.split(" | ")[0]) as keyof typeof levelOrder
        ] || 999;

      return {
        prompt,
        categoryValues,
        levelValues,
        stageValues,
        searchableText,
        firstLevelValue,
      };
    });
  }, [mapToCategory, mapToLevel, mapToStage, levelOrder]);

  // Filter and sort prompts with optimized logic
  const filteredPrompts = useMemo(() => {
    const { searchTerm, category, level, stage, sortBy, sortDirection } =
      filterState;
    const searchTermLower = searchTerm.toLowerCase();

    const filtered = promptsWithMetadata.filter(
      ({
        prompt,
        categoryValues,
        levelValues,
        stageValues,
        searchableText,
      }) => {
        // Search term matching - using pre-processed searchable text
        const matchesSearch =
          !searchTerm ||
          searchableText.some((text) => text.includes(searchTermLower));

        // Category matching - using pre-processed category values
        const matchesCategory =
          !category ||
          category === "Todos" ||
          categoryValues.includes(category);

        // Level matching - using pre-processed level values
        const matchesLevel =
          !level || level === "Todos" || levelValues.includes(level);

        // Stage matching - using pre-processed stage values
        const matchesStage =
          !stage || stage === "Todos" || stageValues.includes(stage);

        return matchesSearch && matchesCategory && matchesLevel && matchesStage;
      }
    );

    // Sort with optimized logic using pre-calculated values
    return filtered
      .sort((a, b) => {
        if (sortBy === "id") {
          return sortDirection === "asc"
            ? Number(a.prompt.id) - Number(b.prompt.id)
            : Number(b.prompt.id) - Number(a.prompt.id);
        } else {
          // Use pre-calculated level values for sorting
          return sortDirection === "asc"
            ? a.firstLevelValue - b.firstLevelValue
            : b.firstLevelValue - a.firstLevelValue;
        }
      })
      .map((item) => item.prompt);
  }, [filterState, promptsWithMetadata]);

  // Handle copying prompt to clipboard
  const copyPromptToClipboard = useCallback((promptText: string) => {
    navigator.clipboard.writeText(promptText);
  }, []);

  // Toggle sort direction
  const toggleSortDirection = useCallback(() => {
    setFilterState((prev) => ({
      ...prev,
      sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Change sort field
  const changeSortField = useCallback((field: "id" | "nivel") => {
    setFilterState((prev) => {
      if (prev.sortBy === field) {
        return {
          ...prev,
          sortDirection: prev.sortDirection === "asc" ? "desc" : "asc",
        };
      } else {
        return {
          ...prev,
          sortBy: field,
          sortDirection: "asc",
        };
      }
    });
  }, []);

  // Update search term
  const updateSearchTerm = useCallback((value: string) => {
    setFilterState((prev) => ({
      ...prev,
      searchTerm: value,
    }));
  }, []);

  // Update category filter
  const updateCategoryFilter = useCallback((value: string) => {
    setFilterState((prev) => ({
      ...prev,
      category: value === "Todos" ? null : value,
    }));
  }, []);

  // Update level filter
  const updateLevelFilter = useCallback((value: string) => {
    setFilterState((prev) => ({
      ...prev,
      level: value === "Todos" ? null : value,
    }));
  }, []);

  // Update stage filter
  const updateStageFilter = useCallback((value: string) => {
    setFilterState((prev) => ({
      ...prev,
      stage: value === "Todos" ? null : value,
    }));
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilterState({
      searchTerm: "",
      category: null,
      level: null,
      stage: null,
      sortBy: "id",
      sortDirection: "asc",
    });
  }, []);

  // Handle opening prompt detail modal
  const openPromptDetail = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsDetailModalOpen(true);
  }, []);

  // Handle closing prompt detail modal
  const closePromptDetail = useCallback(() => {
    setIsDetailModalOpen(false);
  }, []);

  const { searchTerm, category, level, stage, sortBy, sortDirection } =
    filterState;

  return (
    <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Inicio", href: "/" },
          { label: "Prompts", href: "/prompts" },
        ]}
      />
      <PageHeader
        title="Prompts Collection"
        description="Explore our collection of predefined prompts and create your own personalized prompts."
      />

      <Tabs defaultValue="predefined">
        <SignedIn>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="predefined">Prompts Collection</TabsTrigger>
            <TabsTrigger value="user">My Prompts</TabsTrigger>
          </TabsList>
        </SignedIn>
        <SignedOut>
          <div className="flex justify-between align-center gap-4 mb-10 border bg-card p-4 rounded-xl max-w-xl mx-auto">
            <p className="text-xl font-semibold tracking-tight">
              Sign in to access your prompts
            </p>
            <SignInButton mode="modal" fallbackRedirectUrl="/prompts">
              <Button className="text-background font-semibold">Sign in</Button>
            </SignInButton>
          </div>
        </SignedOut>

        <TabsContent value="predefined" className="space-y-6">
          {/* Filters */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar prompts..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => updateSearchTerm(e.target.value)}
                />
              </div>

              <Select
                value={category ? category : "Todos"}
                onValueChange={updateCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"Todos"}>Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={level ? level : "Todos"}
                onValueChange={updateLevelFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"Todos"}>Todos los niveles</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={stage ? stage : "Todos"}
                onValueChange={updateStageFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Etapa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"Todos"}>Todas las etapas</SelectItem>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredPrompts.length} prompts encontrados
              </span>
              {(searchTerm ||
                category ||
                level ||
                stage ||
                sortBy !== "id" ||
                sortDirection !== "asc") && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => {
              const levelTags = prompt.nivel.split(" | ");
              const etapaTags = prompt.etapa.split(" | ");
              const categoryTags = prompt.categoría.split(" | ");
              const truncatedTemplate =
                prompt.template.substring(0, 60) + "...";

              return (
                <Card
                  key={prompt.id}
                  className="h-full flex flex-col hover:shadow-md transition-shadow duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">
                        ID: {prompt.id}
                      </Badge>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                copyPromptToClipboard(prompt.template)
                              }
                              className="h-8 w-8"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copiar prompt</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">
                      {truncatedTemplate}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {levelTags.map((level) => (
                        <Badge
                          key={level}
                          variant="secondary"
                          className="text-xs"
                        >
                          {level}
                        </Badge>
                      ))}
                      {etapaTags.map((etapa) => (
                        <Badge
                          key={etapa}
                          className="text-xs bg-primary/20 text-primary border-primary/20"
                        >
                          {etapa}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                      {prompt.notas_para_el_uso}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {categoryTags.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="text-xs"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openPromptDetail(prompt)}
                      className="w-full"
                    >
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <SignedIn>
          <TabsContent value="user">
            <UserPromptsSection
              onPromptSelect={openPromptDetail}
              onPromptCopy={copyPromptToClipboard}
            />
          </TabsContent>
        </SignedIn>
      </Tabs>

      {/* Prompt Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogTrigger asChild>
          <span className="hidden">Open</span>
        </DialogTrigger>
        {selectedPrompt && (
          <PromptDetailView
            prompt={selectedPrompt}
            isOpen={isDetailModalOpen}
            onClose={closePromptDetail}
            onCopy={copyPromptToClipboard}
          />
        )}
      </Dialog>
    </div>
  );
};

export default PromptsPage;
