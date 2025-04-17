"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import CommentSection from "@/components/board/CommentSection";
import { usePost, useDeletePost } from "@/hooks/board/useBoards";
import {
  usePostLikeStatus,
  usePostLikeCounts,
  useTogglePostLike,
} from "@/hooks/board/useLikes";
import { useRouter } from "next/navigation";
import { maskIpAddress } from "@/utils/ipUtils";
import { use } from "react";
import { UserIcon, EyeIcon, CalendarIcon } from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import {
  HandThumbUpIcon as HandThumbUpIconSolid,
  HandThumbDownIcon as HandThumbDownIconSolid,
} from "@heroicons/react/24/solid";
import styles from "./index.module.scss";
import Divider from "@/components/common/divider/Divider";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/date.utils";

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
  const { data: likeStatus } = usePostLikeStatus(postId);
  const { data: likeCounts = { likes: 0, dislikes: 0 } } =
    usePostLikeCounts(postId);
  const toggleLike = useTogglePostLike();

  const deletePost = useDeletePost(() => {
    router.push(`/boards/${slug}`);
  });

  if (isLoading) return <div className="dark:text-gray-300">로딩 중...</div>;
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

  const handleLikeClick = async (action: "like" | "dislike") => {
    try {
      await toggleLike.mutateAsync({ postId, action });
    } catch (error) {
      console.error("좋아요/싫어요 처리 실패:", error);
    }
  };

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
                <UserIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="leading-none align-middle">
                  {post.author ? post.author.name : post.authorName}
                  {post.board.isAnonymous && post.ipAddress && (
                    <span> ({maskIpAddress(post.ipAddress)})</span>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                <span className="leading-none align-middle">
                  {formatDate(post.createdAt, "mm.dd hh:mm:ss")}
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
