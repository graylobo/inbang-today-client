"use client";

import { useCreateComment, useCreateReply } from "@/hooks/board/useBoards";
import { Post, User } from "@/libs/api/services/board.service";
import { useState } from "react";

interface CommentFormProps {
  post: Post;
  user: User | null;
  parentId?: number;
  onSuccess: () => void;
}

export default function CommentForm({
  post,
  user,
  parentId,
  onSuccess,
}: CommentFormProps) {
  const [formData, setFormData] = useState({
    content: "",
    authorName: "",
    password: "",
  });

  const createComment = useCreateComment(onSuccess);
  const createReply = useCreateReply(onSuccess);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (parentId) {
      createReply.mutate({
        ...formData,
        postId: post.id,
        parentId,
      });
    } else {
      createComment.mutate({
        ...formData,
        postId: post.id,
      });
    }

    setFormData({ content: "", authorName: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {post.board?.isAnonymous && !user && (
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              작성자명
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300"
              required
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <textarea
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="댓글을 입력하세요"
          className="flex-1 rounded-md border-gray-300"
          rows={2}
          required
        />
        <button
          type="submit"
          disabled={createComment.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {createComment.isPending ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
}
