import { create } from "zustand";

export type ProfileForm = {
  id?: string;
  namaAlumni: string;
  jabatanAlumni: string;
  namaAnda: string;
  jenisInstansi: string;
  instansi: string;
  jabatanAnda: string;
  hubungan: string;
  pelatihan: string;
};

export const useProfileFormStore = create<{
  form: ProfileForm;
  setForm: (form: Partial<ProfileForm>) => void;
}>((set) => ({
  form: {
    id: "",
    namaAlumni: "",
    jabatanAlumni: "",
    namaAnda: "",
    jenisInstansi: "",
    instansi: "",
    jabatanAnda: "",
    hubungan: "",
    pelatihan: "",
  },
  setForm: (form) =>
    set((state) => ({
      form: { ...state.form, ...form },
    })),
}));