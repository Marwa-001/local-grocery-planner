export const createListsSlice = (set) => ({
  lists: [],

  addList: (list) => 
    set((state) => ({ lists: [...state.lists, list] })),

  deleteList: (id) => 
    set((state) => ({ lists: state.lists.filter((l) => l.id !== id) })),


  deleteListItem: (listId, itemId) => set((state) => ({
    lists: state.lists.map(list => list.id === listId ? {
      ...list,
      items: list.items.filter(item => item.id !== itemId)
    } : list)
  })),

  togglePurchaseStatus: (listId, itemId) =>
    set((state) => ({
      lists: state.lists.map((l) =>
        l.id === listId
          ? {
              ...l,
              items: l.items.map((i) =>
                i.id === itemId ? { ...i, isPurchased: !i.isPurchased } : i
              ),
            }
          : l
      ),
    })),

addProductToList: (listId, product) =>
  set((state) => ({
    lists: state.lists.map((l) => {
      if (l.id !== listId) return l;

      const existingItem = l.items.find((item) => item.productId === product.id);

      if (existingItem) {
        return {
          ...l,
          items: l.items.map((item) =>
            item.productId === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  isPurchased: false, 
                }
              : item
          ),
        };
      }

      return {
        ...l,
        items: [
          ...l.items,
          {
            ...product,
            id: crypto.randomUUID(),
            productId: product.id,
            isPurchased: false,
            quantity: 1,
          },
        ],
      };
    }),
  })),

updateListItemQuantity: (listId, itemId, delta) => set((state) => ({
  lists: state.lists.map(list => list.id === listId ? {
    ...list,
    items: list.items.map(item => item.id === itemId 
      ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
      : item
    )
  } : list)
})),
});