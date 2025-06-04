import { create } from 'zustand'

type Store = {
    id: string
    username: string
    setUser: (id: string, username: string) => void
    clearUser: () => void // เพิ่มฟังก์ชัน clearUser
}

export const useUserStore = create<Store>((set) => ({
    id: "",
    username: "",
    // เก็บ firstName, lastName
    setUser: (id: string, username: string) => set((state) => ({ ...state, id, username })),
    clearUser: () => set({ id: "", username: "" }), // เพิ่มการ implement ฟังก์ชัน clearUser
}))