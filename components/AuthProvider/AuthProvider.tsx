// components/AuthProvider/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      } catch {
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, clearUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
