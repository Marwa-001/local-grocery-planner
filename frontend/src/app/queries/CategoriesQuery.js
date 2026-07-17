import apiFetch from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// maps backend row -> shape the UI already expects
const mapCategory = (c) => ({
  id: c.id,
  name: c.category_name,
});

  // categories: [],
  // categoriesLoading: false,
  

  export const fetchCategories = async () => {
  try {
    console.log("Starting fetch request...");
    const res = await fetch("http://localhost:5000/categories");
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    
    return data;
  } catch (error) {
    throw error; 
  }
};

  // Admin-only on the backend. Non-admin users will get a 403 message back.
  export const addCategory = async (name) => {
    // const state = get();
    // const exists = state.categories.some(
    //   (c) => c.name.toLowerCase() === name.toLowerCase()
    // );
    // if (exists) return { success: false, message: "Category already exists" };

    try {
      const created = await apiFetch("/categories/create", {
        method: "POST",
        body: JSON.stringify({ categoryName: name }),
      });
      // set((state) => ({
      //   categories: [...state.categories, mapCategory(created)],
      // }));
      // return { success: true };
      console.log(created, 11111)
      return created

    } catch (err) {
      throw err
      // return { success: false, message: err.message };
    }
  }

  export const updateCategory= async (id, updates) => {
    try {
      const updated = await apiFetch(`/categories/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ categoryName: updates.name }),
      });
      // set((state) => ({
      //   categories: state.categories.map((c) =>
      //     c.id === id ? mapCategory(updated) : c
      //   ),
      // }));
      return updated;
    } catch (err) {
      throw err
    }
  }

  // No DELETE /categories/:id route exists on the backend yet.
  export const deleteCategory = async (id) => {
    try {
      const deleted = await apiFetch(`/categories/${id}`, { method: "DELETE" });
      // set((state) => ({
      //   categories: state.categories.filter((c) => c.id !== id),
      //   // products in this category fall back to "Uncategorized" server-side
      //   // (category_id ON DELETE SET NULL), so mirror that locally too.
      //   products: state.products.map((p) =>
      //     p.categoryId === id ? { ...p, categoryId: null } : p
      //   ),
      // }));
      return deleted;
    } catch (err) {
      throw err;
    }
  }
