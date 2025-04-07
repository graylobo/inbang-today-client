"use client";

import { useRequireAdmin } from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAdmin, isSuperAdmin } = useRequireAdmin();
  const pathname = usePathname();

  if (isLoading) {
    return <div>권한을 확인하는 중...</div>;
  }

  if (!isAdmin && !isSuperAdmin) {
    return null;
  }

  // 모든 관리자가 접근 가능한 기본 메뉴
  const commonNavItems = [
    { href: "/admin/crews", label: "크루 관리" },
    { href: "/admin/members", label: "멤버 관리" },
    { href: "/admin/signatures", label: "시그니처 관리" },
  ];

  // SuperAdmin만 접근 가능한 메뉴
  const superAdminNavItems = [
    { href: "/admin/permissions", label: "권한 관리" },
  ];

  // 접근 권한에 따라 보여줄 메뉴 구성
  const navItems = isSuperAdmin
    ? [...commonNavItems, ...superAdminNavItems]
    : commonNavItems;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-lg font-bold">관리자 페이지</span>
                {isSuperAdmin && (
                  <span className="ml-2 px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                    슈퍼 관리자
                  </span>
                )}
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      pathname === item.href
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
