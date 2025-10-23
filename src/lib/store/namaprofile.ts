import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  id: number;
  username: string;
  nama: string;
  roleId: number;
  lemdikId: number | null;
}

interface NamaProfileState {
  user: UserProfile | null;
  nama: string | null; // Keep for backward compatibility
  setUser: (user: UserProfile) => void;
  setNama: (nama: string | null) => void; // Keep for backward compatibility
  clearUser: () => void;
  clearNama: () => void; // Keep for backward compatibility
}

export const useNamaProfileStore = create<NamaProfileState>()(
  persist(
    (set) => ({
      user: null,
      nama: null,
      setUser: (user) => set({ user, nama: user.nama }),
      setNama: (nama) => set({ nama }),
      clearUser: () => set({ user: null, nama: null }),
      clearNama: () => set({ user: null, nama: null }),
    }),
    {
      name: "user-profile-storage", // unique name for localStorage
    }
  )
);
