"use client";

import Divider from "@/components/common/divider/Divider";
import { useComments } from "@/hooks/board/useBoards";
import { useBestComments } from "@/hooks/board/useBoards";
import { Post } from "@/libs/api/services/board.service";
import { User } from "@/store/authStore";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  post: Post;
  user: User | null;
}

export default function CommentSection({ post, user }: CommentSectionProps) {
  const { data: comments = [], isLoading } = useComments(post.id);
  const { data: bestComments = [] } = useBestComments(post.id);

  // 최상위 댓글만 필터링
  const parentComments = comments.filter((comment) => !comment.parent);

  // 특정 댓글의 모든 하위 댓글을 가져오는 함수
  const getAllReplies = (commentId: number) => {
    // 재귀적으로 모든 하위 댓글의 ID를 수집하는 함수
    const collectReplyIds = (
      currentId: number,
      collected = new Set<number>()
    ) => {
      const directReplies = comments.filter((c) => c.parent?.id === currentId);
      directReplies.forEach((reply) => {
        collected.add(reply.id);
        // 재귀적으로 이 댓글의 하위 댓글들도 수집
        collectReplyIds(reply.id, collected);
      });
      return collected;
    };

    // 모든 하위 댓글 ID 수집
    const replyIds = collectReplyIds(commentId);

    // ID에 해당하는 댓글들을 찾아서 시간순으로 정렬
    return comments
      .filter((comment) => replyIds.has(comment.id))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  if (isLoading) return <div>댓글을 불러오는 중...</div>;

  // BEST 댓글 id set
  const bestCommentIds = new Set(bestComments.map((c) => c.id));

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
        댓글 {comments.length}개
      </h2>
      {/* BEST 댓글 영역 */}
      {bestComments.length > 0 && (
        <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <div className="font-semibold text-yellow-700 dark:text-yellow-200 mb-2">
            BEST 댓글
          </div>
          <div className="space-y-6">
            {bestComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                user={user}
                post={post}
                replies={getAllReplies(comment.id)}
                best={true}
              />
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 space-y-6">
        {parentComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            user={user}
            post={post}
            replies={getAllReplies(comment.id)}
            best={bestCommentIds.has(comment.id)}
          />
        ))}
      </div>
      <Divider marginY="3rem" />
      <CommentForm post={post} user={user} onSuccess={() => {}} />
    </div>
  );
}
