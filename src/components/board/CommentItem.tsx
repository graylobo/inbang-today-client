"use client";

import { useState } from "react";
import {
  useUpdateComment,
  useDeleteComment,
  useVerifyCommentPassword,
} from "@/hooks/board/useBoards";
import CommentForm from "./CommentForm";
import { Comment, Post, User } from "@/libs/api/services/board.service";
import Image from "next/image";

interface CommentItemProps {
  comment: Comment;
  user: User | null;
  post: Post;
  replies: Comment[];
}

export default function CommentItem({ comment, user, post, replies }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const updateComment = useUpdateComment(() => setIsEditing(false));
  const deleteComment = useDeleteComment();
  const verifyPassword = useVerifyCommentPassword(
    () => {
      setShowPasswordModal(false);
      setIsEditing(true);
    },
    () => alert("비밀번호가 일치하지 않습니다.")
  );

  const isAuthor = user && comment.author && user.id === comment.author.id;
  const isPostAuthor = comment.author?.id === post.author?.id || 
                      comment.authorName === post.authorName;

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) return;

    try {
      await deleteComment.mutateAsync({
        id: comment.id,
        password: comment.password ? password : undefined,
      });
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const renderContent = (comment: Comment) => {
    if (comment.parent) {
      const replyToUsername = comment.parent.author?.username || comment.parent.authorName;
      return (
        <>
          <span className="text-blue-500 dark:text-blue-400 mr-1">
            @{replyToUsername}
          </span>
          {comment.content}
        </>
      );
    }
    return comment.content;
  };

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        <Image
          src={comment.author?.profileImage || "/default-avatar.png"}
          alt="Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <span className={`font-medium ${isPostAuthor ? 'text-blue-500 dark:text-blue-400' : 'dark:text-gray-200'}`}>
            {comment.author ? comment.author.username : comment.authorName}
            {isPostAuthor && (
              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded">
                작성자
              </span>
            )}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={comment.content}
              onChange={(e) =>
                updateComment.mutate({
                  id: comment.id,
                  content: e.target.value,
                  password: comment.password ? password : undefined,
                })
              }
              className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <div className="mt-2 space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                취소
              </button>
              <button
                onClick={() => {
                  updateComment.mutate({
                    id: comment.id,
                    content: comment.content,
                    password: comment.password ? password : undefined,
                  });
                }}
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                저장
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mt-1 text-gray-800 dark:text-gray-300">
              {renderContent(comment)}
            </p>
            <div className="mt-2 space-x-4">
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                답글
              </button>
              {isAuthor && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          </>
        )}

        {showReplyForm && (
          <div className="mt-4 ml-8">
            <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {`@${comment.author?.username || comment.authorName}에게 답글 작성`}
            </div>
            <CommentForm
              post={post}
              user={user}
              parentId={comment.id}
              replyToUsername={comment.author?.username || comment.authorName}
              onSuccess={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {replies.length > 0 && (
          <>
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  showReplies ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
              {showReplies ? "답글 숨기기" : `답글 ${replies.length}개 보기`}
            </button>

            {showReplies && (
              <div className="mt-4 space-y-4 ml-8">
                {replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    user={user}
                    post={post}
                    replies={[]}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
