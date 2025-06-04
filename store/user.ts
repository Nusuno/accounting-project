import { create } from 'zustand'

type Store = {
    id: string
    username: string
    setUser: (id: string, username: string) => void
    clearUser: () => void 
}

export const useUserStore = create<Store>((set) => ({
    id: "",
    username: "",
    setUser: (id: string, username: string) => set((state) => ({ ...state, id, username })),
    clearUser: () => set({ id: "", username: "" }), 
}))