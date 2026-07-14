import apiFetch from "@/lib/api";

export const createFavouritesSlice = (set, get) => ({
  favourites: [], // [{ productId }]
  favouritesLoading: false,

  fetchFavourites: async () => {
    set({ favouritesLoading: true });
    try {
      const rows = await apiFetch("/favourites");
      set({
        favourites: rows.map((r) => ({ productId: r.id })),
        favouritesLoading: false,
      });
    } catch (err) {
      set({ favouritesLoading: false });
      throw err;
    }
  },

  // userId kept in the signature so existing call sites (toggleFavourite("local-user", id))
  // don't need to change; the backend infers the user from the auth token instead.
  toggleFavourite: async (userId, productId) => {
    const exists = get().favourites.some((f) => f.productId === productId);
    if (exists) {
      await apiFetch(`/favourites/${productId}`, { method: "DELETE" });
      set((state) => ({
        favourites: state.favourites.filter((f) => f.productId !== productId),
      }));
    } else {
      await apiFetch(`/favourites/${productId}`, { method: "POST" });
      set((state) => ({
        favourites: [...state.favourites, { productId }],
      }));
    }
  },
});
