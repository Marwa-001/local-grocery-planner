import { z } from "zod";

const id = z.string().uuid();
const userId = z.string().default("local-user");

export const categorySchema = z.object({
  id: id,
  userId: userId,
  name: z.string().min(1, "Name is required").max(30),
});

export const productSchema = z.object({
  id: id,
  userId: userId,
  name: z.string().min(1, "Product name is required").max(60),
  price: z.number().nonnegative().optional(),
  categoryId: id.nullable(),
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
  userId: userId,
  name: z.string().min(1, "List name is required").max(50),
  items: z.array(listItemSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const favouriteSchema = z.object({
  userId: z.string(),
  productId: z.string().uuid(),
});