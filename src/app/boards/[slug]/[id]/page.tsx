"use client";

import CommentSection from "@/components/board/CommentSection";
import Divider from "@/components/common/divider/Divider";
import { PostDetailSkeleton } from "@/components/ui/skeleton";
import { useDeletePost, usePost } from "@/hooks/board/useBoards";
import { useOptimisticPostLike } from "@/hooks/board/useLikes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { formatDate } from "@/utils/date.utils";
import { maskIpAddress } from "@/utils/ipUtils";
import {
  CalendarIcon,
  EyeIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbDownIcon as HandThumbDownIconSolid,
  HandThumbUpIcon as HandThumbUpIconSolid,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import styles from "./index.module.scss";
import { useUserRank } from "@/api-hooks/rank.hooks";
import { LevelBadge } from "@/components/rank/LevelBadge";

type PostPageParams = Promise<{
  slug: string;
  id: string;
}>;

export default function PostPage(props: { params: PostPageParams }) {
  const { slug, id } = use(props.params);
  const postId = parseInt(id);

  const { user } = useAuthStore();
  const router = useRouter();
  const { data: post, isLoading } = usePost(postId);
  const { data: userRank } = useUserRank();
  const {
    status: likeStatus,
    counts: likeCounts,
    toggleLike,
    isLoading: likeLoading,
  } = useOptimisticPostLike(postId);

  const deletePost = useDeletePost(() => {
    router.push(`/boards/${slug}`);
  });

  if (isLoading) return <PostDetailSkeleton />;
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

  const handleLikeClick = (action: "like" | "dislike") => {
    toggleLike(action);
  };

  console.log("post.author::", post.author);

  return (
    <div className={styles.container}>
      <div className="mb-10 flex justify-between items-center">
        <h1 className="text-[25px] font-semibold dark:text-gray-200">
          {post.board.name}
        </h1>
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

      <article className="bg-white dark:bg-dark-bg rounded-lg overflow-hidden">
        <div className="">
          <h1 className="text-2xl font-bold mb-4 dark:text-gray-100">
            {post.title}
          </h1>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {post.author?.profileImage ? (
                  <img
                    src={post.author.profileImage}
                    alt="Profile"
                    className="w-6 h-6 rounded-full object-cover mr-1.5 flex-shrink-0"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mr-1.5 flex-shrink-0">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {post.author?.name?.[0] || post.authorName?.[0] || "?"}
                    </span>
                  </div>
                )}
                <span className="leading-none align-middle">
                  {post.author ? post.author.name : post.authorName}
                  {post.board.isAnonymous && post.ipAddress && (
                    <span> ({maskIpAddress(post.ipAddress)})</span>
                  )}
                </span>
                {user &&
                  post.author &&
                  user.id === post.author.id &&
                  userRank && (
                    <LevelBadge
                      level={userRank.level}
                      className="text-xs px-2 py-0.5 ml-2"
                    />
                  )}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="leading-none align-middle">
                  {formatDate(post.createdAt, "mm.dd hh:mm:ss", {
                    showElapsedForToday: true,
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <EyeIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="leading-none align-middle">
                  {post.viewCount}
                </span>
              </div>
            </div>
          </div>
          <Divider />
          <div
            className={cn(styles.content, "prose dark:prose-invert max-w-none")}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          <div className="flex justify-center gap-4 mt-8 mb-4">
            <button
              onClick={() => handleLikeClick("like")}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                likeStatus?.liked
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              )}
              aria-label={likeStatus?.liked ? "좋아요 취소" : "좋아요"}
            >
              {likeStatus?.liked ? (
                <HandThumbUpIconSolid className="w-6 h-6" />
              ) : (
                <HandThumbUpIcon className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">{likeCounts.likes}</span>
            </button>
            <button
              onClick={() => handleLikeClick("dislike")}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                likeStatus?.disliked
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              )}
              aria-label={likeStatus?.disliked ? "싫어요 취소" : "싫어요"}
            >
              {likeStatus?.disliked ? (
                <HandThumbDownIconSolid className="w-6 h-6" />
              ) : (
                <HandThumbDownIcon className="w-6 h-6" />
              )}
              <span className="text-sm font-medium">{likeCounts.dislikes}</span>
            </button>
          </div>
        </div>
      </article>
      <Divider />

      <CommentSection post={post} user={user} />
    </div>
  );
}
