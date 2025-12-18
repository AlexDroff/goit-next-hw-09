import { create } from "zustand";
import type { User } from "@/types/user";

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
