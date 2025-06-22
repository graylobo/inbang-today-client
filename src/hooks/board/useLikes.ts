import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LikeStatus,
  LikeCounts,
  ToggleLikeResponse,
  getPostLikeStatus,
  getPostLikeCounts,
  togglePostLike,
} from "@/libs/api/services/likes.service";

// 게시글 좋아요/싫어요 상태 조회
export const usePostLikeStatus = (postId: number) => {
  return useQuery<LikeStatus>({
    queryKey: ["postLikeStatus", postId],
    queryFn: () => getPostLikeStatus(postId),
    // 로그인 상태가 변경될 수 있으므로 캐시 시간을 짧게 설정
    staleTime: 1000 * 60, // 1분
  });
};

// 게시글 좋아요/싫어요 수 조회
export const usePostLikeCounts = (postId: number) => {
  return useQuery<LikeCounts>({
    queryKey: ["postLikeCounts", postId],
    queryFn: () => getPostLikeCounts(postId),
    staleTime: 1000 * 60, // 1분
  });
};

// 게시글 좋아요 토글
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      action,
    }: {
      postId: number;
      action: "like" | "dislike";
    }) => {
      return await togglePostLike(postId, action);
    },
    // 🚀 낙관적 업데이트 - 즉각적인 UI 반응
    onMutate: async ({ postId, action }) => {
      // 진행 중인 쿼리들 취소
      await queryClient.cancelQueries({ queryKey: ["postLikeStatus", postId] });
      await queryClient.cancelQueries({ queryKey: ["postLikeCounts", postId] });

      // 현재 상태 백업
      const previousStatus = queryClient.getQueryData<LikeStatus>([
        "postLikeStatus",
        postId,
      ]);
      const previousCounts = queryClient.getQueryData<LikeCounts>([
        "postLikeCounts",
        postId,
      ]);

      // 즉시 UI 업데이트
      if (previousStatus && previousCounts) {
        let newStatus: LikeStatus;
        let newCounts: LikeCounts;

        if (action === "like") {
          if (previousStatus.liked) {
            // 좋아요 취소
            newStatus = { liked: false, disliked: false };
            newCounts = {
              ...previousCounts,
              likes: Math.max(0, previousCounts.likes - 1),
            };
          } else if (previousStatus.disliked) {
            // 싫어요 → 좋아요
            newStatus = { liked: true, disliked: false };
            newCounts = {
              likes: previousCounts.likes + 1,
              dislikes: Math.max(0, previousCounts.dislikes - 1),
            };
          } else {
            // 처음 좋아요
            newStatus = { liked: true, disliked: false };
            newCounts = { ...previousCounts, likes: previousCounts.likes + 1 };
          }
        } else {
          // dislike
          if (previousStatus.disliked) {
            // 싫어요 취소
            newStatus = { liked: false, disliked: false };
            newCounts = {
              ...previousCounts,
              dislikes: Math.max(0, previousCounts.dislikes - 1),
            };
          } else if (previousStatus.liked) {
            // 좋아요 → 싫어요
            newStatus = { liked: false, disliked: true };
            newCounts = {
              likes: Math.max(0, previousCounts.likes - 1),
              dislikes: previousCounts.dislikes + 1,
            };
          } else {
            // 처음 싫어요
            newStatus = { liked: false, disliked: true };
            newCounts = {
              ...previousCounts,
              dislikes: previousCounts.dislikes + 1,
            };
          }
        }

        // 즉시 캐시 업데이트
        queryClient.setQueryData(["postLikeStatus", postId], newStatus);
        queryClient.setQueryData(["postLikeCounts", postId], newCounts);
      }

      // 롤백용 데이터 반환
      return { previousStatus, previousCounts };
    },
    // 🎯 성공 시 서버 응답으로 정확한 상태 업데이트
    onSuccess: (response: ToggleLikeResponse, { postId }) => {
      // 서버에서 받은 정확한 상태로 캐시 업데이트
      queryClient.setQueryData(["postLikeStatus", postId], response.status);
      queryClient.setQueryData(["postLikeCounts", postId], response.counts);
    },
    // 실패 시 이전 상태로 롤백
    onError: (err, { postId }, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(
          ["postLikeStatus", postId],
          context.previousStatus
        );
      }
      if (context?.previousCounts) {
        queryClient.setQueryData(
          ["postLikeCounts", postId],
          context.previousCounts
        );
      }
    },
  });
};
