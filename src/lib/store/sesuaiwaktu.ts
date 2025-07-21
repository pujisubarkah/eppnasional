import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SesuaiWaktuState {
  jawaban: string | null;
  setJawaban: (v: string) => void;
  clear: () => void;
}

export const useSesuaiWaktuStore = create<SesuaiWaktuState>()(
  persist(
    (set) => ({
      jawaban: null,
      setJawaban: (v) => set({ jawaban: v }),
      clear: () => set({ jawaban: null }),
    }),
    {
      name: "sesuai-waktu", // key di localStorage
    }
  )
);