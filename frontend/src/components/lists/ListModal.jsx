"use client";
import { useEffect, useState } from "react";
import { useShoppingStore } from "@/store/useShoppingStore";
import { getFullListItem, calculateListTotal } from "@/lib/utils";

export default function ListModal({ listId, onClose }) {
  const {
    lists,
    products,
    fetchListItems,
    deleteListItem,
    togglePurchaseStatus,
    updateListItemQuantity,
    addProductToList,
    favourites,
  } = useShoppingStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsLoading, setItemsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setItemsLoading(true);
    fetchListItems(listId).finally(() => {
      if (active) setItemsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [listId, fetchListItems]);

  const list = lists.find((l) => l.id === listId);
  if (!list) return null;

  const filteredItems = list.items.filter((item) => {
    const fullItem = getFullListItem(item, products);
    return fullItem.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalCost = calculateListTotal(list.items.map(item => getFullListItem(item, products)));

  const favouriteProducts = products.filter((p) =>
    favourites.some((f) => f.productId === p.id)
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-lg h-[92vh] sm:h-auto sm:max-h-[85vh] overflow-hidden rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">

        <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 shrink-0" />


        <div className="p-6 sm:p-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{list.name}</h2>

            <p className="text-slate-400 font-medium text-sm mt-0.5">Shopping Mode</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-grow overflow-y-auto px-6 sm:px-8 pb-8 custom-scrollbar">

          <div className="relative mb-6 sticky top-0 bg-white pt-2 z-10">
            <input
              placeholder="Find an item..."
              className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 top-[60%] -translate-y-1/2 text-xl opacity-30">🔍</span>
          </div>
          {/* add items using dropdown containg all the products */}
          <div className="mb-4">
            {products.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[2rem]">
                <p className="text-slate-300 font-medium italic">No products available</p>
                </div>
                )
              }
              {products.length > 0 && (
                <div className="grid gap-3">
                  <select className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner" onChange={(e) => {
                    const selectedProductId = e.target.value;
                    const selectedProduct = products.find((prod) => String(prod.id) === selectedProductId);
                    if (selectedProduct) {
                      addProductToList(listId, selectedProduct);
                    }
                    e.target.value = "";
                  }}>
                    <option value="">Select a product to add...</option>
                  {products.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name} - ${prod.price.toFixed(2)}
                    </option>
                  ))}</select>
                </div>
              )}
          </div>


          <section className="mb-8">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">
              Quick Add Favorites
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
              {favouriteProducts.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => addProductToList(listId, prod)}
                  className="bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-600 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-90 border border-indigo-100/50"
                >
                  + {prod.name}
                </button>
              ))}
              {favouriteProducts.length === 0 && (
                <p className="text-slate-300 text-xs italic ml-1 font-medium">No favorites tagged yet</p>
              )}
            </div>
          </section>


          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">
              Items to Buy
            </label>
            {itemsLoading && (
              <p className="text-slate-300 text-xs italic ml-1 font-medium">Loading items...</p>
            )}
            {!itemsLoading && filteredItems.map((item) => {
              const fullItem = getFullListItem(item, products);
              const isPurchased = item.isPurchased;

              return (
                <div
                  key={item.id}
                  className={`group p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 ${
                    isPurchased
                      ? "bg-slate-50 border-transparent opacity-60"
                      : "bg-white border-slate-100 shadow-sm hover:border-indigo-100"
                  }`}
                >

                  <button
                    onClick={() => togglePurchaseStatus(listId, item.id)}
                    className={`w-7 h-7 shrink-0 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isPurchased
                        ? "bg-green-500 border-green-500 shadow-lg shadow-green-100"
                        : "bg-white border-slate-200 hover:border-indigo-400"
                    }`}
                  >
                    {isPurchased && <span className="text-white text-[10px] font-bold">✓</span>}
                  </button>

                  {/* Name & Price Info */}
                  <div className="flex-grow min-w-0">
                    <span className={`block font-bold truncate transition-all ${
                      isPurchased ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}>
                      {fullItem.name}
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wide ${isPurchased ? 'text-slate-300' : 'text-indigo-500'}`}>
                      {fullItem.price ? `$${(fullItem.price * item.quantity).toFixed(2)}` : "FREE"}
                    </span>
                  </div>

                  {!isPurchased && (
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0">
                      <button
                        onClick={() => updateListItemQuantity(listId, item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="text-slate-900 font-extrabold w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateListItemQuantity(listId, item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => deleteListItem(listId, item.id)}
                    className="p-1 text-slate-300 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            {!itemsLoading && filteredItems.length === 0 && (
              <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[2rem]">
                 <p className="text-slate-300 font-medium italic">No items found</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex flex-row items-center justify-between shrink-0 pb-10 sm:pb-8">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">
              Estimated Total
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tighter">
              ${totalCost.toFixed(2)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
