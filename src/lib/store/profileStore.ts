// store/useProfileStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ProfileState {
  id: number | null
  nama: string
  pelatihan_id: number | null
  // Tambah data form untuk persist
  formData: {
    nama: string
    nip: string
    instansi: string
    jenisInstansi: string
    domisili: string
    jabatan: string
    pelatihan: string
    tahunPelatihan: string
    jenisLembagaPenyelenggara: string
    lembagaPenyelenggara: string
    domisiliLembagaPenyelenggara: string
    handphone: string
  }
  setProfile: (data: Partial<ProfileState>) => void
  setFormData: (data: Partial<ProfileState['formData']>) => void
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void
  clear: () => void
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      id: null,
      nama: '',
      pelatihan_id: null,
      formData: {
        nama: "",
        nip: "",
        instansi: "",
        jenisInstansi: "",
        domisili: "",
        jabatan: "",
        pelatihan: "",
        tahunPelatihan: "",
        jenisLembagaPenyelenggara: "",
        lembagaPenyelenggara: "",
        domisiliLembagaPenyelenggara: "",
        handphone: "",
      },
      setProfile: (data) =>
        set((state) => ({ ...state, ...data })),
      setFormData: (data) =>        set((state) => ({ 
          ...state, 
          formData: { ...state.formData, ...data } 
        })),
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      clear: () =>
        set({
          id: null,
          nama: '',
          pelatihan_id: null,
          formData: {
            nama: "",
            nip: "",
            instansi: "",
            jenisInstansi: "",
            domisili: "",
            jabatan: "",
            pelatihan: "",
            tahunPelatihan: "",
            jenisLembagaPenyelenggara: "",
            lembagaPenyelenggara: "",
            domisiliLembagaPenyelenggara: "",
            handphone: "",
          },
          hasHydrated: true,
        }),
    }),    {
      name: 'profile-storage',
      storage: createJSONStorage(() => localStorage), // Explicitly use localStorage
      partialize: (state) => ({
        // Only persist these fields
        id: state.id,
        nama: state.nama,
        pelatihan_id: state.pelatihan_id,
        formData: state.formData
      }),
      onRehydrateStorage: () => (state) => {
        console.log('State hydrated from localStorage:', state);
        state?.setHasHydrated(true);
      },
    }
  )
)
