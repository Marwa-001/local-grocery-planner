const { z } = require('zod');

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  categoryId: z.number().int().positive().nullable().optional(),
});

const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };