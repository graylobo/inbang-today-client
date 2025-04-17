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
): Promise<void> {
  const route = API_ROUTES.likes.posts[action];
  return await apiRequest({
    url: createUrl(route.url, { params: { postId } }),
    method: route.method,
  });
}
