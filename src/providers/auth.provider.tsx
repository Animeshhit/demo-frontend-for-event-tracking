"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/user-store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((s) => s.setUser);
  const removeUser = useUserStore((s) => s.removeUser);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { signal: controller.signal });
        if (!res.ok) {
          removeUser();
          return;
        }
        const data = await res.json();
        if(!data.authenticated){
            removeUser();
            return;
        }
        setUser(data.user);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        removeUser();
      } finally {
        if (!controller.signal.aborted) setChecked(true);
      }
    };

    fetchUser();
    return () => controller.abort();
  }, [setUser, removeUser]);

  if (!checked) return null;

  return <>{children}</>;
}