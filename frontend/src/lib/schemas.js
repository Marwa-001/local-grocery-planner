import { z } from "zod";

// Backend ids are Postgres SERIAL integers, not UUIDs.
const id = z.union([z.string(), z.number()]);

export const categorySchema = z.object({
  id: id.optional(),
  name: z.string().min(1, "Name is required").max(30),
});

export const productSchema = z.object({
  id: id.optional(),
  name: z.string().min(1, "Product name is required").max(60),
  price: z.number().nonnegative().optional(),
  categoryId: id.nullable().optional(),
  isFavourite: z.boolean().default(false),
});

export const listItemSchema = z.object({
  id: id,
  productId: id,
  isPurchased: z.boolean().default(false),
  quantity: z.number().default(1),
  price: z.number().optional(),
});

export const shoppingListSchema = z.object({
  id: id,
  name: z.string().min(1, "List name is required").max(50),
  items: z.array(listItemSchema),
});

export const favouriteSchema = z.object({
  productId: id,
});
