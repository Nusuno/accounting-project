"use client";

import { useState } from "react";
import { useUserStore } from "@/store/user";
import MenuBar from "@/components/MenuBar";
// import router from "next/router";

export default function TransactionsPage() {
  const [type, setType] = useState("รายจ่าย");
  const [category, setCategory] = useState("🍞");
  const [amount, setAmount] = useState("");

  const userStore = useUserStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ type, category, amount });
    // TODO: call backend or API here
  };

  return (
    <div className="bg-[#78A3D4] min-h-screen flex justify-center items-center text-black">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <MenuBar/>
        <br />
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">
          บันทึกรายการ
        </h2>
        <p className="text-black font-xl text-center">
          สวัสดี {userStore.username}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-700 font-semibold mb-1">
              รายรับ/รายจ่าย
            </label>
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
            <label className="block text-purple-700 font-semibold mb-1">
              หมวดหมู่
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-blue-300 rounded px-4 py-2"
            >
              <option value="อาหาร">🍞 อาหาร</option>
              <option value="ค่าเดินทาง">🚌ค่าเดินทาง</option>
              <option value="เสื้อผ้า">👕เสื้อผ้า</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-700 font-semibold mb-1">
              จำนวนเงิน
            </label>
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
