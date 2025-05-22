'use server'

import { prisma } from "@/lib/prisma"

// ============================================================================
// LOGIN FUNCTIONALITY
// ============================================================================

/**
 * ทำการยืนยันตัวตนผู้ใช้ (Login)
 * @param username - ชื่อผู้ใช้
 * @param password - รหัสผ่าน
 * @returns True หากการยืนยันตัวตนสำเร็จ, False หากไม่สำเร็จ
 * @remarks ข้อควรระวัง: ฟังก์ชันนี้ปัจจุบันเปรียบเทียบรหัสผ่านแบบข้อความธรรมดา (plain text)
 *          ในระบบที่ใช้งานจริง ควรทำการ hash รหัสผ่านก่อนจัดเก็บและเปรียบเทียบเสมอเพื่อความปลอดภัย
 */
export async function Login(username: string, password: string) {
  // ค้นหาผู้ใช้ด้วย username ที่ระบุ
  const user = await prisma.user.findFirst({ where: { username: username } });

  // ตรวจสอบว่าพบผู้ใช้หรือไม่
  if (user) {
    // หากพบผู้ใช้, ตรวจสอบว่ารหัสผ่านที่ป้อนเข้ามาตรงกับรหัสผ่านที่เก็บไว้หรือไม่
    // คำเตือน: การเปรียบเทียบรหัสผ่านแบบ Plain text ไม่ปลอดภัยอย่างยิ่ง
    if (user.password === password) {
      return true // การยืนยันตัวตนสำเร็จ
    } else {
      return false // รหัสผ่านไม่ถูกต้อง
    }
  } else {
    return false // ไม่พบผู้ใช้
  }
}

// ============================================================================
// REGISTRATION FUNCTIONALITY
// ============================================================================

/**
 * ทำการลงทะเบียนผู้ใช้ใหม่ (Register)
 * @param username - ชื่อผู้ใช้ที่ต้องการลงทะเบียน
 * @param password - รหัสผ่านสำหรับผู้ใช้ใหม่
 * @returns True หากการลงทะเบียนสำเร็จ, False หากชื่อผู้ใช้นี้ถูกใช้งานแล้ว
 * @remarks ข้อควรระวัง: ฟังก์ชันนี้ปัจจุบันจัดเก็บรหัสผ่านเป็นข้อความธรรมดา (plain text)
 *          ในระบบที่ใช้งานจริง ควรทำการ hash รหัสผ่านก่อนจัดเก็บลงในฐานข้อมูลเสมอเพื่อความปลอดภัย
 */
export async function Register(username: string, password: string) {
  // ตรวจสอบว่ามีชื่อผู้ใช้นี้อยู่ในระบบแล้วหรือยัง
  const existingUser = await prisma.user.findUnique({
    where: { username: username },
  });

  // หากมีชื่อผู้ใช้นี้แล้ว, การลงทะเบียนล้มเหลว
  if (existingUser) {
    return false; // ชื่อผู้ใช้นี้ถูกใช้แล้ว
  }

  // หากชื่อผู้ใช้ยังว่าง, สร้างผู้ใช้ใหม่
  // คำเตือน: การจัดเก็บรหัสผ่านแบบ Plain text ไม่ปลอดภัยอย่างยิ่ง
  await prisma.user.create({
    data: {
      username: username,
      password: password, // ควรทำการ hash รหัสผ่านตรงนี้ก่อนบันทึก
    },
  });

  return true; // การลงทะเบียนสำเร็จ
}