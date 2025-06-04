"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user";
import Link from "next/link";

function MenuBar() {
  const router = useRouter();
  const username = useUserStore((state) => state.username);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    clearUser();
    router.push("/");
    alert("ออกจากระบบสำเร็จแล้ว");
  };

  return (
    <nav className="bg-[#4200C5] text-white p-4 flex justify-between items-center shadow-md">
      <div className="font-bold text-lg">ระบบจัดการการเงิน</div>
      {username ? (
        <div className="flex items-center space-x-4">
          <Link
            href="/transactions"
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            รายการ
          </Link>
          <Link
            href="/summary"
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-green-500 hover:bg-green-600 transition-colors"
          >
            สรุป
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors"
          >
            ออกจากระบบ
          </button>
          <div className="font-bold text-lg">
            ผู้ใช้งาน: <span className="font-semibold">{username}</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-300">(ยังไม่ได้เข้าสู่ระบบ)</div>
      )}
    </nav>
  );
}

export default MenuBar;
