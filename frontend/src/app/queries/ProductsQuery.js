import apiFetch from "@/lib/api";

// backend row -> UI shape (categoryId, price as number, etc.)
const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  price: p.price != null ? Number(p.price) : 0,
  categoryId: p.category_id ?? p.categoryId ?? null,
});

  export const fetchProducts = async () => {
    // set({ productsLoading: true });
    try {
      const rows = await apiFetch("/products");
    //   set({ products: rows.map(mapProduct), productsLoading: false });
    return rows.map(mapProduct)
    } catch (err) {
    //   set({ productsLoading: false });
      throw err;
    }
  }

  // Admin-only on the backend.
  export const addProduct = async (product) => {
    // const state = get();
    // const exists = state.products.some(
    //   (p) => p.name.toLowerCase() === product.name.toLowerCase()
    // );
    // if (exists) return { success: false, message: "Product already exists in catalog!" };

    try {
      const created = await apiFetch("/product/create", {
        method: "POST",
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          categoryId: product.categoryId || null,
        }),
      });
    //   set((state) => ({ products: [...state.products, mapProduct(created)] }));
      return created;
    } catch (err) {
      throw err;
    }
  }

  export const updateProduct =  async (updatedProduct) => {
    try {
      const updated = await apiFetch(`/product/${updatedProduct.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: updatedProduct.name,
          price: updatedProduct.price,
          categoryId: updatedProduct.categoryId || null,
        }),
      });
    //   set((state) => ({
    //     products: state.products.map((p) =>
    //       p.id === updatedProduct.id ? mapProduct(updated) : p
    //     ),
    //   }));
      return updated;
    } catch (err) {
      throw err
    }
  }

  export const deleteProduct=  async (id) => {
    try {
      const deletedProduct = await apiFetch(`/product/${id}`, { method: "DELETE" });
    //   set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
      return deletedProduct;
    } catch (err) {
      throw err
    }
  }
