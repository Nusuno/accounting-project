'use server'

import { prisma } from "@/lib/prisma"

export async function Login(username: string, password: string) {
    const user = await prisma.user.findFirst({ where: { username: username, } });
    if (user) {
        if (user.password === password) {
            return true
        } else {
            return false 
        }
    } else {
        return false
    }
}