"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { HiOutlineClipboardList, HiOutlineTag, HiOutlineChartBar } from "react-icons/hi";

const MenuBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const buttons = [
    { path: "/transactions", label: "บันทึกรายการ", icon: <HiOutlineClipboardList size={20} /> },
    { path: "/categories", label: "จัดหมวดหมู่", icon: <HiOutlineTag size={20} /> },
    { path: "/summary", label: "สรุปผล", icon: <HiOutlineChartBar size={20} /> },
  ];

  const getButtonClass = (path: string) =>
    `flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer select-none
    ${
      pathname === path
        ? "bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-lg"
        : "bg-white text-[#4200C5] border border-[#4200C5] hover:bg-indigo-100 hover:text-indigo-700 hover:shadow-md"
    }`;

  return (
    <div className="w-full max-w-4xl mx-auto flex justify-around items-center bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl shadow-xl sticky top-0 z-50">
      {buttons.map(({ path, label, icon }) => (
        <button
          key={path}
          onClick={() => router.push(path)}
          className={getButtonClass(path)}
          aria-current={pathname === path ? "page" : undefined}
          type="button"
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
};

export default MenuBar;
