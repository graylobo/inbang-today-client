"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import PostForm from "@/components/board/PostForm";
import Modal from "@/components/common/Modal";
import { useBoardBySlug, usePosts } from "@/hooks/board/useBoards";

export default function BoardPage({ params }: { params: { slug: string } }) {
  const { user } = useAuthStore();
  const [showPostForm, setShowPostForm] = useState(false);
  const { data: board, isLoading: boardLoading } = useBoardBySlug(params.slug);
  const { data: posts, isLoading: postsLoading } = usePosts(board?.id || 0);

  if (boardLoading || postsLoading)
    return <div className="dark:text-gray-300">로딩 중...</div>;
  if (!board)
    return <div className="dark:text-gray-300">게시판을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-gray-100">{board.name}</h1>
        <Link
          href={`/boards/${board.slug}/write`}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          글쓰기
        </Link>
      </div>

      <div className="bg-white dark:bg-dark-bg rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700 overflow-hidden">
        {posts?.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            아직 게시글이 없습니다.
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {posts?.map((post) => (
              <Link
                key={post.id}
                href={`/boards/${board.slug}/${post.id}`}
                className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium dark:text-gray-100">
                      {post.title}
                    </h2>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {post.author ? (
                        <span>{post.author.username}</span>
                      ) : (
                        <span>{post.authorName}</span>
                      )}
                      <span className="mx-2">·</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>조회 {post.viewCount}</span>
                    <span>댓글 {post.comments.length}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showPostForm}
        onClose={() => setShowPostForm(false)}
        title="글쓰기"
      >
        <PostForm
          board={board}
          onSuccess={() => setShowPostForm(false)}
          user={user}
        />
      </Modal>
    </div>
  );
}
