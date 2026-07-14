"use client";
import { useState } from "react";
import { useShoppingStore } from "@/store/useShoppingStore";
import ProductForm from "@/components/products/ProductForm";

export default function ProductsPage() {
  const { 
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory, 
    products, 
    toggleFavourite, 
    favourites 
  } = useShoppingStore();

  const [editingProduct, setEditingProduct] = useState(null);
  const [catError, setCatError] = useState("");
  
  const [editingCatId, setEditingCatId] = useState(null);
  const [editCatName, setEditCatName] = useState("");

  const handleAddCategory = (e) => {
    e.preventDefault();
    const name = e.target.catName.value;
    if (!name) return;

    const success = addCategory({ id: crypto.randomUUID(), name, userId: "local-user" });

    if (!success) {
      setCatError("Category already exists");
    } else {
      setCatError("");
      e.target.reset();
    }
  };

  const startEditingCategory = (cat) => {
    setEditingCatId(cat.id);
    setEditCatName(cat.name);
  };

  const saveCategoryEdit = () => {
    if (editCatName.trim()) {
      updateCategory(editingCatId, { name: editCatName.trim() });
    }
    setEditingCatId(null);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-slate-900 font-sans antialiased pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        <header className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Catalog</h1>
          <p className="text-slate-500 text-base sm:text-lg">Define your usual shopping items.</p>
        </header>

        {/* Create Category Section */}
        <section className="mb-10 sm:mb-12">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 block ml-1">
            New Category
          </label>
          <form className="relative group" onSubmit={handleAddCategory}>
            <input
              name="catName"
              placeholder="e.g. Fresh Products"
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-24 outline-none focus:border-indigo-500 transition-all shadow-sm text-base"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 rounded-xl text-sm font-bold transition-all active:scale-95">
              Add
            </button>
          </form>
          {catError && <p className="text-red-500 mt-2 text-xs font-bold uppercase ml-1">{catError}</p>}
        </section>

        {/* Product Form Section */}
        <section className="mb-12 bg-white rounded-[2rem] p-6 sm:p-8 border border-slate-100 shadow-sm">
          <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            {editingProduct ? "Update Product" : "New Product Details"}
          </h2>
          <ProductForm
            key={editingProduct?.id || "new-product"}
            productToEdit={editingProduct}
            clearEdit={() => setEditingProduct(null)}
          />
        </section>

        {/* Category & Product List */}
        <div className="space-y-12">
          {categories.map((category) => {
            const catItems = products.filter(p => p.categoryId === category.id);
            const isEditing = editingCatId === category.id;

            return (
              <div key={category.id} className="animate-in fade-in duration-500">
                {/* Category Header */}
                <div className="flex items-center justify-between mb-5 group/cat px-1">
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2 w-full">
                        <input 
                          autoFocus
                          className="bg-transparent border-b-2 border-indigo-500 outline-none text-xl sm:text-2xl font-bold text-slate-900 w-full"
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          onBlur={saveCategoryEdit}
                          onKeyDown={(e) => e.key === 'Enter' && saveCategoryEdit()}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                          {category.name}
                        </h3>
                        {/* Always visible on mobile, visible on hover for desktop */}
                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover/cat:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEditingCategory(category)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 sm:bg-transparent rounded-lg"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
                          </button>
                          <button 
                            onClick={() => { if(confirm('Delete this category?')) deleteCategory(category.id) }}
                            className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 sm:bg-transparent rounded-lg"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase shrink-0">
                    {catItems.length} Items
                  </span>
                </div>

                {/* Items List for this category */}
                <div className="grid gap-3">
                  {catItems.map((p) => {
                    const isFavourite = favourites.some(f => f.productId === p.id);
                    return (
                      <div key={p.id} className="group/item flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
                        <div className="flex items-center gap-3 min-w-0">
                          <button onClick={() => toggleFavourite("local-user", p.id)} className={`text-xl transition-all ${isFavourite ? "text-amber-400 scale-110" : "text-slate-200 hover:text-slate-300"}`}>
                            {isFavourite ? "★" : "☆"}
                          </button>
                          <div className="truncate">
                            <h4 className="font-bold text-slate-800 text-base truncate">{p.name}</h4>
                            <p className="text-indigo-500 text-xs font-bold mt-0.5 tracking-wide">${p.price?.toFixed(2) || "0.00"}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0 opacity-100 sm:opacity-0 sm:group-hover/item:opacity-100 transition-opacity">
                          <button onClick={() => setEditingProduct(p)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600">✎</button>
                          <button onClick={() => deleteProduct(p.id)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-slate-400 hover:text-red-500">✕</button>
                        </div>
                      </div>
                    );
                  })}
                  {catItems.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                      <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">No products in this category</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Uncategorized Items Section */}
          {products.some(p => !p.categoryId) && (
             <div className="animate-in fade-in duration-500">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-400 mb-5 px-1 italic">Uncategorized</h3>
                <div className="grid gap-3">
                  {products.filter(p => !p.categoryId).map((p) => (
                    <div key={p.id} className="group/item flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 transition-all">
                       <div className="truncate">
                          <h4 className="font-bold text-slate-800 text-base truncate">{p.name}</h4>
                          <p className="text-indigo-500 text-xs font-bold mt-0.5">${p.price?.toFixed(2) || "0.00"}</p>
                       </div>
                       <button onClick={() => setEditingProduct(p)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400">✎</button>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}