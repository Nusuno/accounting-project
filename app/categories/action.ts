'use server';

import { v4 as uuidv4 } from 'uuid';

type Category = {
  id: string;
  name: string;
  type: 'รายรับ' | 'รายจ่าย';
};

// จำลองฐานข้อมูลชั่วคราว (In-memory)
let categoryList: Category[] = [
  { id: '1', name: 'เงินเดือน', type: 'รายรับ' },
  { id: '2', name: 'อาหาร', type: 'รายจ่าย' },
  { id: '3', name: 'ค่าเดินทาง', type: 'รายจ่าย' },
  { id: '4', name: 'ของใช้ส่วนตัว', type: 'รายจ่าย' },
  { id: '5', name: 'อื่นๆ', type: 'รายจ่าย' },
];

export async function getCategories(): Promise<Category[]> {
  return categoryList;
}

export async function addCategory(name: string, type: 'รายรับ' | 'รายจ่าย') {
  categoryList.push({ id: uuidv4(), name, type });
}

export async function deleteCategory(id: string) {
  categoryList = categoryList.filter((c) => c.id !== id);
}

export async function updateCategory(id: string, newName: string) {
  const cat = categoryList.find((c) => c.id === id);
  if (cat) cat.name = newName;
}
