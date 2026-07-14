const { z } = require('zod');

const addItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().positive().optional(),
  isPurchased: z.boolean().optional(),
});

module.exports = { addItemSchema, updateItemSchema };