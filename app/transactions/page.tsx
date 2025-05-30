'use client';

import { useState, useEffect, useTransition } from 'react';
import { saveTransaction } from './action';

function MenuBar() {
  return (
    <nav className="bg-[#4200C5] text-white p-4 flex justify-between items-center shadow-md">
      <div className="font-bold text-lg">ระบบจัดการการเงิน</div>
      <div className="space-x-6">
        <a href="/transactions" className="hover:underline">
          บันทึกรายรับ/รายจ่าย
        </a>
        <a href="/categories" className="hover:underline">
          หมวดหมู่
        </a>
      </div>
    </nav>
  );
}

export default function TransactionsPage() {
  const [type, setType] = useState<'รายรับ' | 'รายจ่าย'>('รายรับ');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // โหลดหมวดหมู่จาก localStorage ตามประเภท
  function loadCategories(currentType: 'รายรับ' | 'รายจ่าย') {
    const stored = localStorage.getItem('categories');
    if (stored) {
      try {
        const allCategories = JSON.parse(stored) as { id: string; name: string; type: string }[];
        const filtered = allCategories
          .filter((c) => c.type === currentType)
          .map((c) => c.name);
        setCategories(filtered);
        setCategory(filtered.length > 0 ? filtered[0] : '');
      } catch {
        setCategories([]);
        setCategory('');
      }
    } else {
      setCategories([]);
      setCategory('');
    }
  }

  // ตั้งหมวดหมู่เริ่มต้นใน localStorage ถ้ายังไม่มี
  useEffect(() => {
    const stored = localStorage.getItem('categories');
    if (!stored) {
      const initialCategories = [
        { id: '1', name: 'เงินเดือน', type: 'รายรับ' },
        { id: '2', name: 'อาหาร', type: 'รายจ่าย' },
        { id: '3', name: 'ค่าเดินทาง', type: 'รายจ่าย' },
        { id: '4', name: 'ของใช้ส่วนตัว', type: 'รายจ่าย' },
        { id: '5', name: 'อื่นๆ', type: 'รายจ่าย' },
      ];
      localStorage.setItem('categories', JSON.stringify(initialCategories));
    }
    loadCategories(type);
  },);

  // โหลดหมวดหมู่เมื่อเปลี่ยนประเภท
  useEffect(() => {
    loadCategories(type);
  }, [type]);

  // ฟัง event กรณีหมวดหมู่มีการอัพเดต (จากหน้าอื่น ๆ)
  useEffect(() => {
    function onCategoriesUpdated() {
      loadCategories(type);
    }
    window.addEventListener('categoriesUpdated', onCategoriesUpdated);
    return () => window.removeEventListener('categoriesUpdated', onCategoriesUpdated);
  }, [type]);

  // ส่งข้อมูลบันทึก
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('กรุณากรอกจำนวนเงินให้ถูกต้อง');
      return;
    }
    if (!category) {
      alert('กรุณาเลือกหมวดหมู่');
      return;
    }

    const formData = new FormData();
    formData.append('type', type);
    formData.append('amount', amount);
    formData.append('category', category);

    startTransition(() => {
      saveTransaction(formData)
        .then(() => {
          setAmount('');
          alert('✅ บันทึกสำเร็จ');
        })
        .catch((err) => alert('❌ บันทึกล้มเหลว: ' + err.message));
    });
  };

  return (
    <div className="bg-[#78A3D4] min-h-screen flex flex-col text-[#4200C5]">
      <MenuBar />
      <main className="flex-grow flex flex-col items-center px-4">
        <div className="bg-[#FFFFFF] p-8 rounded-md shadow-md w-full max-w-md mt-10 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#4200C5]">
            หน้าบันทึกรายรับ/รายจ่าย
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* เลือกประเภท */}
            <div>
              <label className="block font-semibold mb-2 text-[#4200C5]">เลือกประเภท</label>
              <select
                value={type}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'รายรับ' || val === 'รายจ่าย') setType(val);
                }}
                className="w-full border border-[#78A3D4] rounded px-4 py-3 text-[#4200C5] focus:outline-none focus:ring-2 focus:ring-[#222CF3] transition"
                required
              >
                <option value="รายรับ">รายรับ</option>
                <option value="รายจ่าย">รายจ่าย</option>
              </select>
            </div>

            {/* หมวดหมู่ */}
            <div>
              <label className="block font-semibold mb-2 text-[#4200C5]">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#78A3D4] rounded px-4 py-3 text-[#4200C5] focus:outline-none focus:ring-2 focus:ring-[#222CF3] transition"
                disabled={categories.length === 0}
                required
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))
                ) : (
                  <option value="">-- ไม่มีหมวดหมู่ --</option>
                )}
              </select>
            </div>

            {/* จำนวนเงิน */}
            <div>
              <label className="block font-semibold mb-2 text-[#4200C5]">จำนวนเงิน</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="กรอกจำนวนเงิน"
                className="w-full border border-[#78A3D4] rounded px-4 py-3 text-[#4200C5] focus:outline-none focus:ring-2 focus:ring-[#222CF3] transition"
                required
              />
            </div>

            {/* ปุ่มบันทึก */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#222CF3] text-white rounded border border-[#78A3D4] px-6 py-3 font-semibold hover:bg-[#1a22b0] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}