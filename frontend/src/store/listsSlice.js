import apiFetch from "@/lib/api";

const mapList = (l) => ({ id: l.id, name: l.name, items: [] });

const mapItem = (i) => ({
  id: i.id,
  productId: i.product_id,
  isPurchased: i.is_purchased,
  quantity: i.quantity,
  price: i.price != null ? Number(i.price) : 0,
});

// PATCH /listitems/:id only returns the raw list_items row (no joined
// name/price), so merge quantity/isPurchased into the item we already have.
const mergeItemUpdate = (existing, updatedRow) => ({
  ...existing,
  quantity: updatedRow.quantity,
  isPurchased: updatedRow.is_purchased,
});

export const createListsSlice = (set, get) => ({
  lists: [],
  listsLoading: false,

  fetchLists: async () => {
    set({ listsLoading: true });
    try {
      const rows = await apiFetch("/lists");
      set((state) => ({
        // keep already-loaded items for lists that still exist
        lists: rows.map((r) => {
          const existing = state.lists.find((l) => l.id === r.id);
          return existing ? { ...mapList(r), items: existing.items } : mapList(r);
        }),
        listsLoading: false,
      }));
    } catch (err) {
      set({ listsLoading: false });
      throw err;
    }
  },

  fetchListItems: async (listId) => {
    const rows = await apiFetch(`/listitems/${listId}/items`);
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === listId ? { ...l, items: rows.map(mapItem) } : l
      ),
    }));
  },

  addList: async (list) => {
    const created = await apiFetch("/lists", {
      method: "POST",
      body: JSON.stringify({ name: list.name }),
    });
    set((state) => ({ lists: [...state.lists, mapList(created)] }));
    return mapList(created);
  },

  deleteList: async (id) => {
    await apiFetch(`/list/${id}`, { method: "DELETE" });
    set((state) => ({ lists: state.lists.filter((l) => l.id !== id) }));
  },

  deleteListItem: async (listId, itemId) => {
    await apiFetch(`/listitems/${itemId}`, { method: "DELETE" });
    set((state) => ({
      lists: state.lists.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      ),
    }));
  },

  togglePurchaseStatus: async (listId, itemId) => {
    const list = get().lists.find((l) => l.id === listId);
    const item = list?.items.find((i) => i.id === itemId);
    if (!item) return;
    const updated = await apiFetch(`/listitems/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ isPurchased: !item.isPurchased }),
    });
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((i) =>
                i.id === itemId ? mergeItemUpdate(i, updated) : i
              ),
            }
          : l
      ),
    }));
  },

  addProductToList: async (listId, product) => {
    const list = get().lists.find((l) => l.id === listId);
    const existingItem = list?.items.find((item) => item.productId === product.id);

    if (existingItem) {
      const updated = await apiFetch(`/listitems/${existingItem.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          quantity: existingItem.quantity + 1,
          isPurchased: false,
        }),
      });
      set((state) => ({
        lists: state.lists.map((l) =>
          l.id === listId
            ? {
                ...l,
                items: l.items.map((i) =>
                  i.id === existingItem.id ? mergeItemUpdate(i, updated) : i
                ),
              }
            : l
        ),
      }));
    } else {
      const created = await apiFetch(`/listitems/addItem/${listId}`, {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      // addItem response doesn't include product name/price, so merge from product
      const newItem = {
        id: created.id,
        productId: created.product_id,
        isPurchased: created.is_purchased,
        quantity: created.quantity,
        price: product.price ?? 0,
      };
      set((state) => ({
        lists: state.lists.map((l) =>
          l.id === listId ? { ...l, items: [...l.items, newItem] } : l
        ),
      }));
    }
  },

  updateListItemQuantity: async (listId, itemId, delta) => {
    const list = get().lists.find((l) => l.id === listId);
    const item = list?.items.find((i) => i.id === itemId);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    const updated = await apiFetch(`/listitems/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity: newQuantity }),
    });
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((i) =>
                i.id === itemId ? mergeItemUpdate(i, updated) : i
              ),
            }
          : l
      ),
    }));
  },
});
