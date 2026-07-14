export const createCategoriesSlice = (set, get) => ({

    categories: [
    { id: crypto.randomUUID(), userId: "local-user", name: "Fruits" },
    { id: crypto.randomUUID(), userId: "local-user", name: "Vegetables" },
    { id: crypto.randomUUID(), userId: "local-user", name: "Dairy" },
  ],



 addCategory: (newCategory) => {
  const state = get();
  const exists = state.categories.some(
    (c) => c.name.toLowerCase() === newCategory.name.toLowerCase()
  );

  if (exists) return false; 

  set((state) => ({
    categories: [...state.categories, newCategory],
  }));
  return true; 
},

  updateCategory: (id, updates) => 
    set((state) => ({
      categories: state.categories.map((c) => 
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  deleteCategory: (id) => 
    set((state) => ({ 
      categories: state.categories.filter((c) => c.id !== id) 
    })),
});