import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBoards,
  getBoardBySlug,
  getPosts,
  getPostsBySlug,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleNotice,
  getComments,
  createComment,
  createReply,
  updateComment,
  deleteComment,
  CreateCommentDto,
  CreatePostDto,
  CreateReplyDto,
  verifyCommentPassword,
} from "@/libs/api/services/board.service";
import { PaginationQueryDto } from "@/libs/api/dto/pagination.dto";
import { getErrorMessage } from "@/libs/utils/error-handler";

// 게시판 관련 hooks
export const useBoards = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: () => getBoards(),
    staleTime: 1000 * 60 * 30,
  });
};

export const useBoardBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["board", slug],
    queryFn: () => getBoardBySlug(slug),
    staleTime: 1000 * 60 * 30,
  });
};

// 게시글 관련 hooks
export const usePosts = (
  boardId: number,
  paginationParams: PaginationQueryDto = {}
) => {
  return useQuery({
    queryKey: ["posts", boardId, paginationParams],
    queryFn: () => getPosts(boardId, paginationParams),
  });
};

export const usePostsBySlug = (
  slug: string,
  paginationParams: PaginationQueryDto = {}
) => {
  const isFirstPage = (paginationParams.page || 1) === 1;

  return useQuery({
    queryKey: ["posts", "slug", slug, paginationParams],
    queryFn: () => getPostsBySlug(slug, paginationParams),
    enabled: !!slug, // slug가 있어야만 실행 (게시판 정보 조회와 병렬 실행 가능)
    // 첫 페이지는 실시간성 중요, 다른 페이지는 캐시 활용
    staleTime: isFirstPage ? 1000 * 30 : 1000 * 60 * 5, // 첫 페이지: 30초, 나머지: 5분
    refetchOnWindowFocus: isFirstPage, // 첫 페이지만 포커스시 새로고침
  });
};

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    staleTime: 1000 * 60 * 3, // 3분 캐시 (게시글 내용도 적절한 실시간성 유지)
  });
};

export const useCreatePost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => createPost(data),
    onSuccess: (_, variables) => {
      // boardId 기반 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["posts", variables.boardId] });

      // slug 기반 캐시도 무효화 (더 광범위하게)
      queryClient.invalidateQueries({
        queryKey: ["posts", "slug"],
        exact: false, // 하위 키들도 모두 무효화
      });

      onSuccess?.();
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });
};

export const useUpdatePost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      password,
    }: {
      id: number;
      data: Partial<CreatePostDto>;
      password?: string;
    }) => updatePost(id, data, password),
    onSuccess: (_, variables) => {
      // 개별 게시글 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });

      // 게시글 목록 캐시도 무효화 (제목이 변경될 수 있음)
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: false,
      });

      onSuccess?.();
    },
  });
};

export const useDeletePost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, password }: { id: number; password?: string }) =>
      deletePost(id, password),
    onSuccess: (_, variables) => {
      // 개별 게시글 캐시 제거
      queryClient.removeQueries({ queryKey: ["post", variables.id] });

      // 모든 게시글 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: false,
      });

      onSuccess?.();
    },
  });
};

export const useToggleNotice = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isNotice }: { id: number; isNotice: boolean }) =>
      toggleNotice(id, isNotice),
    onSuccess: (_, variables) => {
      // 개별 게시글 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });

      // 모든 게시글 목록 캐시 무효화 (정렬 순서가 변경됨)
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: false,
      });

      onSuccess?.();
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });
};

// 댓글 관련 hooks
export const useComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });
};

export const useCreateComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentDto) => createComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });
};

export const useCreateReply = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReplyDto) => createReply(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
      onSuccess?.();
    },
    onError: (error) => {
      alert(getErrorMessage(error));
    },
  });
};

export function useUpdateComment(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      content,
      password,
      authorName,
    }: {
      id: number;
      content: string;
      password?: string;
      authorName?: string;
    }) => {
      return updateComment(id, content, password, authorName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (onSuccess) onSuccess();
    },
  });
}

export const useDeleteComment = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, password }: { id: number; password?: string }) =>
      deleteComment(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      onSuccess?.();
    },
  });
};

export const useVerifyCommentPassword = (
  onSuccess?: () => void,
  onError?: () => void
) => {
  return useMutation({
    mutationFn: (data: { id: number; password: string }) =>
      verifyCommentPassword(data.id, data.password),
    onError: () => {
      onError?.();
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });
};
