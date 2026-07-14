const { z } = require('zod');
const createListSchema = z.object({ name: z.string().min(1) });
module.exports = { createListSchema, updateListSchema: createListSchema.partial() };