"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShoppingStore } from "@/store/useShoppingStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, authLoading, authError } = useShoppingStore();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(form);
    if (success) router.push("/lists");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FBFBFB] text-slate-900 font-sans antialiased flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 mb-2">
            Welcome <span className="text-indigo-600">back</span>
          </h1>
          <p className="text-slate-500 text-base">Log in to your grocery planner.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder:text-slate-300 shadow-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800 placeholder:text-slate-300 shadow-sm"
            />
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-[11px] font-black uppercase tracking-wider p-4 rounded-2xl flex items-center gap-3">
              <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shrink-0">!</div>
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-slate-900 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50"
          >
            {authLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          No account yet?{" "}
          <Link href="/register" className="text-indigo-600 font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
