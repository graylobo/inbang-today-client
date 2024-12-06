"use client";

import { useState } from "react";
import { useUpdateComment, useDeleteComment } from "@/hooks/board/useBoards";
import { User, Post, Comment } from "@/libs/api/services/board.service";
import CommentForm from "@/components/board/CommentForm";

interface CommentItemProps {
  comment: Comment;
  user: User | null;
  post: Post;
  replyTo: number | null;
  onReplyClick: (commentId: number) => void;
}

export default function CommentItem({
  comment,
  user,
  post,
  replyTo,
  onReplyClick,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [action, setAction] = useState<"edit" | "delete" | null>(null);

  const updateComment = useUpdateComment(() => {
    setIsEditing(false);
    setPassword("");
    setShowPasswordModal(false);
  });

  const deleteComment = useDeleteComment(() => {
    setPassword("");
    setShowPasswordModal(false);
  });

  const handleAction = (type: "edit" | "delete") => {
    if (!user && comment.password) {
      setAction(type);
      setShowPasswordModal(true);
    } else {
      if (type === "edit") {
        setIsEditing(true);
      } else {
        handleDelete();
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === "edit") {
      setIsEditing(true);
      setShowPasswordModal(false);
    } else {
      handleDelete();
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateComment.mutate({
      id: comment.id,
      content: editContent,
      password,
    });
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      deleteComment.mutate({ id: comment.id, password });
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        {/* 댓글 내용 */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="font-medium">
              {comment.author ? comment.author.username : comment.authorName}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex space-x-2 text-sm">
            <button
              onClick={() => onReplyClick(comment.id)}
              className="text-blue-600 hover:text-blue-800"
            >
              답글
            </button>
            {(user?.id === comment.author?.id ||
              (!user && comment.password)) && (
              <>
                <button
                  onClick={() => handleAction("edit")}
                  className="text-gray-600 hover:text-gray-800"
                >
                  수정
                </button>
                <button
                  onClick={() => handleAction("delete")}
                  className="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        {/* 수정 폼 */}
        {isEditing ? (
          <form onSubmit={handleUpdate} className="mt-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full rounded-md border-gray-300"
              rows={2}
              required
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={updateComment.isPending}
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {updateComment.isPending ? "수정 중..." : "수정"}
              </button>
            </div>
          </form>
        ) : (
          <p className="whitespace-pre-wrap">{comment.content}</p>
        )}

        {/* 답글 폼 */}
        {replyTo === comment.id && (
          <div className="mt-4 pl-4 border-l-2 border-gray-200">
            <CommentForm
              post={post}
              user={user}
              parentId={comment.id}
              onSuccess={() => onReplyClick(0)}
            />
          </div>
        )}
      </div>

      {/* 답글 목록 */}
      {comment.replies?.length > 0 && (
        <div className="pl-8 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              user={user}
              post={post}
              replyTo={replyTo}
              onReplyClick={onReplyClick}
            />
          ))}
        </div>
      )}

      {/* 비밀번호 모달 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">비밀번호 확인</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 mb-4"
                placeholder="비밀번호를 입력하세요"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
