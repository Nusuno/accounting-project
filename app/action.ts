'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function Login(username: string, password: string) {
    const user = await prisma.user.findFirst({ where: { username: username, } });

    if (!user) {
        return false;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
        return user
    }

    return false
}