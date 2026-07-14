"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Helper function to define link styles
  const navLinkStyle = (path) => {
    const isActive = pathname === path;
    return `relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-xl ${
      isActive 
        ? "text-indigo-600 bg-indigo-50" 
        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
    }`;
  };

  return (
<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
  <div className="max-w-xl mx-auto px-4 sm:px-6"> {/* Added responsive padding */}
    <div className="flex items-center justify-between h-16 sm:h-20"> {/* Shorter height on mobile */}
      
      <Link href="/lists" className="flex items-center gap-2 group">
        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white text-base sm:text-xl">🛒</span>
        </div>
        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900">
          Grocery Store
        </span>
      </Link>

      <div className="flex gap-1 p-1 bg-slate-100/50 rounded-xl sm:rounded-2xl">
        <Link href="/lists" className={navLinkStyle("/lists")}>
          Lists
        </Link>
        <Link href="/products" className={navLinkStyle("/products")}>
          <span className="hidden sm:inline">Catalog</span>
          <span className="inline sm:hidden">Items</span>
        </Link>
      </div>
    </div>
  </div>
</nav>
  );
}