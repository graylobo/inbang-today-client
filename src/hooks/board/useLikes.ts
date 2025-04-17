import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LikeStatus,
  LikeCounts,
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
    // 좋아요 토글 후 상태와 카운트 즉시 갱신
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["postLikeStatus", postId] });
      queryClient.invalidateQueries({ queryKey: ["postLikeCounts", postId] });
    },
  });
};
