import apiFetch from "@/lib/api";

// export const createFavouritesSlice = (set, get) => ({
//   favourites: [], // [{ productId }]
//   favouritesLoading: false,

  export const fetchFavourites = async () => {
    // set({ favouritesLoading: true });
    try {
      const rows = await apiFetch("/favourites");
    //   set({
    //     favourites: rows.map((r) => ({ productId: r.id })),
    //     favouritesLoading: false,
    //   });

    return rows.map((r) => ({ productId: r.id }));
    } catch (err) {
    //   set({ favouritesLoading: false });
      throw err;
    }
  }

  // userId kept in the signature so existing call sites (toggleFavourite("local-user", id))
  // don't need to change; the backend infers the user from the auth token instead.
  // In your FavouritesQuery.js
export const toggleFavourite = async (productId, isFavourite) => {
    try{

        const method = isFavourite ? "DELETE" : "POST";
        return await apiFetch(`/favourites/${productId}`, { method });
    }
    catch(err){
        throw err
    }
};
// });
