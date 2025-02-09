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
  const { data: comments = [], isLoading } = useComments(post.id);

  // 최상위 댓글만 필터링
  const parentComments = comments.filter(comment => !comment.parent);

  // 각 댓글의 모든 대댓글을 가져옴 (대댓글의 대댓글 포함)
  const getReplies = (commentId: number) => {
    return comments.filter(reply => {
      let currentParent = reply.parent;
      // 대댓글 체인을 따라 올라가면서 최상위 부모를 찾음
      while (currentParent) {
        if (currentParent.id === commentId) {
          return true;
        }
        currentParent = currentParent.parent;
      }
      return false;
    });
  };

  if (isLoading) return <div>댓글을 불러오는 중...</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
        댓글 {comments.length}개
      </h2>
      <CommentForm 
        post={post} 
        user={user} 
        onSuccess={() => {}}
      />
      <div className="mt-8 space-y-6">
        {parentComments.map((comment) => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            user={user}
            post={post}
            replies={getReplies(comment.id)}
          />
        ))}
      </div>
    </div>
  );
}
