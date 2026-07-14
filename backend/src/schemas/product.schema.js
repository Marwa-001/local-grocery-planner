const { z } = require('zod');

const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  categoryId: z.number().int().positive(),
});

const updateProductSchema = createProductSchema.partial();

module.exports = { createProductSchema, updateProductSchema };