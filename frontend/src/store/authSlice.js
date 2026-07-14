import apiFetch from "@/lib/api";

export const createAuthSlice = (set, get) => ({
  user: null, // { id, name, email, isAdmin }
  authLoading: false,
  authError: "",

  // Reads token from localStorage on app start and fetches the profile
  // so refreshes don't lose the session.
  hydrateAuth: async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const profile = await apiFetch("/user/profile");
      set({
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          isAdmin: profile.is_admin,
        },
      });
    } catch {
      localStorage.removeItem("token");
      set({ user: null });
    }
  },

  register: async ({ name, email, password }) => {
    set({ authLoading: true, authError: "" });
    try {
      const data = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem("token", data.token);
      set({
        user: {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          isAdmin: data.user.is_admin,
        },
        authLoading: false,
      });
      return true;
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  login: async ({ email, password }) => {
    set({ authLoading: true, authError: "" });
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      set({ user: data.user, authLoading: false });
      return true;
    } catch (err) {
      set({ authError: err.message, authLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      categories: [],
      products: [],
      lists: [],
      favourites: [],
    });
  },
});
