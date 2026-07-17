"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShoppingStore } from "@/store/useShoppingStore";
import ListModal from "@/components/lists/ListModal";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../queries/ProductsQuery";
import { fetchFavourites } from "../queries/FavouritesQuery";

export default function ListsPage() {
  const router = useRouter();
  const { user, lists, addList, fetchLists, listsLoading } = useShoppingStore();
  const [selectedListId, setSelectedListId] = useState(null);
  const [error, setError] = useState("");

  const queryClient = useQueryClient()

  const {data: productsData, isLoading: isLoadingProducts, isError: isErrorProducts} = useQuery({
    queryKey:['products'],
    queryFn: fetchProducts
  })

  const {data: favouritesData=[]}=useQuery({
    queryKey:['favourites'],
    queryFn:fetchFavourites
  })

  useEffect(() => {
    if (user === null) {
      // give hydrateAuth a beat to resolve before bouncing to /login
      const t = setTimeout(() => {
        if (!useShoppingStore.getState().user) router.push("/login");
      }, 300);
      return () => clearTimeout(t);
    }
    // fetchProducts()
    // fetchFavourites()
    fetchLists();
  }, [user, fetchLists, router]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    const name = e.target.listName.value;
    if (!name.trim()) return;

    try {
      await addList({ name });
      e.target.reset();
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // fetch products before loading lists

  // useEffect(()=>{
    
  // })

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-slate-900 font-sans antialiased pb-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        <header className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
            My Lists
          </h1>
          <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
            Organize your shopping by occasion or store.
          </p>
        </header>

        <section className="mb-10 sm:mb-12">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 block ml-1">
            New Collection
          </label>
          <form className="relative group" onSubmit={handleCreateList}>
            <input
              name="listName"
              placeholder="e.g. Weekly Groceries..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 pr-28 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all duration-300 shadow-sm group-hover:shadow-md text-base text-slate-800 placeholder:text-slate-300"
            />
            <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-md shadow-indigo-100">
              Create
            </button>
          </form>
          {error && <p className="text-red-500 mt-2 text-xs font-bold uppercase ml-1">{error}</p>}
        </section>


        <div className="grid gap-4 sm:gap-6">
          {listsLoading ? (
            <div className="text-center py-16 sm:py-20 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading...</p>
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center py-16 sm:py-20 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50">
              <div className="text-4xl mb-4 grayscale opacity-50">📝</div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No lists yet</p>
              <p className="text-slate-400 text-sm mt-2">Create one to start shopping!</p>
            </div>
          ) : (
            lists.map((list) => (
              <button
                key={list.id}
                onClick={() => setSelectedListId(list.id)}
                className="group relative text-left p-6 sm:p-8 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-100 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex items-center justify-between overflow-hidden active:scale-[0.98]"
              >
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-indigo-50/30 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 transition-transform group-hover:scale-125" />

                <div className="relative z-10 min-w-0 pr-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                    {list.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 sm:mt-2">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                      {list.items?.length || 0} {list.items?.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                {/* Circular Arrow Button */}
                <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center rounded-full bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-300 shadow-sm border border-slate-100 sm:border-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Modal Overlay Logic */}
        {selectedListId && (
          <ListModal
            listId={selectedListId}
            onClose={() => setSelectedListId(null)}
          />
        )}
      </div>
    </div>
  );
}
