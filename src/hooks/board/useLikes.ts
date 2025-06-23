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

// 🚀 빠른 클릭 대응 좋아요 훅 (유튜브 방식)
export const useOptimisticPostLike = (postId: number) => {
  const queryClient = useQueryClient();

  // 서버 데이터 가져오기
  const { data: serverStatus } = usePostLikeStatus(postId);
  const { data: serverCounts } = usePostLikeCounts(postId);

  // 로컬 상태 (즉시 반응용)
  const [localStatus, setLocalStatus] = useState<LikeStatus | null>(null);
  const [localCounts, setLocalCounts] = useState<LikeCounts | null>(null);

  // 디바운스용 타이머 및 상태 추적
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);

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

  // 실제 서버 요청 mutation
  const serverMutation = useMutation({
    mutationFn: async ({ action }: { action: "like" | "dislike" }) => {
      return await togglePostLike(postId, action);
    },
    onSuccess: (response: ToggleLikeResponse) => {
      // 서버 응답으로 캐시 업데이트
      queryClient.setQueryData(["postLikeStatus", postId], response.status);
      queryClient.setQueryData(["postLikeCounts", postId], response.counts);

      // 로컬 상태도 서버 상태로 동기화
      setLocalStatus(response.status);
      setLocalCounts(response.counts);
      isSyncingRef.current = false;
    },
    onError: () => {
      // 실패시 서버 상태로 롤백
      if (serverStatus) setLocalStatus(serverStatus);
      if (serverCounts) setLocalCounts(serverCounts);
      isSyncingRef.current = false;
    },
  });

  // 🔄 서버와 로컬 상태 동기화 함수
  const syncWithServer = useCallback(() => {
    if (!localStatus || !serverStatus || isSyncingRef.current) return;

    // 현재 로컬 상태와 서버 상태 비교
    const localLiked = localStatus.liked;
    const localDisliked = localStatus.disliked;
    const serverLiked = serverStatus.liked;
    const serverDisliked = serverStatus.disliked;

    // 상태가 같으면 서버 요청 불필요
    if (localLiked === serverLiked && localDisliked === serverDisliked) {
      return;
    }

    isSyncingRef.current = true;

    // 🎯 로컬 상태에 맞는 action 계산
    let actionToSend: "like" | "dislike";

    if (localLiked && !serverLiked) {
      // 로컬: 좋아요, 서버: 좋아요 안됨 → like 전송
      actionToSend = "like";
    } else if (!localLiked && serverLiked) {
      // 로컬: 좋아요 안됨, 서버: 좋아요됨 → like 전송 (토글로 취소)
      actionToSend = "like";
    } else if (localDisliked && !serverDisliked) {
      // 로컬: 싫어요, 서버: 싫어요 안됨 → dislike 전송
      actionToSend = "dislike";
    } else if (!localDisliked && serverDisliked) {
      // 로컬: 싫어요 안됨, 서버: 싫어요됨 → dislike 전송 (토글로 취소)
      actionToSend = "dislike";
    } else {
      // 예상치 못한 상태
      isSyncingRef.current = false;
      return;
    }

    serverMutation.mutate({ action: actionToSend });
  }, [localStatus, serverStatus, serverMutation]);

  // 🎯 즉시 UI 업데이트 + 디바운싱된 서버 동기화
  const handleToggle = useCallback(
    (action: "like" | "dislike") => {
      if (!localStatus || !localCounts) return;

      // 1. 즉시 로컬 상태 업데이트 ⚡
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

      // 2. 디바운싱된 서버 동기화 📡
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        syncWithServer();
      }, 500); // 0.5초 디바운스
    },
    [localStatus, localCounts, syncWithServer]
  );

  // 컴포넌트 언마운트시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    // 로컬 상태 우선, 없으면 서버 상태
    status: localStatus || serverStatus || { liked: false, disliked: false },
    counts: localCounts || serverCounts || { likes: 0, dislikes: 0 },
    toggleLike: handleToggle,
    isLoading: serverMutation.isPending,
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
