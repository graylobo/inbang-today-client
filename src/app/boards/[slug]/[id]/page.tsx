"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import CommentSection from "@/components/board/CommentSection";
import { usePost } from "@/hooks/board/useBoards";

export default function PostPage({
  params,
}: {
  params: { slug: string; id: string };
}) {
  const { user } = useAuthStore();
  const { data: post, isLoading } = usePost(parseInt(params.id));

  if (isLoading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4">
        <Link
          href={`/boards/${params.slug}`}
          className="text-blue-500 hover:text-blue-700"
        >
          ← 목록으로
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <div className="flex justify-between items-center text-sm text-gray-600 mb-6">
            <div>
              {post.author ? (
                <span>{post.author.username}</span>
              ) : (
                <span>{post.authorName}</span>
              )}
              <span className="mx-2">·</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <span>조회 {post.viewCount}</span>
          </div>
          <div className="prose max-w-none">
            {post.content.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </article>

      <CommentSection post={post} user={user} />
    </div>
  );
}
