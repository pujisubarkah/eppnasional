import { create } from "zustand";

interface NamaProfileState {
  nama: string | null;
  setNama: (nama: string | null) => void;
  clearNama: () => void;
}

export const useNamaProfileStore = create<NamaProfileState>((set) => ({
  nama: null,
  setNama: (nama) => set({ nama }),
  clearNama: () => set({ nama: null }),
}));
