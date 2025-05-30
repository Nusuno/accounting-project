"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";

const MenuBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const getButtonClass = (path: string) =>
    `flex-1 py-2 rounded-lg text-sm font-semibold transition-shadow duration-300 ${
      pathname === path
        ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg"
        : "bg-white text-[#4200C5] border border-[#4200C5] hover:bg-indigo-100 hover:shadow-md"
    }`;

  return (
    <div className="w-full max-w-4xl mx-auto flex justify-around items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl shadow-xl sticky top-0 z-50">
      <button onClick={() => router.push("/transactions")} className={getButtonClass("/transactions")}>
        บันทึกรายการ
      </button>
      <button onClick={() => router.push("/categories")} className={getButtonClass("/categories")}>
        จัดหมวดหมู่
      </button>
      <button onClick={() => router.push("/summary")} className={getButtonClass("/summary")}>
        สรุปผล
      </button>
    </div>
  );
};

export default MenuBar;
