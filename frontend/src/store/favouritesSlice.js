// src/store/favouritesSlice.js

export const createFavouritesSlice = (set, get) => ({
  favourites: [],

  toggleFavourite: (userId, productId) =>
    set((state) => {
      const exists = state.favourites.some(
        (f) => f.userId === userId && f.productId === productId
      );

      return {
        favourites: exists
          ? state.favourites.filter(
              (f) => !(f.userId === userId && f.productId === productId)
            )
          : [...state.favourites, { userId, productId }],
      };
    }),
});