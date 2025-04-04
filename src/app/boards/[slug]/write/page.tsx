"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import PostForm from "@/components/board/PostForm";
import { useBoardBySlug } from "@/hooks/board/useBoards";
import { use } from "react";

type WritePageParams = Promise<{
  slug: string;
}>;

export default function WritePage(props: { params: WritePageParams }) {
  const { slug } = use(props.params);
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: board, isLoading } = useBoardBySlug(slug);

  if (isLoading) return <div className="dark:text-gray-300">로딩 중...</div>;
  if (!board)
    return <div className="dark:text-gray-300">게시판을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-dark-bg rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold mb-6 dark:text-gray-100">글쓰기</h1>
        <PostForm
          board={board}
          onSuccess={() => router.push(`/boards/${board.slug}`)}
          user={user}
        />
      </div>
    </div>
  );
}
