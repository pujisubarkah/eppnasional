import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Option {
  id: number;
  option_text: string;
}

interface EvaluasiState {
  relevan: string[];
  tidakRelevan: string[];
  relevanOptions: Option[];
  tidakRelevanOptions: Option[];
  setRelevan: (value: string[]) => void;
  setTidakRelevan: (value: string[]) => void;
  setRelevanOptions: (options: Option[]) => void;
  setTidakRelevanOptions: (options: Option[]) => void;
  clearAll: () => void;
  reset: () => void;
}

export const useEvaluasiStore = create<EvaluasiState>()(
  persist(
    (set) => ({
      relevan: [],
      tidakRelevan: [],
      relevanOptions: [],
      tidakRelevanOptions: [],
      setRelevan: (value) => set({ relevan: value }),
      setTidakRelevan: (value) => set({ tidakRelevan: value }),
      setRelevanOptions: (options) => set({ relevanOptions: options }),
      setTidakRelevanOptions: (options) => set({ tidakRelevanOptions: options }),
      clearAll: () =>
        set({
          relevan: [],
          tidakRelevan: [],
          relevanOptions: [],
          tidakRelevanOptions: [],
        }),
      reset: () =>
        set((state) => ({
          relevan: [],
          tidakRelevan: [],
          relevanOptions: state.relevanOptions,
          tidakRelevanOptions: state.tidakRelevanOptions,
        })),
    }),
    {
      name: "evaluasi-jawaban", // Key di localStorage
    }
  )
);
