"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function FeedWrapper({ children }) {
  const router = useRouter();
  const path = usePathname();
  const KEY = `scroll:${path}`;

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"; // turn off auto-restoration
      let shouldRestore = false;

      // mark when the user hits Back/Forward
      router.beforePopState(() => {
        shouldRestore = true;
        return true;
      });

      return () => {
        // on unmount, save scroll
        sessionStorage.setItem(KEY, `${window.scrollY}`);
        // on next mount, restore if triggered by pop
        if (shouldRestore) {
          const val = sessionStorage.getItem(KEY) ?? "0";
          window.scrollTo(0, parseInt(val, 10));
        }
      };
    }
  }, [router, path]);

  return <>{children}</>;
}
