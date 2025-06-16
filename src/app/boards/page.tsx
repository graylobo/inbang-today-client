"use client";

import { useBoards } from "@/hooks/board/useBoards";
import Link from "next/link";
import SEOHead from "@/components/SEO/SEOHead";

export default function BoardsPage() {
  const { data: boards, isLoading } = useBoards();

  if (isLoading) return <div className="dark:text-gray-300">로딩 중...</div>;

  return (
    <>
      <SEOHead
        title="게시판 - 스타크래프트 커뮤니티"
        description="스타크래프트 관련 다양한 주제의 게시판입니다. 자유롭게 의견을 나누고 정보를 공유하세요."
        canonicalUrl="/boards"
        pageType="board"
      />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">
          게시판 목록
        </h1>
        <div className="grid gap-4">
          {boards?.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.slug}`}
              className="block p-4 bg-white dark:bg-dark-bg rounded-lg shadow hover:shadow-md dark:shadow-none dark:border dark:border-gray-700 dark:hover:border-gray-600 transition-all"
            >
              <h2 className="text-lg font-semibold dark:text-gray-100">
                {board.name}
              </h2>
              {board.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {board.description}
                </p>
              )}
              {board.isAnonymous && (
                <span className="inline-block mt-2 text-sm text-blue-600 dark:text-blue-400">
                  익명 게시판
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
