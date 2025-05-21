"use client";

import { useState, useEffect } from "react";
import {
  getUserContexts,
  createUserContext,
  updateUserContext,
  deleteUserContext,
} from "@/lib/services/client/userContext.service";
import { UserContextResult } from "@/lib/services/server/userContext.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, ChevronDown, ChevronUp, X } from "lucide-react";
import { toast } from "sonner";

interface ContextSelectorProps {
  onContextsChange: (contexts: string) => void;
}

export default function ContextSelector({
  onContextsChange,
}: ContextSelectorProps) {
  const [contexts, setContexts] = useState<UserContextResult[]>([]);
  const [selectedContextIds, setSelectedContextIds] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newContextContent, setNewContextContent] = useState("");
  const [newContextCategory, setNewContextCategory] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingContext, setEditingContext] =
    useState<UserContextResult | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [contextToDelete, setContextToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadContexts();
  }, []);

  useEffect(() => {
    // Update the parent component with selected contexts
    const selectedContextsText = contexts
      .filter((context) => selectedContextIds.has(context.id))
      .map((context) => context.content)
      .join("\n\n");

    onContextsChange(selectedContextsText);
  }, [selectedContextIds, contexts, onContextsChange]);

  const loadContexts = async () => {
    try {
      setIsLoading(true);
      const data = await getUserContexts();
      setContexts(data);
    } catch (error) {
      console.error("Error loading contexts:", error);
      toast.error("Failed to load contexts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContext = async () => {
    if (!newContextContent.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      const slug = newContextContent
        .substring(0, 30)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+$/, "");

      const newContext = await createUserContext({
        content: newContextContent,
        slug,
        category: newContextCategory.trim() || undefined,
      });

      setContexts((prevContexts) => [...prevContexts, newContext]);
      setNewContextContent("");
      setNewContextCategory("");
      setIsAddDialogOpen(false);
      toast.success("Context created successfully");
    } catch (error) {
      console.error("Error creating context:", error);
      toast.error("Failed to create context");
    }
  };

  const handleUpdateContext = async () => {
    if (!editingContext || !editingContext.content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      const slug = editingContext.content
        .substring(0, 30)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+$/, "");

      const updatedContext = await updateUserContext(editingContext.id, {
        content: editingContext.content,
        slug,
        category: editingContext.category || undefined,
      });

      setContexts((prevContexts) =>
        prevContexts.map((context) =>
          context.id === updatedContext.id ? updatedContext : context
        )
      );
      setEditingContext(null);
      setIsEditDialogOpen(false);
      toast.success("Context updated successfully");
    } catch (error) {
      console.error("Error updating context:", error);
      toast.error("Failed to update context");
    }
  };

  const handleDeleteContext = async () => {
    if (!contextToDelete) return;

    try {
      await deleteUserContext(contextToDelete);

      // Remove from selected contexts if it was selected
      if (selectedContextIds.has(contextToDelete)) {
        const newSelectedContextIds = new Set(selectedContextIds);
        newSelectedContextIds.delete(contextToDelete);
        setSelectedContextIds(newSelectedContextIds);
      }

      setContexts((prevContexts) =>
        prevContexts.filter((context) => context.id !== contextToDelete)
      );
      setContextToDelete(null);
      setIsDeleteDialogOpen(false);
      toast.success("Context deleted successfully");
    } catch (error) {
      console.error("Error deleting context:", error);
      toast.error("Failed to delete context");
    }
  };

  const handleContextSelection = (contextId: string, isSelected: boolean) => {
    const newSelectedContextIds = new Set(selectedContextIds);

    if (isSelected) {
      newSelectedContextIds.add(contextId);
    } else {
      newSelectedContextIds.delete(contextId);
    }

    setSelectedContextIds(newSelectedContextIds);
  };

  const selectedContextsCount = selectedContextIds.size;

  return (
    <div className="flex flex-col mt-2 border-t border-primary/10 pt-2 px-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 mr-1" />
          ) : (
            <ChevronDown className="h-4 w-4 mr-1" />
          )}
          Contexts{" "}
          {selectedContextsCount > 0 && `(${selectedContextsCount} selected)`}
        </button>

        <div className="flex items-center space-x-2">
          {selectedContextsCount > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedContextIds(new Set())}
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" /> Clear
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs rounded-xl"
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Context</DialogTitle>
                <DialogDescription>
                  Create a new context to enhance your prompts with specific
                  information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 rounded-xl">
                <div className="space-y-2">
                  <Label htmlFor="new-content">Content</Label>
                  <Textarea
                    id="new-content"
                    placeholder="Enter your context content here..."
                    className="p-4 pt-5 rounded-xl bg-card border text-foreground"
                    rows={5}
                    value={newContextContent}
                    onChange={(e) => setNewContextContent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-category">Category (Optional)</Label>
                  <Input
                    id="new-category"
                    placeholder="E.g., Technical, Business, Personal"
                    value={newContextCategory}
                    onChange={(e) => setNewContextCategory(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="flex gap-2 justify-between">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddContext}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="h-4 w-32 bg-primary/10 animate-pulse rounded"></div>
            </div>
          ) : contexts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                No contexts available. Create your first context.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 flex flex-col">
              {contexts.map((context) => (
                <div
                  key={context.id}
                  className={`flex items-start p-2 rounded-xl border ${
                    selectedContextIds.has(context.id)
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <Checkbox
                    id={`context-${context.id}`}
                    checked={selectedContextIds.has(context.id)}
                    onCheckedChange={(checked) =>
                      handleContextSelection(context.id, checked === true)
                    }
                    className="mt-1 mr-2"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex">
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {context.content}
                        </p>
                        {context.category && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {context.category}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center ml-2">
                        <Dialog
                          open={
                            isEditDialogOpen &&
                            editingContext?.id === context.id
                          }
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setEditingContext(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => setEditingContext(context)}
                            >
                              <Edit className="h-3 w-3" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Context</DialogTitle>
                              <DialogDescription>
                                Update your context information.
                              </DialogDescription>
                            </DialogHeader>
                            {editingContext && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-content">Content</Label>
                                  <Textarea
                                    id="edit-content"
                                    rows={5}
                                    value={editingContext.content}
                                    className="p-4 pt-5 rounded-xl border bg-card text-foreground"
                                    onChange={(e) =>
                                      setEditingContext({
                                        ...editingContext,
                                        content: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-category">
                                    Category (Optional)
                                  </Label>
                                  <Input
                                    id="edit-category"
                                    value={editingContext.category || ""}
                                    onChange={(e) =>
                                      setEditingContext({
                                        ...editingContext,
                                        category: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsEditDialogOpen(false);
                                  setEditingContext(null);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button onClick={handleUpdateContext}>
                                Update
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog
                          open={
                            isDeleteDialogOpen && contextToDelete === context.id
                          }
                          onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (!open) setContextToDelete(null);
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => setContextToDelete(context.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your context.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => {
                                  setIsDeleteDialogOpen(false);
                                  setContextToDelete(null);
                                }}
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteContext}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
