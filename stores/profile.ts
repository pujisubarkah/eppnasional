// ~/stores/profile.ts
// ~/stores/profile.ts
import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    id: null as string | null, // bisa untuk user_id atau profile_id
    pelatihan_id: null as string | null,
  }),
  actions: {
    setProfileData(data: { id: string, pelatihan_id: string }) {
      this.id = data.id
      this.pelatihan_id = data.pelatihan_id
    },
    clearProfileData() {
      this.id = null
      this.pelatihan_id = null
    }
  }
})
