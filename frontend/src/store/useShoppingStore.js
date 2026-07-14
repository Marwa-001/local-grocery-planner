import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createCategoriesSlice } from "./categoriesSlice";
import { createProductsSlice } from "./productsSlice";
import { createListsSlice } from "./listsSlice";
import { createFavouritesSlice } from "./favouritesSlice";



export const useShoppingStore = create()(
  persist(
    (...a) => ({
      ...createCategoriesSlice(...a),
      ...createProductsSlice(...a),
      ...createListsSlice(...a),
      ...createFavouritesSlice(...a),
    }),
    {
      name: "grocery-planner-storage", 
      storage: createJSONStorage(() => localStorage),
    }
  )
);