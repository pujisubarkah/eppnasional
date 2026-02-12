import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DukunganAnswer = string | null;

interface DukunganLingkunganState {
  answers: DukunganAnswer[];
  setAnswers: (answers: DukunganAnswer[]) => void;
  setAnswer: (idx: number, value: DukunganAnswer) => void;
  clear: () => void;
}

export const useDukunganLingkunganStore = create<DukunganLingkunganState>()(
  persist(
    (set) => ({
      answers: [],
      setAnswers: (answers) => set({ answers }),
      setAnswer: (idx, value) =>
        set((state) => {
          const next = [...state.answers];
          next[idx] = value;
          return { answers: next };
        }),
      clear: () => set({ answers: [] }),
    }),
    {
      name: "dukungan-lingkungan", // key di localStorage
    }
  )
);