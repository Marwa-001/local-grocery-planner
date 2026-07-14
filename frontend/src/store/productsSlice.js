import apiFetch from "@/lib/api";

// backend row -> UI shape (categoryId, price as number, etc.)
const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price != null ? Number(p.price) : 0,
  categoryId: p.category_id ?? p.categoryId ?? null,
});

export const createProductsSlice = (set, get) => ({
  products: [],
  productsLoading: false,

  fetchProducts: async () => {
    set({ productsLoading: true });
    try {
      const rows = await apiFetch("/products");
      set({ products: rows.map(mapProduct), productsLoading: false });
    } catch (err) {
      set({ productsLoading: false });
      throw err;
    }
  },

  // Admin-only on the backend.
  addProduct: async (product) => {
    const state = get();
    const exists = state.products.some(
      (p) => p.name.toLowerCase() === product.name.toLowerCase()
    );
    if (exists) return { success: false, message: "Product already exists in catalog!" };

    try {
      const created = await apiFetch("/product/create", {
        method: "POST",
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          categoryId: product.categoryId || null,
        }),
      });
      set((state) => ({ products: [...state.products, mapProduct(created)] }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  updateProduct: async (updatedProduct) => {
    try {
      const updated = await apiFetch(`/product/${updatedProduct.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: updatedProduct.name,
          price: updatedProduct.price,
          categoryId: updatedProduct.categoryId || null,
        }),
      });
      set((state) => ({
        products: state.products.map((p) =>
          p.id === updatedProduct.id ? mapProduct(updated) : p
        ),
      }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  deleteProduct: async (id) => {
    try {
      await apiFetch(`/product/${id}`, { method: "DELETE" });
      set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
});
