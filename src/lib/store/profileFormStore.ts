import { create } from "zustand";

interface ProfileFormState {
  form: {
    namaAlumni: string;
    jabatanAlumni: string;
    namaAnda: string;
    jenisInstansi: string;
    instansi: string;
    jabatanAnda: string;
    hubungan: string;
    pelatihan: string;
  };
  setForm: (form: Partial<ProfileFormState["form"]>) => void;
  resetForm: () => void;
}

const initialForm = {
  namaAlumni: "",
  jabatanAlumni: "",
  namaAnda: "",
  jenisInstansi: "",
  instansi: "",
  jabatanAnda: "",
  hubungan: "",
  pelatihan: "",
};

export const useProfileFormStore = create<ProfileFormState>((set) => ({
  form: { ...initialForm },
  setForm: (form) => set((state) => ({ form: { ...state.form, ...form } })),
  resetForm: () => set({ form: { ...initialForm } }),
}));
