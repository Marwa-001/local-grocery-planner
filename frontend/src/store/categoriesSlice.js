// import apiFetch from "@/lib/api";

// // maps backend row -> shape the UI already expects
// const mapCategory = (c) => ({
//   id: c.id,
//   name: c.category_name,
// });

// export const createCategoriesSlice = (set, get) => ({
//   categories: [],
//   categoriesLoading: false,

//   fetchCategories: async () => {
//     set({ categoriesLoading: true });
//     try {
//       const rows = await apiFetch("/categories");
//       set({ categories: rows.map(mapCategory), categoriesLoading: false });
//     } catch (err) {
//       set({ categoriesLoading: false });
//       throw err;
//     }
//   },

//   // Admin-only on the backend. Non-admin users will get a 403 message back.
//   addCategory: async (name) => {
//     const state = get();
//     const exists = state.categories.some(
//       (c) => c.name.toLowerCase() === name.toLowerCase()
//     );
//     if (exists) return { success: false, message: "Category already exists" };

//     try {
//       const created = await apiFetch("/categories/create", {
//         method: "POST",
//         body: JSON.stringify({ categoryName: name }),
//       });
//       set((state) => ({
//         categories: [...state.categories, mapCategory(created)],
//       }));
//       return { success: true };
//     } catch (err) {
//       return { success: false, message: err.message };
//     }
//   },

//   updateCategory: async (id, updates) => {
//     try {
//       const updated = await apiFetch(`/categories/${id}`, {
//         method: "PATCH",
//         body: JSON.stringify({ categoryName: updates.name }),
//       });
//       set((state) => ({
//         categories: state.categories.map((c) =>
//           c.id === id ? mapCategory(updated) : c
//         ),
//       }));
//       return { success: true };
//     } catch (err) {
//       return { success: false, message: err.message };
//     }
//   },

//   // No DELETE /categories/:id route exists on the backend yet.
//   deleteCategory: async (id) => {
//     try {
//       await apiFetch(`/categories/${id}`, { method: "DELETE" });
//       set((state) => ({
//         categories: state.categories.filter((c) => c.id !== id),
//         // products in this category fall back to "Uncategorized" server-side
//         // (category_id ON DELETE SET NULL), so mirror that locally too.
//         products: state.products.map((p) =>
//           p.categoryId === id ? { ...p, categoryId: null } : p
//         ),
//       }));
//       return { success: true };
//     } catch (err) {
//       return { success: false, message: err.message };
//     }
//   },
// });