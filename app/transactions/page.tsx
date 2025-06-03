"use client";

import { useState, useEffect, useTransition } from "react";

// อยู่ในไฟล์เดียวกันด้านบนสุดเลยก็ได้
async function saveTransaction(formData: FormData) {
  // จำลองการบันทึกข้อมูล (จริงๆ ตรงนี้ควรส่งไปยัง backend)
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log("บันทึกข้อมูล:", {
        type: formData.get("type"),
        amount: formData.get("amount"),
        category: formData.get("category"),
      });
      resolve();
    }, 500); // mock delay
  });
}

function MenuBar() {
  return (
    <nav className="bg-[#4200C5] text-white p-4 flex justify-between items-center shadow-md">
      <div className="font-bold text-lg">ระบบจัดการการเงิน</div>
    </nav>
  );
}

interface Category {
  id: string;
  name: string;
  type: "รายรับ" | "รายจ่าย";
}

export default function TransactionsPage() {
  const [type, setType] = useState<"รายรับ" | "รายจ่าย">("รายรับ");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("categories");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Category[];
        setCategories(parsed);
      } catch {
        setCategories([]);
      }
    } else {
      const initial: Category[] = [
        { id: "1", name: "เงินเดือน", type: "รายรับ" },
        { id: "2", name: "อาหาร", type: "รายจ่าย" },
      ];
      localStorage.setItem("categories", JSON.stringify(initial));
      setCategories(initial);
    }
  }, []);

  const filteredCategories = categories.filter((c) => c.type === type);

  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].name);
    } else {
      setCategory("");
    }
  }, [type, categories]);

  const saveCategoriesToLocalStorage = (updated: Category[]) => {
    localStorage.setItem("categories", JSON.stringify(updated));
    setCategories(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || !category) {
      alert("ข้อมูลไม่ถูกต้อง");
      return;
    }
    const formData = new FormData();
    formData.append("type", type);
    formData.append("amount", amount);
    formData.append("category", category);

    startTransition(() => {
      saveTransaction(formData)
        .then(() => {
          setAmount("");
          alert("✅ บันทึกสำเร็จ");
        })
        .catch((err) => alert("❌ ล้มเหลว: " + err.message));
    });
  };

  const handleAddCategory = () => {
    if (!categoryNameInput.trim()) return;
    const newCat: Category = {
      id: Date.now().toString(),
      name: categoryNameInput.trim(),
      type,
    };
    saveCategoriesToLocalStorage([...categories, newCat]);
    setCategoryNameInput("");
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("แน่ใจว่าต้องการลบหมวดหมู่นี้?")) {
      const updated = categories.filter((c) => c.id !== id);
      saveCategoriesToLocalStorage(updated);
    }
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !categoryNameInput.trim()) return;
    const updated = categories.map((c) =>
      c.id === editingCategory.id ? { ...c, name: categoryNameInput.trim() } : c
    );
    saveCategoriesToLocalStorage(updated);
    setEditingCategory(null);
    setCategoryNameInput("");
  };

  return (
    <div className="bg-[#78A3D4] min-h-screen flex flex-col text-[#4200C5]">
      <MenuBar />
      <main className="flex-grow flex flex-col items-center px-4">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md mt-10 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6">
            บันทึกรายรับ/รายจ่าย
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>เลือกประเภท</label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "รายรับ" | "รายจ่าย")
                }
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#4200C5] focus:border-[#4200C5]"
              >
                {" "}
                <option value="รายรับ">รายรับ</option>
                <option value="รายจ่าย">รายจ่าย</option>
              </select>
            </div>

            <div>
              <label>หมวดหมู่</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#4200C5] focus:border-[#4200C5]"
              >
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="">-- ไม่มีหมวดหมู่ --</option>
                )}
              </select>
            </div>

            <div>
              <label>จำนวนเงิน</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#4200C5] focus:border-[#4200C5]"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#222CF3] text-white py-2 rounded"
            >
              {isPending ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </form>
        </div>

        {/* จัดการหมวดหมู่ */}
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
          <h3 className="text-xl font-semibold mb-4">
            จัดการหมวดหมู่ ({type})
          </h3>

          <div className="flex mb-4 gap-2">
            <input
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              placeholder="ชื่อหมวดหมู่"
              className="flex-1 border px-3 py-2"
            />
            {editingCategory ? (
              <>
                <button
                  onClick={handleUpdateCategory}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryNameInput("");
                  }}
                  className="text-gray-500"
                >
                  ยกเลิก
                </button>
              </>
            ) : (
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                เพิ่ม
              </button>
            )}
          </div>

          <ul className="space-y-2">
            {filteredCategories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{cat.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setCategoryNameInput(cat.name);
                    }}
                    className="text-yellow-600"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-red-600"
                  >
                    ลบ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
