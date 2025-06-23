import {
  LikeCounts,
  LikeStatus,
  ToggleLikeResponse,
  getPostLikeCounts,
  getPostLikeStatus,
  togglePostLike,
} from "@/libs/api/services/likes.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

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

// 🚀 유튜브 방식 좋아요 훅 (매 클릭마다 서버 요청 + Race Condition 해결)
export const useOptimisticPostLike = (postId: number) => {
  const queryClient = useQueryClient();

  // 서버 데이터 가져오기
  const { data: serverStatus } = usePostLikeStatus(postId);
  const { data: serverCounts } = usePostLikeCounts(postId);

  // 로컬 상태 (즉시 반응용)
  const [localStatus, setLocalStatus] = useState<LikeStatus | null>(null);
  const [localCounts, setLocalCounts] = useState<LikeCounts | null>(null);

  // Race condition 해결을 위한 요청 추적
  const lastRequestId = useRef<number>(0);
  const abortController = useRef<AbortController | null>(null);

  // 서버 상태로 로컬 상태 초기화
  useEffect(() => {
    if (serverStatus && !localStatus) {
      setLocalStatus(serverStatus);
    }
  }, [serverStatus, localStatus]);

  useEffect(() => {
    if (serverCounts && !localCounts) {
      setLocalCounts(serverCounts);
    }
  }, [serverCounts, localCounts]);

  // 🎯 유튜브 방식: 매 클릭마다 즉시 서버 요청
  const handleToggle = useCallback(
    async (action: "like" | "dislike") => {
      if (!localStatus || !localCounts) return;

      // 1. 이전 요청 취소 (Race Condition 방지)
      if (abortController.current) {
        abortController.current.abort();
      }
      abortController.current = new AbortController();

      // 2. 현재 요청에 고유 ID 부여
      const currentRequestId = ++lastRequestId.current;

      // 3. 즉시 로컬 상태 업데이트 ⚡ (낙관적 업데이트)
      let newStatus: LikeStatus;
      let newCounts: LikeCounts;

      if (action === "like") {
        if (localStatus.liked) {
          // 좋아요 취소
          newStatus = { liked: false, disliked: false };
          newCounts = {
            ...localCounts,
            likes: Math.max(0, localCounts.likes - 1),
          };
        } else if (localStatus.disliked) {
          // 싫어요 → 좋아요
          newStatus = { liked: true, disliked: false };
          newCounts = {
            likes: localCounts.likes + 1,
            dislikes: Math.max(0, localCounts.dislikes - 1),
          };
        } else {
          // 처음 좋아요
          newStatus = { liked: true, disliked: false };
          newCounts = { ...localCounts, likes: localCounts.likes + 1 };
        }
      } else {
        // dislike
        if (localStatus.disliked) {
          // 싫어요 취소
          newStatus = { liked: false, disliked: false };
          newCounts = {
            ...localCounts,
            dislikes: Math.max(0, localCounts.dislikes - 1),
          };
        } else if (localStatus.liked) {
          // 좋아요 → 싫어요
          newStatus = { liked: false, disliked: true };
          newCounts = {
            likes: Math.max(0, localCounts.likes - 1),
            dislikes: localCounts.dislikes + 1,
          };
        } else {
          // 처음 싫어요
          newStatus = { liked: false, disliked: true };
          newCounts = { ...localCounts, dislikes: localCounts.dislikes + 1 };
        }
      }

      setLocalStatus(newStatus);
      setLocalCounts(newCounts);

      // 4. 즉시 서버 요청 📡 (유튜브 방식)
      try {
        const response = await togglePostLike(postId, action);

        // 5. 가장 최신 요청인지 확인 (Race Condition 방지)
        if (currentRequestId === lastRequestId.current) {
          // 서버 응답으로 캐시 및 로컬 상태 업데이트
          queryClient.setQueryData(["postLikeStatus", postId], response.status);
          queryClient.setQueryData(["postLikeCounts", postId], response.counts);
          setLocalStatus(response.status);
          setLocalCounts(response.counts);
        }
        // else: 더 최신 요청이 있으므로 이 응답은 무시
      } catch (error) {
        // 6. 에러 처리: 요청이 취소된 것이 아니라면 롤백
        if (
          currentRequestId === lastRequestId.current &&
          !abortController.current?.signal.aborted
        ) {
          // 가장 최신 요청이고 취소되지 않은 에러라면 롤백
          if (serverStatus) setLocalStatus(serverStatus);
          if (serverCounts) setLocalCounts(serverCounts);

          console.error("좋아요 처리 실패:", error);
        }
      }
    },
    [localStatus, localCounts, postId, queryClient, serverStatus, serverCounts]
  );

  // 컴포넌트 언마운트시 요청 취소
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);

  return {
    // 로컬 상태 우선, 없으면 서버 상태
    status: localStatus || serverStatus || { liked: false, disliked: false },
    counts: localCounts || serverCounts || { likes: 0, dislikes: 0 },
    toggleLike: handleToggle,
    isLoading: false, // 로컬 상태는 항상 즉시 업데이트되므로 로딩 없음
  };
};

// 기존 좋아요 토글 (호환성 유지)
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
