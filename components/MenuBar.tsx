"use client";
import React from "react";
import { useRouter } from "next/navigation";

const MenuBar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex justify-around bg-white shadow-md rounded-xl p-4 space-x-4">
      <button
        onClick={() => router.push("/transactions")}
        className="flex-1 bg-[#4200C5] text-white py-2 rounded-lg hover:bg-[#5930d9] transition"
      >
        บันทึกรายการ
      </button>
      <button
        onClick={() => router.push("/categories")}
        className="flex-1 bg-[#78A3D4] text-white py-2 rounded-lg hover:bg-[#5e90c9] transition"
      >
        จัดหมวดหมู่
      </button>
      <button
        onClick={() => router.push("/summary")}
        className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition"
      >
        สรุปผล
      </button>
    </div>
  );
};

export default MenuBar;
