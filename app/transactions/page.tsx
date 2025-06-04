"use client";

import { useState, useEffect, useTransition } from "react";
import { useUserStore } from "@/store/user";
import { useRouter } from "next/navigation"; // Import useRouter
import MenuBar from "@/components/MenuBar";
import { createTransactionAction as saveTransactionAction } from "./action";

interface Category {
  id: string;
  name: string;
  type: "รายรับ" | "รายจ่าย";
}
export default function TransactionsPage() {
  const router = useRouter(); // ใช้ useRouter
  const [type, setType] = useState<"รายรับ" | "รายจ่าย">("รายรับ");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryNameInput, setCategoryNameInput] = useState("");
  const { id: currentUserId, username: currentUsernameInStore } = useUserStore();

  // ตรวจสอบการล็อกอินและ redirect หากไม่ได้ล็อกอิน
  useEffect(() => {
    if (!currentUsernameInStore) {
      router.push("/"); // Redirect ไปหน้า login
    }
  }, [currentUsernameInStore, router]); // เพิ่ม router ใน dependency array

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
      alert("ข้อมูลไม่ถูกต้อง: กรุณากรอกจำนวนเงินและเลือกหมวดหมู่ให้ถูกต้อง");
      return;
    }
    if (!currentUserId) {
      alert("ไม่พบข้อมูลผู้ใช้ปัจจุบัน กรุณาล็อกอินอีกครั้ง");
      return;
    }

    const formDataPayload = new FormData();
    formDataPayload.append("amount", parsedAmount.toString());
    formDataPayload.append("type", type === "รายรับ" ? "INCOME" : "EXPENSE");
    formDataPayload.append("category", category);
    formDataPayload.append("userId", currentUserId);

    startTransition(() => {
      saveTransactionAction(formDataPayload)
        .then((response) => {
          if (response.success) {
            setAmount("");
            alert(response.message || "✅ บันทึกสำเร็จ!");
          } else {
            const errorMessage =
              response.message || "❌ เกิดข้อผิดพลาดในการบันทึก";
            if (response.errors) {
              console.error("Validation errors:", response.errors);
            }
            alert(errorMessage);
          }
        })
        .catch((err) => {
          console.error("Submit error:", err);
          alert(
            "❌ เกิดข้อผิดพลาดในการส่งข้อมูล: " +
              (err.message || "กรุณาลองใหม่อีกครั้ง")
          );
        });
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
              <label htmlFor="type-select">เลือกประเภท</label>
              <select
                id="type-select"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "รายรับ" | "รายจ่าย")
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="รายรับ">รายรับ</option>
                <option value="รายจ่าย">รายจ่าย</option>
              </select>
            </div>

            <div>
              <label htmlFor="category-select">หมวดหมู่</label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={filteredCategories.length === 0}
              >
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))
                ) : (
                  <option value="">-- ไม่มีหมวดหมู่สำหรับประเภทนี้ --</option>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="amount-input">จำนวนเงิน</label>
              <input
                id="amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#222CF3] text-white py-2 rounded disabled:opacity-50"
            >
              {isPending ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md mb-10">
          <h3 className="text-xl font-semibold mb-4">
            จัดการหมวดหมู่ ({type})
          </h3>

          <div className="flex mb-4 gap-2">
            <input
              value={categoryNameInput}
              onChange={(e) => setCategoryNameInput(e.target.value)}
              placeholder="ชื่อหมวดหมู่ใหม่"
              className="flex-1 border border-gray-300 px-3 py-2 rounded-md"
            />
            {editingCategory ? (
              <>
                <button
                  onClick={handleUpdateCategory}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryNameInput("");
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded"
                >
                  ยกเลิก
                </button>
              </>
            ) : (
              <button
                onClick={handleAddCategory}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                เพิ่ม
              </button>
            )}
          </div>

          {filteredCategories.length > 0 ? (
            <ul className="space-y-2">
              {filteredCategories.map((cat) => (
                <li
                  key={cat.id}
                  className="flex justify-between items-center border border-gray-200 p-2 rounded"
                >
                  <span>{cat.name}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCategoryNameInput(cat.name);
                      }}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              ไม่มีหมวดหมู่สำหรับ {type}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
