'use client';

import { useState, useTransition } from 'react';
import { saveTransaction } from './action';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user';

export default function TransactionsPage() {
  const [type, setType] = useState('รายจ่าย');
  const [amount, setAmount] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const userStore = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('type', type);
    formData.append('amount', amount);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }

    startTransition(() => {
      saveTransaction(formData, userStore.id)
        .then(() => {
          if (type === 'รายรับ') {
            setTotalIncome((prev) => prev + parsedAmount);
          } else {
            setTotalExpense((prev) => prev + parsedAmount);
          }
          setAmount('');
          alert('✅ บันทึกสำเร็จ');
        })
        .catch((err) => alert('❌ บันทึกล้มเหลว: ' + err.message));
    });
  };

  return (
    <div className="bg-[#78A3D4] min-h-screen flex flex-col items-center text-black">
      {/* ... Header omitted ... */}
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mt-6">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">บันทึกรายการ</h2>
        <p className='text-black font-xl text-center'>สวัสดี {userStore.username}</p>

        <div className="flex justify-center gap-6 mb-6">
          <div className="border-2 border-green-600 rounded-md px-8 py-6 text-center text-green-700 font-semibold">
            <span>รายรับ</span>
            <div className="text-2xl">
              {totalIncome.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
            </div>
          </div>
          <div className="border-2 border-red-600 rounded-md px-8 py-6 text-center text-red-700 font-semibold">
            <span>รายจ่าย</span>
            <div className="text-2xl">
              {totalExpense.toLocaleString('th-TH', { style: 'currency', currency: 'THB' })}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-700 font-semibold mb-1">รายรับ/รายจ่าย</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border border-blue-300 rounded px-4 py-2"
              name="type"
            >
              <option>รายรับ</option>
              <option>รายจ่าย</option>
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
                name="amount"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded mt-4"
          >
            {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </form>
      </div>
    </div>
  );
}
