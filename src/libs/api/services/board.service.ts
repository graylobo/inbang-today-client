"use server";
import { api } from "@/libs/api/axios";

export interface User {
  id: number;
  username: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface Board {
  id: number;
  name: string;
  slug: string;
  isAnonymous: boolean;
  description?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  board: Board;
  author?: User;
  authorName?: string;
  viewCount: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  post: Post;
  author?: User;
  authorName?: string;
  password?: string;
  parent?: Comment;
  replies: Comment[];
  createdAt: string;
  updatedAt: string;
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
export async function getBoards() {
  try {
    const response = await api.get<Board[]>("/boards");
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getBoardBySlug(slug: string) {
  const response = await api.get<Board>(`/boards/slug/${slug}`);
  return response.data;
}

// 게시글 관련 API
export async function getPosts(boardId: number) {
  const response = await api.get<Post[]>(`/posts/board/${boardId}`);
  return response.data;
}

export async function getPost(id: number) {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
}

export async function createPost(data: CreatePostDto) {
  const response = await api.post<Post>("/posts", data);
  return response.data;
}

export async function updatePost(
  id: number,
  data: Partial<CreatePostDto>,
  password?: string
) {
  const response = await api.put<Post>(`/posts/${id}`, { ...data, password });
  return response.data;
}

export async function deletePost(id: number, password?: string) {
  const res = await api.delete(`/posts/${id}`, { params: { password } });
  return res.data;
}

// 댓글 관련 API
export async function getComments(postId: number) {
  const response = await api.get<Comment[]>(`/comments/post/${postId}`);
  return response.data;
}

export async function createComment(data: CreateCommentDto) {
  const response = await api.post<Comment>("/comments", data);
  return response.data;
}

export async function createReply(data: CreateReplyDto) {
  const response = await api.post<Comment>(
    `/comments/${data.parentId}/reply`,
    data
  );
  return response.data;
}

export async function updateComment(
  id: number,
  content: string,
  password?: string
) {
  const response = await api.put<Comment>(`/comments/${id}`, {
    content,
    password,
  });
  return response.data;
}

export async function deleteComment(id: number, password?: string) {
  const res = await api.delete(`/comments/${id}`, { params: { password } });
  return res.data;
}

export async function verifyCommentPassword(id: number, password?: string) {
  const res = await api.post(`/comments/${id}/verify-password`, { password });
  return res.data;
}
