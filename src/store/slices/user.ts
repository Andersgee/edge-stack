import type { StateCreator } from "zustand";
import type { TokenUser } from "#src/utils/jwt/schema";

export type Userlice = {
  user: TokenUser | null;
  setUser: (user: TokenUser) => void;
};

export const createUserSlice: StateCreator<Userlice, [], [], Userlice> = (
  set,
  _get
) => ({
  user: null,
  setUser: (user: TokenUser) => {
    set({ user });
  },
});
