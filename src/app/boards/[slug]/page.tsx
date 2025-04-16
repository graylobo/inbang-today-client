"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import PostForm from "@/components/board/PostForm";
import Modal from "@/components/common/Modal";
import { useBoardBySlug, usePosts } from "@/hooks/board/useBoards";
import { maskIpAddress } from "@/utils/ipUtils";
import { UserIcon, EyeIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/utils/date.utils";

type BoardPageParams = Promise<{
  slug: string;
}>;

export default function BoardPage(props: { params: BoardPageParams }) {
  const { slug } = use(props.params);
  const { user } = useAuthStore();
  const [showPostForm, setShowPostForm] = useState(false);
  const { data: board, isLoading: boardLoading } = useBoardBySlug(slug);
  const { data: posts, isLoading: postsLoading } = usePosts(board?.id || 0);

  if (boardLoading || postsLoading)
    return <div className="dark:text-gray-300">로딩 중...</div>;
  if (!board)
    return <div className="dark:text-gray-300">게시판을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-gray-100">{board.name}</h1>
        <Link
          href={`/boards/${board.slug}/write`}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        >
          글쓰기
        </Link>
      </div>

      <div className="bg-white dark:bg-dark-bg rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700 overflow-hidden">
        {posts?.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            아직 게시글이 없습니다.
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {posts?.map((post) => (
              <Link
                key={post.id}
                href={`/boards/${board.slug}/${post.id}`}
                className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-medium dark:text-gray-100">
                      <span className="mr-2">{`${post.title}`}</span>
                      {post.comments.length > 0 && (
                        <span className="text-blue-500 dark:text-gray-400">
                          [{post.comments.length}]
                        </span>
                      )}
                    </h2>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="leading-none align-middle">
                          {post.author ? post.author.name : post.authorName}
                          {board.isAnonymous && post.ipAddress && (
                            <span> ({maskIpAddress(post.ipAddress)})</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="leading-none align-middle">
                          {post.viewCount}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="leading-none align-middle">
                          {formatDate(post.createdAt, "mm.dd", {
                            showTimeOnlyForToday: true,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400"></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showPostForm}
        onClose={() => setShowPostForm(false)}
        title="글쓰기"
      >
        <PostForm
          board={board}
          onSuccess={() => setShowPostForm(false)}
          user={user}
        />
      </Modal>
    </div>
  );
}
