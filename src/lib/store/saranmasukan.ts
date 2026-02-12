import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SaranMasukanState {
  materi: string;
  metode: string;
  waktu: string;
  pengajar: string;
  setMateri: (v: string) => void;
  setMetode: (v: string) => void;
  setWaktu: (v: string) => void;
  setPengajar: (v: string) => void;
  clear: () => void;
}

export const useSaranMasukanStore = create<SaranMasukanState>()(
  persist(
    (set) => ({
      materi: "",
      metode: "",
      waktu: "",
      pengajar: "",
      setMateri: (v) => set({ materi: v }),
      setMetode: (v) => set({ metode: v }),
      setWaktu: (v) => set({ waktu: v }),
      setPengajar: (v) => set({ pengajar: v }),
      clear: () =>
        set({
          materi: "",
          metode: "",
          waktu: "",
          pengajar: "",
        }),
    }),
    {
      name: "saran-masukan", // key di localStorage
    }
  )
);