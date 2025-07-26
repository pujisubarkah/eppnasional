import { create } from "zustand";
import { persist } from "zustand/middleware";

// Removed duplicate local interface

export interface ProfileFormState {
  id?: string;
  nama: string;
  nip: string;
  instansi: string;
  jenisInstansi: string;
  domisili: string;
  jabatan: string;
  pelatihan: string;
  tahunPelatihan: string;
  lembagaPenyelenggara: string;
  handphone: string;
  setForm: (fields: Partial<ProfileFormState>) => void;
}
export const useProfileFormStore = create<ProfileFormState>()(
  persist<ProfileFormState>(
    (set) => ({
      id: undefined,
      nama: "",
      nip: "",
      instansi: "",
      jenisInstansi: "",
      domisili: "",
      jabatan: "",
      pelatihan: "",
      tahunPelatihan: "",
      lembagaPenyelenggara: "",
      handphone: "",
      setForm: (fields) => set((state) => ({ ...state, ...fields })),
    }),
    {
      name: "profile-form-store", // nama key di localStorage
    }
  )
);
