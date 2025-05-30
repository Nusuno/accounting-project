import { create } from 'zustand'

type Store = {
    id: string
    username: string
    setUser: (id: string, username: string) => void
}

export const useUserStore = create<Store>((set) => ({
    id: "",
    username: "",
    // เก็บ firstName, lastName
    setUser: (id: string, username: string) => set((state) => ({...state, id, username}))
}))