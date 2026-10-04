import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => User | null;
  removeUser: () => void;
};

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  getUser: () => get().user,

  removeUser: () => set({ user: null }),
}));