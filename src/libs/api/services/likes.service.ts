import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES, createUrl } from "@/libs/api/route";

export interface LikeStatus {
  liked: boolean;
  disliked: boolean;
}

export interface LikeCounts {
  likes: number;
  dislikes: number;
}

export interface ToggleLikeResponse {
  status: LikeStatus;
  counts: LikeCounts;
}

export async function getPostLikeStatus(postId: number): Promise<LikeStatus> {
  const route = API_ROUTES.likes.posts.getStatus;
  return await apiRequest({
    url: createUrl(route.url, { params: { postId } }),
    method: route.method,
  });
}

export async function getPostLikeCounts(postId: number): Promise<LikeCounts> {
  const route = API_ROUTES.likes.posts.getCounts;
  return await apiRequest({
    url: createUrl(route.url, { params: { postId } }),
    method: route.method,
  });
}

export async function togglePostLike(
  postId: number,
  action: "like" | "dislike"
): Promise<ToggleLikeResponse> {
  const route = API_ROUTES.likes.posts[action];
  return await apiRequest({
    url: createUrl(route.url, { params: { postId } }),
    method: route.method,
  });
}

// =================== 댓글 좋아요/싫어요 관련 함수들 ===================

export interface CommentLikeStatus {
  liked: boolean;
  disliked: boolean;
}

export interface CommentLikeCounts {
  likes: number;
  dislikes: number;
}

export interface ToggleCommentLikeResponse {
  liked: boolean;
  disliked: boolean;
  likeCount: number;
  dislikeCount: number;
  status: {
    liked: boolean;
    disliked: boolean;
  };
  counts: {
    likes: number;
    dislikes: number;
  };
}

export async function getCommentLikeStatus(
  commentId: number
): Promise<CommentLikeStatus> {
  const route = API_ROUTES.likes.comments.getStatus;
  return await apiRequest({
    url: createUrl(route.url, { params: { commentId } }),
    method: route.method,
  });
}

export async function getCommentLikeCounts(
  commentId: number
): Promise<CommentLikeCounts> {
  const route = API_ROUTES.likes.comments.getCounts;
  return await apiRequest({
    url: createUrl(route.url, { params: { commentId } }),
    method: route.method,
  });
}

export async function toggleCommentLike(
  commentId: number,
  action: "like" | "dislike"
): Promise<ToggleCommentLikeResponse> {
  const route = API_ROUTES.likes.comments[action];
  return await apiRequest({
    url: createUrl(route.url, { params: { commentId } }),
    method: route.method,
  });
}
