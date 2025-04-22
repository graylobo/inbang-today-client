import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBoards,
  getBoardBySlug,
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
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
  });
};

export const useBoardBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["board", slug],
    queryFn: () => getBoardBySlug(slug),
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

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
  });
};

export const useCreatePost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => createPost(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.boardId] });
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
      queryClient.invalidateQueries({ queryKey: ["post", variables.id] });
      onSuccess?.();
    },
  });
};

export const useDeletePost = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, password }: { id: number; password?: string }) =>
      deletePost(id, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onSuccess?.();
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
