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

  if (boardLoading || postsLoading) return <div>로딩 중...</div>;
  if (!board) return <div>게시판을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{board.name}</h1>
        <button
          onClick={() => setShowPostForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          글쓰기
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {posts?.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            아직 게시글이 없습니다.
          </div>
        ) : (
          <div className="divide-y">
            {posts?.map((post) => (
              <Link
                key={post.id}
                href={`/boards/${board.slug}/${post.id}`}
                className="block p-4 hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium">{post.title}</h2>
                    <div className="mt-1 text-sm text-gray-600">
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
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
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
