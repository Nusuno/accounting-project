'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

/**
 * เข้าสู่ระบบ
 */
export async function Login(username: string, password: string): Promise<boolean> {
  const user = await prisma.user.findFirst({ where: { username } });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  }
  return false;
}

/**
 * สมัครสมาชิก
 */
export async function Register(username: string, password: string): Promise<boolean> {
  try {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return false;

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        username,
        password: hashed,
      },
    });

    return true;
  } catch (error) {
    console.error('Register error:', error);
    return false;
  }
}
