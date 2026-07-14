"use client";
import { useState } from "react";
import { useShoppingStore } from "@/store/useShoppingStore";
import { productSchema } from "@/lib/schemas";

export default function ProductForm({ productToEdit, clearEdit }) {
  const { addProduct, categories, updateProduct } = useShoppingStore();
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const rawCategoryId = formData.get("categoryId");

    const raw = {
      id: productToEdit?.id,
      name: formData.get("name")?.toString() || "",
      price: formData.get("price") ? parseFloat(formData.get("price")) : 0,
      // backend's zod schema requires categoryId as a number (or omitted),
      // but a <select> always gives back a string, so coerce it here.
      categoryId: rawCategoryId ? Number(rawCategoryId) : null,
      isFavourite: false,
    };

    const result = productSchema.safeParse(raw);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (productToEdit) {
      const res = await updateProduct(result.data);
      if (!res.success) {
        setError(res.message || "Could not update product");
        return;
      }
      clearEdit();
    } else {
      const res = await addProduct(raw);
      if (!res.success) {
        setError(res.message || "Product already exists in catalog!");
        return;
      }
    }
    setError("");
    e.target.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
            Product Name
          </label>
          <input
            name="name"
            defaultValue={productToEdit?.name || ""}
            placeholder="e.g. Fresh Avocado"
            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder:text-slate-300 shadow-sm"
          />
        </div>


        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
            Estimated Price ($)
          </label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
            <input
              name="price"
              type="number"
              defaultValue={productToEdit?.price || ""}
              step="0.01"
              placeholder="0.00"
              className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 shadow-sm"
            />
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
            Category
          </label>
          <div className="relative">
            <select
              name="categoryId"
              defaultValue={productToEdit?.categoryId || ""}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 appearance-none shadow-sm cursor-pointer"
            >
              <option value="">Uncategorized</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="submit"
          className="w-full sm:flex-[2] bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>{productToEdit ? "Update Item" : "Save to Catalog"}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {productToEdit && (
          <button
            type="button"
            onClick={clearEdit}
            className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 px-8 py-4 rounded-2xl font-bold transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-500 text-[11px] font-black uppercase tracking-wider p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shrink-0">!</div>
          {error}
        </div>
      )}
    </form>
  );
}