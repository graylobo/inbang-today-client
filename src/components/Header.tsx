"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Crew Ranking
        </Link>
        <div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {user.username}님 환영합니다
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-700"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
