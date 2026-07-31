"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { categorySchema, type CategoryInput } from "@/lib/validations";
import { createCategory, updateCategory, deleteCategory } from "@/actions/admin-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Category = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  productsCount: number;
};

function CategoryFormDialog({
  category,
  onSaved,
}: {
  category?: Category;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? { name: category.name, description: category.description ?? "", image: category.image ?? "" }
      : {},
  });

  async function onSubmit(data: CategoryInput) {
    setLoading(true);
    const result = category
      ? await updateCategory(category.id, data)
      : await createCategory(data);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    setOpen(false);
    reset();
    onSaved();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          category ? (
            <Button variant="ghost" size="icon-sm" />
          ) : (
            <Button className="rounded-full" />
          )
        }
      >
        {category ? <Pencil className="size-4" /> : (
          <>
            <Plus className="size-4" /> Nueva categoría
          </>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{category ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" {...register("name")} />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register("description")} />
          </div>
          <div>
            <Label htmlFor="image">Imagen (URL)</Label>
            <Input id="image" {...register("image")} />
          </div>
          <Button type="submit" className="mt-2 rounded-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta categoría?")) return;
    const result = await deleteCategory(id);
    if (!result.ok) {
      toast.error(result.message ?? "No se pudo eliminar");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <CategoryFormDialog onSaved={() => router.refresh()} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">
                  {category.productsCount} productos
                </p>
              </div>
              <div className="flex gap-1">
                <CategoryFormDialog category={category} onSaved={() => router.refresh()} />
                <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(category.id)}>
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
            {category.description && (
              <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
