'use client';

import { useState, useEffect, useTransition } from 'react';
import { saveTransaction } from './action';

function MenuBar() {
  return (
    <nav className="bg-[#4200C5] text-white p-4 flex justify-between items-center">
      <div className="font-bold text-lg">ระบบจัดการการเงิน</div>
      <div className="space-x-6">
        <a href="/transactions" className="hover:underline">
          บันทึกรายรับ/รายจ่าย
        </a>
        <a href="/categories" className="hover:underline">
          หมวดหมู่
        </a>
        {/* เพิ่มลิงก์เมนูอื่น ๆ ได้ที่นี่ */}
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

  function loadCategories(currentType: 'รายรับ' | 'รายจ่าย') {
    const stored = localStorage.getItem('categories');
    if (stored) {
      try {
        const allCategories = JSON.parse(stored) as { id: string; name: string; type: string }[];
        const filtered = allCategories.filter((c) => c.type === currentType).map((c) => c.name);
        setCategories(filtered);
        if (filtered.length > 0) {
          setCategory(filtered[0]);
        } else {
          setCategory('');
        }
      } catch {
        setCategories([]);
        setCategory('');
      }
    } else {
      setCategories([]);
      setCategory('');
    }
  }

  useEffect(() => {
    loadCategories(type);
  }, [type]);

  useEffect(() => {
    function onCategoriesUpdated() {
      loadCategories(type);
    }
    window.addEventListener('categoriesUpdated', onCategoriesUpdated);
    return () => window.removeEventListener('categoriesUpdated', onCategoriesUpdated);
  }, [type]);

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
      <main className="flex-grow flex flex-col items-center">
        <div className="bg-[#FFFFFF] p-8 rounded-md shadow-md w-full max-w-md mt-10 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#4200C5]">
            หน้าบันทึกรายรับ/รายจ่าย
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-[#4200C5]">เลือกประเภท</label>
              <select
                value={type}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'รายรับ' || val === 'รายจ่าย') setType(val);
                }}
                className="w-full border border-[#78A3D4] rounded px-4 py-2 text-[#4200C5]"
              >
                {['รายรับ', 'รายจ่าย'].map((t) => (
                  <option key={t} className="text-[#4200C5]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-[#4200C5]">หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-[#78A3D4] rounded px-4 py-2 text-[#4200C5]"
                disabled={categories.length === 0}
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

            <div>
              <label className="block font-semibold mb-1 text-[#4200C5]">จำนวนเงิน</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="กรอกจำนวนเงิน"
                className="w-full border border-[#78A3D4] rounded px-4 py-2 text-[#4200C5]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#4200C5] text-white rounded px-4 py-2 font-semibold hover:bg-[#2C007A] transition"
            >
              บันทึก
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
