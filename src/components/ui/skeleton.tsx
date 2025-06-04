import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-700",
        className
      )}
      {...props}
    />
  );
}

// 게시글 목록용 스켈레톤
export function PostListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="bg-white dark:bg-dark-bg rounded-lg shadow dark:shadow-none dark:border dark:border-gray-700 overflow-hidden">
      <div className="divide-y dark:divide-gray-700">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-row justify-center items-center gap-2 w-full">
                {/* 제목 */}
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />

                  {/* 작성자, 조회수, 날짜 정보 */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <div className="flex items-center gap-1">
                      <Skeleton className="w-4 h-4" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 스켈레톤 */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-24" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-8 h-8" />
            ))}
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    </div>
  );
}

// 게시판 헤더용 스켈레톤
export function BoardHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-20" />
    </div>
  );
}

// 게시글 상세 페이지용 스켈레톤
export function PostDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* 게시판 헤더 */}
      <div className="mb-10 flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <div className="space-x-2">
          <Skeleton className="h-6 w-12 inline-block" />
          <Skeleton className="h-6 w-12 inline-block" />
        </div>
      </div>

      {/* 게시글 내용 */}
      <article className="bg-white dark:bg-dark-bg rounded-lg overflow-hidden">
        <div>
          {/* 제목 */}
          <Skeleton className="h-8 w-3/4 mb-4" />

          {/* 작성자 정보 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t dark:border-gray-700 mb-6"></div>

          {/* 본문 내용 */}
          <div className="space-y-4 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          {/* 좋아요/싫어요 버튼 */}
          <div className="flex justify-center gap-4 mt-8 mb-4">
            <div className="flex flex-col items-center gap-1 p-2">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-4 w-6" />
            </div>
            <div className="flex flex-col items-center gap-1 p-2">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-4 w-6" />
            </div>
          </div>
        </div>
      </article>

      {/* 구분선 */}
      <div className="border-t dark:border-gray-700 my-6"></div>

      {/* 댓글 섹션 */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-dark-bg rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

// 크루 랭킹용 스켈레톤
export function CrewRankingSkeleton() {
  return (
    <div className="space-y-6">
      {/* 제목 */}
      <Skeleton className="h-9 w-48" />

      {/* 필터 컨트롤 */}
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* 크루 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-dark-bg rounded-lg p-6 shadow dark:shadow-none dark:border dark:border-gray-700"
          >
            {/* 순위 */}
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-16" />
            </div>

            {/* 크루명 */}
            <Skeleton className="h-6 w-32 mb-4" />

            {/* 멤버 정보 */}
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, memberIndex) => (
                <div key={memberIndex} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-20 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>

            {/* 총 수익 */}
            <div className="mt-4 pt-4 border-t dark:border-gray-700">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// LIVE 뱃지용 스켈레톤
export function LiveBadgesSkeleton() {
  return (
    <div className="absolute top-3 right-3 flex gap-2">
      <Skeleton className="h-6 w-16 rounded-full opacity-60" />
    </div>
  );
}
