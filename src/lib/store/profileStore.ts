// store/useProfileStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProfileState {
  id: number | null
  nama: string
  pelatihan_id: number | null
  setProfile: (data: Partial<ProfileState>) => void
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  clear: () => void // tambahkan ini
  }

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      id: null,
      nama: '',
      pelatihan_id: null,
      setProfile: (data) =>
        set((state) => ({ ...state, ...data })),
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
     clear: () =>
        set({
          id: null,
          nama: '',
          pelatihan_id: null,
          hasHydrated: true,
        }),
    }),
    {
      name: 'profile-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
