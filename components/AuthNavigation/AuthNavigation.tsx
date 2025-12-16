// components/AuthNavigation/AuthNavigation.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import css from "./AuthNavigation.module.css";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthNavigation() {
  const router = useRouter();
  const { isAuthenticated, user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && user === null) {
      fetch("/api/auth/session")
        .then((res) => res.json())
        .then(({ success }) => {
          if (success) {
            return fetch("/api/users/me", { credentials: "include" })
              .then((res) => res.json())
              .then((userData) => {
                setUser(userData);
              });
          }
        })
        .catch(() => {
          clearUser();
        });
    }
  }, [isAuthenticated, user, setUser, clearUser]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearUser();
    router.push("/sign-in");
  };

  if (isAuthenticated && user) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>
        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user.email}</p>
          <button className={css.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
}
