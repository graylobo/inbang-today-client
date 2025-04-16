"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import CommentSection from "@/components/board/CommentSection";
import { usePost, useDeletePost } from "@/hooks/board/useBoards";
import { useRouter } from "next/navigation";
import { maskIpAddress } from "@/utils/ipUtils";
import { use } from "react";
import styles from "./index.module.scss";
type PostPageParams = Promise<{
  slug: string;
  id: string;
}>;

export default function PostPage(props: { params: PostPageParams }) {
  const { slug, id } = use(props.params);

  const { user } = useAuthStore();
  const router = useRouter();
  const { data: post, isLoading } = usePost(parseInt(id));
  const deletePost = useDeletePost(() => {
    router.push(`/boards/${slug}`);
  });

  if (isLoading) return <div className="dark:text-gray-300">로딩 중...</div>;
  if (!post)
    return <div className="dark:text-gray-300">게시글을 찾을 수 없습니다.</div>;

  const isAuthor = user && post.author && user.id === post.author.id;

  const handleDelete = async () => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        await deletePost.mutateAsync({ id: post.id });
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        alert("게시글 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className="mb-4 flex justify-between items-center">
        <Link
          href={`/boards/${slug}`}
          className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          ← 목록으로
        </Link>
        {isAuthor && (
          <div className="space-x-2">
            <Link
              href={`/boards/${slug}/${post.id}/edit`}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      <article className={styles.article}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">
            {post.title}
          </h1>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div>
              {post.author ? (
                <span>{post.author.name}</span>
              ) : (
                <span>{post.authorName}</span>
              )}
              {post.board.isAnonymous && post.ipAddress && (
                <>
                  <span className="mx-2">·</span>
                  <span>({maskIpAddress(post.ipAddress)})</span>
                </>
              )}
              <span className="mx-2">·</span>
              <span>{new Date(post.createdAt).toLocaleString()}</span>
            </div>
            <span>조회 {post.viewCount}</span>
          </div>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <CommentSection post={post} user={user} />
    </div>
  );
}
