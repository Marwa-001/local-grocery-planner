"use client";
import Link from "next/link";
import { useShoppingStore } from "@/store/useShoppingStore";

export default function Home() {
  const { lists, products, favourites } = useShoppingStore();

  const totalItemsToBuy = lists.reduce((acc, list) => acc + list.items.length, 0);
  const favoriteCount = favourites.length;

  return (
    <div className="min-h-[calc(100-80px)] bg-[#FBFBFB] text-slate-900 font-sans antialiased">
      <div className="max-w-xl mx-auto px-6 py-12">
        
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold tracking-tighter text-slate-900 mb-4">
            Hello! <span className="text-indigo-600">Ready to shop?</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Your personal market companion. Everything is stored locally on your device—private and fast.
          </p>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <span className="text-3xl mb-2 block">📝</span>
            <span className="block text-2xl font-black text-slate-800">{lists.length}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Lists</span>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <span className="text-3xl mb-2 block">⭐</span>
            <span className="block text-2xl font-black text-slate-800">{favoriteCount}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Favorites</span>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="space-y-4">
          <Link 
            href="/lists" 
            className="group flex items-center justify-between w-full bg-slate-900 hover:bg-indigo-600 text-white p-6 rounded-[2rem] transition-all duration-300 shadow-xl shadow-slate-200 overflow-hidden relative"
          >
            <div className="relative z-10">
              <h2 className="text-xl font-bold">Manage Lists</h2>
              <p className="text-slate-400 group-hover:text-indigo-100 text-sm">View and create shopping lists</p>
            </div>
            <span className="text-2xl relative z-10 transition-transform group-hover:translate-x-2">→</span>
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8" />
          </Link>

          <Link 
            href="/products" 
            className="group flex items-center justify-between w-full bg-white hover:border-indigo-100 border border-slate-100 text-slate-800 p-6 rounded-[2rem] transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
          >
            <div>
              <h2 className="text-xl font-bold">Catalog</h2>
              <p className="text-slate-400 text-sm">Update prices and items</p>
            </div>
            <span className="text-2xl opacity-20 group-hover:opacity-100 group-hover:text-indigo-600 transition-all">🍎</span>
          </Link>
        </div>

        {/* Humanized Tips / Feature Cards */}
        <div className="mt-16 border-t border-slate-100 pt-12">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 text-center">
            How it works
          </h3>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Build your Catalog</h4>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">Add items you buy often and set their estimated prices. We'll remember them for you.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Organize into Lists</h4>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">Create lists for different stores or occasions—like "Weekly Groceries" or "BBQ Party."</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-12 h-12 shrink-0 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-bold text-slate-800 text-lg">Shop & Track</h4>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">Check items off as you shop. We'll track the total cost so you stay within budget.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <footer className="mt-20 text-center">
          <p className="text-slate-300 text-xs font-medium">
            Your data is stored locally in your browser.<br />
            No accounts, no tracking, just groceries.
          </p>
        </footer>
      </div>
    </div>
  );
}