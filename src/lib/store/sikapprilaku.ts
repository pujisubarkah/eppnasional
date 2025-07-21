import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SikapPrilakuState {
  sikap: string;
  setSikap: (v: string) => void;

  kinerja: string[];
  setKinerja: (v: string[]) => void;

  ekonomi: string;
  setEkonomi: (v: string) => void;

  dampak: string[];
  setDampak: (v: string[]) => void;

  dampakLain: string;
  setDampakLain: (v: string) => void;

  tema: string;
  setTema: (v: string) => void;

  clear: () => void;
}

export const useSikapPrilakuStore = create<SikapPrilakuState>()(
  persist(
    (set) => ({
      sikap: "",
      setSikap: (v) => set({ sikap: v }),

      kinerja: [],
      setKinerja: (v) => set({ kinerja: v }),

      ekonomi: "",
      setEkonomi: (v) => set({ ekonomi: v }),

      dampak: [],
      setDampak: (v) => set({ dampak: v }),

      dampakLain: "",
      setDampakLain: (v) => set({ dampakLain: v }),

      tema: "",
      setTema: (v) => set({ tema: v }),

      clear: () =>
        set({
          sikap: "",
          kinerja: [],
          ekonomi: "",
          dampak: [],
          dampakLain: "",
          tema: "",
        }),
    }),
    {
      name: "sikap-prilaku", // key di localStorage
    }
  )
);