'use client';

import { useState, useTransition, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory, updateCategory } from './action';

type Category = {
  id: string;
  name: string;
  type: 'รายรับ' | 'รายจ่าย';
};

function MenuBar() {
  return (
    <nav className="bg-[#4200C5] text-white p-4 flex justify-between items-center">
      <div className="font-bold text-lg">ระบบจัดการการเงิน</div>
      <div className="space-x-6">
        <a href="/transactions" className="hover:underline">
          บันทึกรายรับ/รายจ่าย
        </a>
        <a href="/categories" className="hover:underline font-semibold underline">
          หมวดหมู่
        </a>
        {/* เพิ่มลิงก์อื่น ๆ ได้ตามต้องการ */}
      </div>
    </nav>
  );
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [type, setType] = useState<'รายรับ' | 'รายจ่าย'>('รายรับ');
  const [adding, setAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    const data = await getCategories();
    setCategories(data);

    // เก็บ categories ลง localStorage ทุกครั้งที่ refresh
    localStorage.setItem('categories', JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!newCategoryName.trim()) return alert('กรุณากรอกชื่อหมวดหมู่');

    startTransition(() => {
      addCategory(newCategoryName.trim(), type).then(() => {
        setNewCategoryName('');
        setAdding(false);
        refresh();

        // แจ้ง event อัพเดตหมวดหมู่
        window.dispatchEvent(new Event('categoriesUpdated'));
      });
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?')) return;
    startTransition(() => {
      deleteCategory(id).then(() => {
        refresh();
        window.dispatchEvent(new Event('categoriesUpdated'));
      });
    });
  };

  const handleUpdate = (id: string) => {
    if (!editingName.trim()) return alert('กรุณากรอกชื่อใหม่');

    startTransition(() => {
      updateCategory(id, editingName.trim()).then(() => {
        setEditingId(null);
        setEditingName('');
        refresh();
        window.dispatchEvent(new Event('categoriesUpdated'));
      });
    });
  };

  return (
    <div className="bg-[#78A3D4] min-h-screen flex flex-col text-[#4200C5]">
      <MenuBar />
      <main className="p-8 flex-grow">
        <div className="bg-white rounded p-6 max-w-xl mx-auto shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">หมวดหมู่รายรับ/รายจ่าย</h2>

          <div>
            {['รายรับ', 'รายจ่าย'].map((t) => (
              <div key={t}>
                <h3 className="mt-4 mb-2 font-semibold">{t}</h3>
                <ul className="space-y-2">
                  {categories
                    .filter((c) => c.type === t)
                    .map((cat) => (
                      <li
                        key={cat.id}
                        className="flex justify-between items-center bg-[#F5F8FF] p-2 rounded"
                      >
                        {editingId === cat.id ? (
                          <>
                            <input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="flex-1 border border-[#78A3D4] px-2 py-1 mr-2 rounded"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUpdate(cat.id)}
                              disabled={isPending}
                              className="text-sm text-white bg-[#4200C5] px-3 py-1 rounded hover:bg-[#2C007A] transition"
                            >
                              บันทึก
                            </button>
                          </>
                        ) : (
                          <>
                            <span>{cat.name}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingId(cat.id);
                                  setEditingName(cat.name);
                                }}
                                className="text-sm text-white bg-[#4200C5] px-3 py-1 rounded hover:bg-[#2C007A] transition"
                              >
                                แก้ไข
                              </button>
                              <button
                                onClick={() => handleDelete(cat.id)}
                                className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
                              >
                                ลบ
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 max-w-md mx-auto">
            {!adding ? (
              <button
                onClick={() => setAdding(true)}
                className="flex items-center justify-center gap-2 w-full border border-[#4200C5] rounded px-4 py-2 text-[#4200C5] font-semibold hover:bg-[#4200C5] hover:text-white transition"
              >
                <span className="text-2xl">+</span> เพิ่มหมวดหมู่
              </button>
            ) : (
              <div className="flex gap-2 flex-wrap">
                <select
                  value={type}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'รายรับ' || val === 'รายจ่าย') setType(val);
                  }}
                  className="border border-[#78A3D4] rounded px-3 py-2"
                >
                  <option value="รายรับ">รายรับ</option>
                  <option value="รายจ่าย">รายจ่าย</option>
                </select>

                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="ชื่อหมวดหมู่ใหม่"
                  className="flex-1 border border-[#78A3D4] rounded px-3 py-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAdd();
                    else if (e.key === 'Escape') {
                      setAdding(false);
                      setNewCategoryName('');
                    }
                  }}
                  autoFocus
                />

                <button
                  onClick={handleAdd}
                  disabled={isPending}
                  className="bg-[#4200C5] text-white px-4 py-2 rounded border border-[#78A3D4] hover:bg-[#2C007A] transition"
                >
                  เพิ่ม
                </button>

                <button
                  onClick={() => {
                    setAdding(false);
                    setNewCategoryName('');
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded border border-gray-400 hover:bg-gray-400 hover:text-white transition"
                >
                  ยกเลิก
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
