// components/AuthProvider/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const sessionRes = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (!sessionRes.ok) {
          clearUser();
          setLoading(false);
          return;
        }

        const text = await sessionRes.text();
        if (text.trim() === "") {
          clearUser();
        } else {
          const user = JSON.parse(text);
          setUser(user);
        }
      } catch {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, clearUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
