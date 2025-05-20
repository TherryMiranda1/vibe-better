import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Edit, Trash2, Plus } from "lucide-react";
import { Prompt } from "@/types/prompts";
import { PromptForm } from "./prompt-form";
import {
  getUserPrompts,
  deleteUserPrompt,
} from "@/lib/services/client/userPrompt.service";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

interface UserPromptsSectionProps {
  onPromptSelect: (prompt: Prompt) => void;
  onPromptCopy: (text: string) => void;
}

export function UserPromptsSection({
  onPromptSelect,
  onPromptCopy,
}: UserPromptsSectionProps) {
  const { user } = useUser();
  const [userPrompts, setUserPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const fetchUserPrompts = async () => {
    setLoading(true);
    try {
      const prompts = await getUserPrompts();
      setUserPrompts(prompts);
      setError(null);
    } catch (err) {
      console.log("Error fetching user prompts:", err);
      setError("No se pudieron cargar tus prompts personalizados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserPrompts();
    }
  }, [user?.id]);

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    fetchUserPrompts();
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    fetchUserPrompts();
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsEditDialogOpen(true);
  };

  const handleDeletePrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePrompt = async () => {
    if (!selectedPrompt || typeof selectedPrompt.id !== "string") return;

    try {
      await deleteUserPrompt(selectedPrompt.id);
      toast({
        title: "Prompt eliminado",
        description: "Tu prompt ha sido eliminado correctamente.",
      });
      fetchUserPrompts();
    } catch (err) {
      console.log("Error deleting prompt:", err);
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el prompt. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading && userPrompts.length === 0) {
    return (
      <div className="text-center py-8">
        Loading your personalized prompts...
      </div>
    );
  }

  if (error && userPrompts.length === 0) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <h2 className="text-2xl font-bold">My Personalized Prompts</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 text-background ">
              <Plus size={16} />
              <span>Create Prompt</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Prompt</DialogTitle>
            </DialogHeader>
            <PromptForm
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {userPrompts.length === 0 ? (
        <div className="flex items-center justify-center p-4 text-center py-8 border rounded-lg bg-muted/20">
          <p className="mb-4">You don't have any personalized prompts yet.</p>
          <Button
            variant="outline"
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Create your first prompt</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userPrompts.map((prompt) => (
            <Card key={prompt.id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="flex justify-between items-start gap-2">
                  <span className="line-clamp-2">{prompt.title}</span>
                  <div className="flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPrompt(prompt)}
                          >
                            <Edit size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePrompt(prompt)}
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{prompt.nivel}</Badge>
                  <Badge variant="outline">{prompt.etapa}</Badge>
                  <Badge variant="outline">{prompt.categoría}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm line-clamp-3 mb-2">{prompt.template}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {prompt.notas_para_el_uso}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPromptSelect(prompt)}
                >
                  Usar
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPromptCopy(prompt.template)}
                      >
                        <Copy size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Prompt</DialogTitle>
          </DialogHeader>
          {selectedPrompt && (
            <PromptForm
              prompt={selectedPrompt}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The prompt will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePrompt}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
