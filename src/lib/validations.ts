import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.string().email("Ingresá un email válido"),
    phone: z.string().min(6, "Ingresá un teléfono válido").optional().or(z.literal("")),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  phone: z.string().optional().or(z.literal("")),
});

export const addressSchema = z.object({
  street: z.string().min(3, "Ingresá una dirección válida"),
  city: z.string().min(2, "Ingresá una ciudad válida"),
  province: z.string().min(2, "Ingresá una provincia válida"),
  zip: z.string().min(3, "Ingresá un código postal válido"),
  phone: z.string().min(6, "Ingresá un teléfono válido"),
  isDefault: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  offerPrice: z.coerce.number().positive().optional().nullable(),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  sku: z.string().min(2, "El SKU es obligatorio"),
  images: z.array(z.string()).min(1, "Agregá al menos una imagen"),
  brand: z.string().min(1, "La marca es obligatoria"),
  weight: z.string().optional(),
  categoryId: z.string().min(1, "Seleccioná una categoría"),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio"),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const checkoutSchema = z.object({
  addressId: z.string().min(1, "Seleccioná una dirección de envío").optional(),
  street: z.string().min(3).optional(),
  city: z.string().min(2).optional(),
  province: z.string().min(2).optional(),
  zip: z.string().min(3).optional(),
  phone: z.string().min(6).optional(),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
