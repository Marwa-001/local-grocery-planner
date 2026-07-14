"use client";
import { useEffect } from "react";
import { useShoppingStore } from "@/store/useShoppingStore";

export default function AuthProvider({ children }) {
  const hydrateAuth = useShoppingStore((s) => s.hydrateAuth);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return children;
}
