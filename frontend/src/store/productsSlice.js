export const createProductsSlice = (set, get) => ({
  products: [],

  addProduct: (product) => {
    const state = get();
    const exists = state.products.some(
      (p) => p.name.toLowerCase() === product.name.toLowerCase()
    );
    if (exists) return false;

    set((state) => ({
      products: [...state.products, product],
    }));
    return true; 
  },

 updateProduct: (updatedProduct) => set((state) => ({
    products: state.products.map((p) => 
      p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
    ),
  })),

  deleteProduct: (id) =>
    set((state) => ({ 
      products: state.products.filter((p) => p.id !== id) 
    })),

  // toggleFavourite: (id) =>
  //   set((state) => ({
  //     products: state.products.map((p) =>
  //       p.id === id ? { ...p, isFavourite: !p.isFavourite } : p
  //     ),
  //   })),
});