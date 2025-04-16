"use client";

import { useCreateComment, useCreateReply } from "@/hooks/board/useBoards";
import { Post } from "@/libs/api/services/board.service";
import { User } from "@/store/authStore";
import { useState } from "react";

interface CommentFormProps {
  post: Post;
  user: User | null;
  parentId?: number;
  replyToUsername?: string;
  onSuccess?: () => void;
}

export default function CommentForm({
  post,
  user,
  parentId,
  replyToUsername,
  onSuccess,
}: CommentFormProps) {
  const [formData, setFormData] = useState({
    content: replyToUsername ? `@${replyToUsername} ` : "",
    authorName: "",
    password: "",
  });

  const createComment = useCreateComment(onSuccess);
  const createReply = useCreateReply(onSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const commentData = {
      ...formData,
      postId: post.id,
      authorName: post.board?.isAnonymous ? formData.authorName : user?.name,
    };

    if (parentId) {
      createReply.mutate({
        ...commentData,
        parentId,
      });
    } else {
      createComment.mutate(commentData);
    }

    setFormData({ content: "", authorName: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {post.board?.isAnonymous && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              작성자명
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              비밀번호
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              required
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="댓글을 입력하세요"
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 min-h-[100px] resize-none"
          rows={4}
          required
        />
        <button
          type="submit"
          disabled={createComment.isPending}
          className="self-end px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {createComment.isPending ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
}
