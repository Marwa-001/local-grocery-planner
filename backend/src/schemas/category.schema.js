const { z } = require('zod');

const createCategorySchema = z.object({
  categoryName: z.string().min(1),
});

module.exports = { createCategorySchema, updateCategorySchema: createCategorySchema.partial() };