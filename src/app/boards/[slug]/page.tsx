"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import PostForm from "@/components/board/PostForm";
import Modal from "@/components/common/Modal";
import { useBoardBySlug, usePostsBySlug } from "@/hooks/board/useBoards";
import { maskIpAddress } from "@/utils/ipUtils";
import { UserIcon, EyeIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { formatDate } from "@/utils/date.utils";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Order, PaginationQueryDto } from "@/libs/api/dto/pagination.dto";
import {
  DEFAULT_ITEMS_PER_PAGE,
  ITEMS_PER_PAGE_OPTIONS,
} from "@/constants/pagination";
import {
  PostListSkeleton,
  BoardHeaderSkeleton,
} from "@/components/ui/skeleton";
import { useUserRank } from "@/api-hooks/rank.hooks";
import { LevelBadge } from "@/components/rank/LevelBadge";

type BoardPageParams = Promise<{
  slug: string;
}>;

export default function BoardPage(props: { params: BoardPageParams }) {
  const { slug } = use(props.params);
  const { user } = useAuthStore();
  const [showPostForm, setShowPostForm] = useState(false);
  const { data: userRank } = useUserRank();

  // Pagination state
  const [paginationParams, setPaginationParams] = useState<PaginationQueryDto>({
    page: 1,
    perPage: DEFAULT_ITEMS_PER_PAGE,
    order: Order.DESC,
    orderKey: "createdAt",
  });

  const { data: board, isLoading: boardLoading } = useBoardBySlug(slug);
  const { data: postsData, isLoading: postsLoading } = usePostsBySlug(
    slug,
    paginationParams
  );

  // Reset to page 1 when perPage changes
  const handlePerPageChange = (newPerPage: number) => {
    const oldPerPage = paginationParams.perPage || DEFAULT_ITEMS_PER_PAGE;
    const currentPageValue = paginationParams.page || 1;

    // 현재 사용자가 보고 있는 첫 번째 항목 인덱스 계산
    const firstItemIndex = (currentPageValue - 1) * oldPerPage;

    // 새 페이지 번호 계산 (해당 항목이 새 페이지 크기에서 어디에 위치할지)
    const newPage = Math.floor(firstItemIndex / newPerPage) + 1;

    setPaginationParams((prev) => ({
      ...prev,
      page: newPage,
      perPage: newPerPage,
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPaginationParams((prev) => ({
      ...prev,
      page,
    }));
  };

  // 로딩 상태 처리
  if (boardLoading || postsLoading) {
    return (
      <div className="mx-auto">
        <BoardHeaderSkeleton />
        <PostListSkeleton
          count={paginationParams.perPage || DEFAULT_ITEMS_PER_PAGE}
        />
      </div>
    );
  }

  if (!board)
    return <div className="dark:text-gray-300">게시판을 찾을 수 없습니다.</div>;

  const posts = postsData?.items || [];
  const totalPages = postsData?.totalPages || 1;
  const currentPage = postsData?.page || 1;

  return (
    <div className=" mx-auto ">
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
        {posts.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            아직 게시글이 없습니다.
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/boards/${board.slug}/${post.id}`}
                className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-row justify-center items-center gap-2">
                    <p className="dark:text-gray-100">
                      <span className="mr-2">{`${post.title}`}</span>
                      {post.comments.length > 0 && (
                        <span className="text-blue-500 dark:text-blue-400 text-sm">
                          [{post.comments.length}]
                        </span>
                      )}
                    </p>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <div className="flex items-center">
                        {post.author?.profileImage ? (
                          <img
                            src={post.author.profileImage}
                            alt="Profile"
                            className="w-4 h-4 rounded-full object-cover mr-1.5 flex-shrink-0"
                          />
                        ) : (
                          <UserIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        )}
                        <span className="leading-none align-middle">
                          {post.author ? post.author.name : post.authorName}
                          {board.isAnonymous && post.ipAddress && (
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
                        <EyeIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="leading-none align-middle">
                          {post.viewCount}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span className="leading-none align-middle">
                          {formatDate(post.createdAt, "mm.dd", {
                            showElapsedForToday: true,
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

        {/* Always show pagination controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={paginationParams.perPage}
          onItemsPerPageChange={handlePerPageChange}
          itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        />
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
