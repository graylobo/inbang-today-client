import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { User } from "@/store/authStore";
import {
  Order,
  PaginatedResponse,
  PaginationQueryDto,
} from "../dto/pagination.dto";

export interface Board {
  id: number;
  name: string;
  slug: string;
  isAnonymous: boolean;
  description?: string;
}

export interface PostAuthor extends User {
  userLevel?: {
    level: number;
  };
}

export interface Post {
  id: number;
  title: string;
  content: string;
  isNotice: boolean;
  noticeOrder?: number;
  author: PostAuthor | null;
  authorName: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  board: Board;
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  author: PostAuthor | null;
  authorName: string | null;
  ipAddress: string | null;
  password?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  post: Post;
  parent: Comment | null;
  replies: Comment[];
}

export interface CreatePostDto {
  title: string;
  content: string;
  boardId: number;
  authorName?: string;
  password?: string;
}

export interface CreateCommentDto {
  content: string;
  postId: number;
  authorName?: string;
  password?: string;
  parentId?: number;
}

export interface CreateReplyDto extends CreateCommentDto {
  parentId: number;
}

// 게시판 관련 API
export async function getBoards(): Promise<Board[]> {
  try {
    return await apiRequest(API_ROUTES.boards.list);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getBoardBySlug(slug: string): Promise<Board> {
  return await apiRequest(API_ROUTES.boards.getBySlug, {
    params: { slug },
  });
}

// 게시글 관련 API
export async function getPosts(
  boardId: number,
  params: PaginationQueryDto = {}
): Promise<PaginatedResponse<Post>> {
  const {
    page = 1,
    perPage = 30,
    order = Order.DESC,
    orderKey = "createdAt",
  } = params;

  return await apiRequest(API_ROUTES.posts.getByBoard, {
    params: { boardId },
    query: { page, perPage, order, orderKey },
  });
}

export async function getPostsBySlug(
  slug: string,
  params: PaginationQueryDto = {}
): Promise<PaginatedResponse<Post>> {
  const {
    page = 1,
    perPage = 30,
    order = Order.DESC,
    orderKey = "createdAt",
  } = params;

  return await apiRequest(API_ROUTES.posts.getByBoardSlug, {
    params: { slug },
    query: { page, perPage, order, orderKey },
  });
}

export async function getPost(id: number): Promise<Post> {
  return await apiRequest(API_ROUTES.posts.getById, {
    params: { id },
  });
}

export async function createPost(data: CreatePostDto): Promise<Post> {
  return await apiRequest(API_ROUTES.posts.create, {
    body: data,
  });
}

export async function updatePost(
  id: number,
  data: Partial<CreatePostDto>,
  password?: string
): Promise<Post> {
  return await apiRequest(API_ROUTES.posts.update, {
    params: { id },
    body: { ...data, password },
  });
}

export async function deletePost(id: number, password?: string): Promise<any> {
  return await apiRequest(API_ROUTES.posts.delete, {
    params: { id },
    query: { password },
  });
}

export async function toggleNotice(
  id: number,
  isNotice: boolean
): Promise<Post> {
  return await apiRequest(API_ROUTES.posts.toggleNotice, {
    params: { id },
    body: { isNotice },
  });
}

export async function moveNoticeUp(id: number): Promise<Post> {
  return await apiRequest(API_ROUTES.posts.moveNoticeUp, {
    params: { id },
  });
}

export async function moveNoticeDown(id: number): Promise<Post> {
  return await apiRequest(API_ROUTES.posts.moveNoticeDown, {
    params: { id },
  });
}

export async function setNoticeOrder(id: number, order: number): Promise<Post> {
  return await apiRequest(API_ROUTES.posts.setNoticeOrder, {
    params: { id },
    body: { order },
  });
}

// 댓글 관련 API
export async function getComments(postId: number): Promise<Comment[]> {
  return await apiRequest(API_ROUTES.comments.getByPost, {
    params: { postId },
  });
}

export async function createComment(data: CreateCommentDto): Promise<Comment> {
  return await apiRequest(API_ROUTES.comments.create, {
    body: data,
  });
}

export async function createReply(data: CreateReplyDto): Promise<Comment> {
  return await apiRequest(API_ROUTES.comments.createReply, {
    params: { parentId: data.parentId },
    body: data,
  });
}

export async function updateComment(
  id: number,
  content: string,
  password?: string,
  authorName?: string
): Promise<Comment> {
  return await apiRequest(API_ROUTES.comments.update, {
    params: { id },
    body: {
      content,
      password,
      authorName,
    },
  });
}

export async function deleteComment(
  id: number,
  password?: string
): Promise<any> {
  return await apiRequest(API_ROUTES.comments.delete, {
    params: { id },
    query: { password },
  });
}

export async function verifyCommentPassword(
  id: number,
  password?: string
): Promise<any> {
  return await apiRequest(API_ROUTES.comments.verifyPassword, {
    params: { id },
    body: { password },
  });
}
