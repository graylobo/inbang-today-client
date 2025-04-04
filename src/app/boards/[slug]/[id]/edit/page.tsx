"use client";

import { useAuthStore } from "@/store/authStore";
import { usePost, useUpdatePost } from "@/hooks/board/useBoards";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Tiptap from "@/components/editor/Tiptap";

interface EditPostPageProps {
  params: {
    slug: string;
    id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: post, isLoading } = usePost(parseInt(params.id));
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    password: "",
    authorName: "",
  });

  const updatePost = useUpdatePost(() => {
    router.push(`/boards/${params.slug}/${params.id}`);
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        password: "",
        authorName: post.authorName || "",
      });
    }
  }, [post]);

  if (isLoading) return <div className="dark:text-gray-300">로딩 중...</div>;
  if (!post)
    return <div className="dark:text-gray-300">게시글을 찾을 수 없습니다.</div>;

  // 작성자 확인
  const isAuthor = user && post.author && user.id === post.author.id;
  if (!isAuthor && !post.board.isAnonymous) {
    router.push(`/boards/${params.slug}/${params.id}`);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePost.mutateAsync({
        id: post.id,
        data: {
          title: formData.title,
          content: formData.content,
          boardId: post.board.id,
          authorName: post.board.isAnonymous ? formData.authorName : undefined,
        },
        password: post.board.isAnonymous ? formData.password : undefined,
      });
    } catch (error) {
      console.error("게시글 수정 실패:", error);
      alert("게시글 수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold dark:text-gray-100">게시글 수정</h1>
        <Link
          href={`/boards/${params.slug}/${params.id}`}
          className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          취소
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            제목
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            required
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {post.board.isAnonymous && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                작성자명
              </label>
              <input
                type="text"
                value={formData.authorName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    authorName: e.target.value,
                  }))
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                비밀번호
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            내용
          </label>
          <Tiptap
            content={formData.content}
            onChange={(newContent) =>
              setFormData((prev) => ({ ...prev, content: newContent }))
            }
            editable={true}
            initialContent={post?.content}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={updatePost.isPending}
            className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {updatePost.isPending ? "수정 중..." : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
}
