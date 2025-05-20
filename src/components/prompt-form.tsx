import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, levels, stages } from "@/constants/prompts";
import { Prompt } from "@/types/prompts";
import { createUserPrompt, updateUserPrompt } from "@/lib/services/client/userPrompt.service";
import { toast } from "@/hooks/use-toast";

interface PromptFormProps {
  prompt?: Prompt;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PromptForm({ prompt, onSuccess, onCancel }: PromptFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    template: "",
    placeholders: "",
    nivel: "",
    etapa: "",
    categoría: "",
    instrucciones: "",
    notas_para_el_uso: "",
  });

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title || "",
        template: prompt.template,
        placeholders: prompt.placeholders.join(", "),
        nivel: prompt.nivel,
        etapa: prompt.etapa,
        categoría: prompt.categoría,
        instrucciones: prompt.instrucciones,
        notas_para_el_uso: prompt.notas_para_el_uso,
      });
    }
  }, [prompt]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const placeholdersArray = formData.placeholders
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);

      const promptData = {
        title: formData.title,
        template: formData.template,
        placeholders: placeholdersArray,
        nivel: formData.nivel,
        etapa: formData.etapa,
        categoría: formData.categoría,
        instrucciones: formData.instrucciones,
        notas_para_el_uso: formData.notas_para_el_uso,
      };

      if (prompt && typeof prompt.id === "string") {
        // Actualizar prompt existente
        await updateUserPrompt(prompt.id, promptData);
        toast({
          title: "Prompt actualizado",
          description: "Tu prompt ha sido actualizado correctamente.",
        });
      } else {
        // Crear nuevo prompt
        await createUserPrompt(promptData);
        toast({
          title: "Prompt creado",
          description: "Tu prompt ha sido creado correctamente.",
        });
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving prompt:", error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar el prompt. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <section className="max-h-[60vh] overflow-y-auto px-2">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título descriptivo para tu prompt"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template">Plantilla</Label>
        <Textarea
          id="template"
          name="template"
          value={formData.template}
          onChange={handleChange}
          placeholder="Escribe aquí tu plantilla de prompt..."
          rows={5}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholders">Placeholders (separados por comas)</Label>
        <Input
          id="placeholders"
          name="placeholders"
          value={formData.placeholders}
          onChange={handleChange}
          placeholder="placeholder1, placeholder2, placeholder3"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nivel">Nivel</Label>
          <Select
            value={formData.nivel}
            onValueChange={(value) => handleSelectChange("nivel", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un nivel" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="etapa">Etapa</Label>
          <Select
            value={formData.etapa}
            onValueChange={(value) => handleSelectChange("etapa", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una etapa" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoría">Categoría</Label>
          <Select
            value={formData.categoría}
            onValueChange={(value) => handleSelectChange("categoría", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="instrucciones">Instrucciones</Label>
        <Textarea
          id="instrucciones"
          name="instrucciones"
          value={formData.instrucciones}
          onChange={handleChange}
          placeholder="Instrucciones para usar el prompt..."
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notas_para_el_uso">Notas para el uso</Label>
        <Textarea
          id="notas_para_el_uso"
          name="notas_para_el_uso"
          value={formData.notas_para_el_uso}
          onChange={handleChange}
          placeholder="Notas adicionales para el uso del prompt..."
          rows={3}
          required
        />
      </div>
      </section>
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit"  disabled={isSubmitting}>
          {isSubmitting
            ? "Guardando..."
            : prompt
            ? "Actualizar Prompt"
            : "Crear Prompt"}
        </Button>
      </div>
    </form>
  );
}
