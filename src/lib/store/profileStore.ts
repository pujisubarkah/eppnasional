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
    }),
    {
      name: 'profile-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
