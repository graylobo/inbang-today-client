"use client";

import {
  useDeleteComment,
  useUpdateComment,
  useVerifyCommentPassword,
} from "@/hooks/board/useBoards";
import { Comment, Post } from "@/libs/api/services/board.service";
import { User } from "@/store/authStore";
import { maskIpAddress } from "@/utils/ipUtils";
import Image from "next/image";
import { useState } from "react";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  user: User | null;
  post: Post;
  replies: Comment[];
}

export default function CommentItem({
  comment,
  user,
  post,
  replies,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editFormData, setEditFormData] = useState({
    content: comment.content,
    authorName: comment.authorName || "",
  });

  const updateComment = useUpdateComment(() => setIsEditing(false));
  const deleteComment = useDeleteComment();
  const verifyPassword = useVerifyCommentPassword(
    () => {
      if (deleteMode) {
        handleDeleteWithPassword();
      } else {
        setShowPasswordModal(false);
        setIsEditing(true);
      }
    },
    () => alert("비밀번호가 일치하지 않습니다.")
  );

  const isAuthor = user && comment.author && user.id === comment.author.id;
  const isPostAuthor =
    comment.author?.id === post.author?.id ||
    comment.authorName === post.authorName;
  const isDeletedComment = comment.deletedAt !== null;

  const handleEdit = () => {
    if (post.board.isAnonymous && !comment.author) {
      return;
    }

    if (comment.password) {
      setDeleteMode(false);
      setShowPasswordModal(true);
    } else {
      setIsEditing(true);
    }
  };

  const handleDeleteClick = () => {
    if (post.board.isAnonymous && !comment.author) {
      setDeleteMode(true);
      setShowPasswordModal(true);
      return;
    }

    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      handleDeleteWithPassword();
    }
  };

  const handleDeleteWithPassword = async () => {
    try {
      await deleteComment.mutateAsync({
        id: comment.id,
        password: comment.password ? password : undefined,
      });
      setShowPasswordModal(false);
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const renderContent = (comment: Comment) => {
    // 삭제된 댓글인 경우 "삭제된 댓글입니다" 표시
    if (comment.deletedAt !== null) {
      return "삭제된 댓글입니다.";
    }

    if (comment.parent) {
      const replyToUsername =
        comment.parent.author?.name || comment.parent.authorName;
      return (
        <div className="flex items-start gap-2">
          <span className="text-blue-500 dark:text-blue-400 shrink-0">
            @{replyToUsername}
          </span>
          <span>{comment.content}</span>
        </div>
      );
    }
    return comment.content;
  };

  return (
    <div className="flex space-x-3">
      <div className="flex-shrink-0">
        {!post.board.isAnonymous || comment.author ? (
          comment.author?.profileImage ? (
            <Image
              src={comment.author.profileImage}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                {comment.author?.name?.[0] || comment.authorName?.[0] || "?"}
              </span>
            </div>
          )
        ) : (
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-500 dark:text-gray-400 text-xs">
              익명
            </span>
          </div>
        )}
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <span
            className={`font-medium ${
              isPostAuthor && !post.board.isAnonymous
                ? "text-blue-500 dark:text-blue-400"
                : isDeletedComment
                ? "text-gray-500 dark:text-gray-500"
                : "dark:text-gray-200"
            }`}
          >
            {comment.author ? comment.author.name : comment.authorName}
            {isPostAuthor && !post.board.isAnonymous && !isDeletedComment && (
              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded">
                작성자
              </span>
            )}
          </span>
          {post.board.isAnonymous && comment.ipAddress && !isDeletedComment && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({maskIpAddress(comment.ipAddress)})
            </span>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-2">
            {post.board.isAnonymous && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  작성자명
                </label>
                <input
                  type="text"
                  value={editFormData.authorName}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      authorName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  required
                />
              </div>
            )}
            <textarea
              value={editFormData.content}
              onChange={(e) =>
                setEditFormData({ ...editFormData, content: e.target.value })
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
                    content: editFormData.content,
                    authorName: post.board.isAnonymous
                      ? editFormData.authorName
                      : user?.name,
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
            <span
              className={`mt-1 ${
                isDeletedComment
                  ? "text-gray-500 dark:text-gray-500 italic"
                  : "text-gray-800 dark:text-gray-300"
              }`}
            >
              {renderContent(comment)}
            </span>
            <div className="mt-2 space-x-4">
              {!isDeletedComment && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  답글
                </button>
              )}
              {!isDeletedComment && isAuthor ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    삭제
                  </button>
                </>
              ) : (
                !isDeletedComment &&
                post.board.isAnonymous && (
                  <>
                    <button
                      onClick={handleDeleteClick}
                      className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      삭제
                    </button>
                  </>
                )
              )}
            </div>
          </>
        )}

        {showReplyForm && (
          <div className="mt-4 ml-8">
            <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <span className="text-blue-500 dark:text-blue-400">
                @{comment.author?.name || comment.authorName}
              </span>
              <span>님에게 답글 작성</span>
            </div>
            <CommentForm
              post={post}
              user={user}
              parentId={comment.id}
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
                  showReplies ? "rotate-180" : ""
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
                {replies
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((reply) => (
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
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 dark:text-gray-100">
              {deleteMode ? "댓글 삭제" : "비밀번호 확인"}
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              {deleteMode
                ? "댓글을 삭제하려면 비밀번호를 입력하세요."
                : "댓글을 수정하려면 비밀번호를 입력하세요."}
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              placeholder="비밀번호"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              >
                취소
              </button>
              <button
                onClick={() =>
                  verifyPassword.mutate({ id: comment.id, password })
                }
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
