"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import { productSchema, type ProductInput } from "@/lib/validations";
import { createProduct, updateProduct } from "@/actions/admin-products";
import { fileToDataUrl } from "@/lib/files";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = { id: string; name: string };

export function ProductForm({
  categories,
  productId,
  defaultValues,
}: {
  categories: Category[];
  productId?: string;
  defaultValues?: Partial<ProductInput>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(defaultValues?.images ?? []);
  const [manualUrl, setManualUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      featured: false,
      active: true,
      images: [],
      ...defaultValues,
    },
  });

  function addImages(urls: string[]) {
    setImages((current) => {
      const next = [...current, ...urls];
      setValue("images", next, { shouldValidate: true });
      return next;
    });
  }

  function addImage(url: string) {
    addImages([url]);
  }

  function removeImage(url: string) {
    setImages((current) => {
      const next = current.filter((i) => i !== url);
      setValue("images", next, { shouldValidate: true });
      return next;
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} no es una imagen`);
        return false;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error(`${file.name} pesa más de 4MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;
    const dataUrls = await Promise.all(validFiles.map(fileToDataUrl));
    addImages(dataUrls);
    toast.success(validFiles.length > 1 ? "Imágenes agregadas" : "Imagen agregada");
  }

  async function onSubmit(data: ProductInput) {
    setLoading(true);
    const payload = { ...data, images };
    const result = productId
      ? await updateProduct(productId, payload)
      : await createProduct(payload);
    setLoading(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.push("/admin/productos");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" rows={5} {...register("description")} />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Precio</Label>
            <Input id="price" type="number" step="0.01" {...register("price")} />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>
          <div>
            <Label htmlFor="offerPrice">Precio de oferta (opcional)</Label>
            <Input id="offerPrice" type="number" step="0.01" {...register("offerPrice")} />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input id="stock" type="number" {...register("stock")} />
            {errors.stock && <p className="text-sm text-destructive">{errors.stock.message}</p>}
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...register("sku")} />
            {errors.sku && <p className="text-sm text-destructive">{errors.sku.message}</p>}
          </div>
          <div>
            <Label htmlFor="brand">Marca</Label>
            <Input id="brand" {...register("brand")} />
            {errors.brand && <p className="text-sm text-destructive">{errors.brand.message}</p>}
          </div>
          <div>
            <Label htmlFor="weight">Peso / tamaño</Label>
            <Input id="weight" {...register("weight")} />
          </div>
        </div>

        <div>
          <Label>Categoría</Label>
          <Select
            items={Object.fromEntries(categories.map((cat) => [cat.id, cat.name]))}
            defaultValue={defaultValues?.categoryId}
            onValueChange={(v) => v && setValue("categoryId", v, { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccioná una categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId && (
            <p className="text-sm text-destructive">{errors.categoryId.message}</p>
          )}
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(v) => setValue("featured", !!v)}
            />
            <Label htmlFor="featured" className="font-normal">
              Destacado
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="active"
              checked={watch("active")}
              onCheckedChange={(v) => setValue("active", !!v)}
            />
            <Label htmlFor="active" className="font-normal">
              Activo
            </Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <Label className="mb-2 block">Imágenes</Label>
          <div className="mb-3 grid grid-cols-3 gap-2">
            {images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <div key={img} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img src={img} alt="" className="size-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <ImagePlus className="size-6 text-muted-foreground" />
            <span className="text-sm font-medium">Hacé clic o arrastrá imágenes acá</span>
            <span className="text-xs text-muted-foreground">PNG, JPG o WEBP. Hasta 4MB por imagen.</span>
          </button>

          <div className="mt-3 flex gap-2">
            <Input
              placeholder="O pegá una URL de imagen"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (manualUrl) {
                  addImage(manualUrl);
                  setManualUrl("");
                }
              }}
            >
              Agregar
            </Button>
          </div>
          {errors.images && <p className="mt-2 text-sm text-destructive">{errors.images.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full rounded-full" disabled={loading}>
          {loading ? "Guardando..." : productId ? "Guardar cambios" : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}
