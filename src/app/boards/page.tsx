"use client";

import { useBoards } from "@/hooks/board/useBoards";
import Link from "next/link";

export default function BoardsPage() {
  const { data: boards, isLoading } = useBoards();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">게시판 목록</h1>
      <div className="grid gap-4">
        {boards?.map((board) => (
          <Link
            key={board.id}
            href={`/boards/${board.slug}`}
            className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold">{board.name}</h2>
            {board.description && (
              <p className="text-gray-600 mt-1">{board.description}</p>
            )}
            {board.isAnonymous && (
              <span className="inline-block mt-2 text-sm text-blue-600">
                익명 게시판
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
