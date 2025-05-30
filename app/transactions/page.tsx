'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';

export default function TransactionsPage() {
  const [type, setType] = useState('รายจ่าย');
  const [category, setCategory] = useState('🍞');
  const [amount, setAmount] = useState('');
  const userStore = useUserStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: category,
        amount: parseFloat(amount),
        type: type === 'รายรับ' ? 'INCOME' : 'EXPENSE',
        category,
      }),
    });

    if (res.ok) {
      alert('บันทึกเรียบร้อยแล้ว');
      setAmount('');
    } else {
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="bg-[#78A3D4] min-h-screen flex flex-col items-center text-black">
      {/* Header nav */}
      <div className="w-full max-w-md flex justify-between bg-white px-6 py-3 shadow-sm rounded-b-md">
        <button
          onClick={() => router.push('/category')}
          className="text-blue-700 font-semibold hover:underline"
        >
          จัดหมวดหมู่
        </button>
        <button
          onClick={() => router.push('/summary')}
          className="text-blue-700 font-semibold hover:underline"
        >
          สรุปผล
        </button>
      </div>

      {/* Main content */}
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mt-6">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">บันทึกรายการ</h2>
        <p className='text-black font-xl text-center'>สวัสดี {userStore.username}</p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-purple-700 font-semibold mb-1">รายรับ/รายจ่าย</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-blue-300 rounded px-4 py-2"
            >
              <option>รายรับ</option>
              <option>รายจ่าย</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">หมวดหมู่</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-blue-300 rounded px-4 py-2"
            >
              <option value="อาหาร">🍞 อาหาร</option>
              <option value="ค่าเดินทาง">🚌 ค่าเดินทาง</option>
              <option value="เสื้อผ้า">👕 เสื้อผ้า</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">จำนวนเงิน</label>
            <div className="flex items-center border border-blue-300 rounded px-2 py-2">
              <span className="mr-2 text-xl">฿</span>
              <input
                type="number"
                step="0.01"
                className="w-full focus:outline-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="ใส่จำนวนเงิน"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded mt-4"
          >
            บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}
