"use client";

import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { useComments } from "@/hooks/board/useBoards";
import { Post, User } from "@/libs/api/services/board.service";

interface CommentSectionProps {
  post: Post;
  user: User | null;
}

export default function CommentSection({ post, user }: CommentSectionProps) {
  const { data: comments, isLoading } = useComments(post.id);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  if (isLoading)
    return <div className="dark:text-gray-300">댓글을 불러오는 중...</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
        댓글 {comments?.length || 0}개
      </h2>

      <CommentForm post={post} user={user} onSuccess={() => setReplyTo(null)} />

      <div className="mt-6 space-y-6">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={user}
            post={post}
            replyTo={replyTo}
            onReplyClick={(commentId) =>
              setReplyTo(replyTo === commentId ? null : commentId)
            }
          />
        ))}
      </div>
    </div>
  );
}
