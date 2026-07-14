import { create } from "zustand";
import { createCategoriesSlice } from "./categoriesSlice";
import { createProductsSlice } from "./productsSlice";
import { createListsSlice } from "./listsSlice";
import { createFavouritesSlice } from "./favouritesSlice";
import { createAuthSlice } from "./authSlice";

// Data now lives on the backend, so we no longer persist app state to
// localStorage (only the JWT itself is kept there, by lib/api.js / authSlice).
export const useShoppingStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createCategoriesSlice(...a),
  ...createProductsSlice(...a),
  ...createListsSlice(...a),
  ...createFavouritesSlice(...a),
}));
