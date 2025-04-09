import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";

export interface Category {
  id: number;
  name: string;
  description?: string;
  iconUrl?: string;
  parentId?: number;
  sortOrder: number;
}

export interface StreamerCategory {
  id: number;
  streamer: {
    id: number;
    name: string;
  };
  category: Category;
}

// 모든 카테고리 조회
export const getAllCategories = async (): Promise<Category[]> =>
  await apiRequest(API_ROUTES.categories.getAll);

// 타입별 카테고리 조회
export const getCategoriesByName = async (name: string): Promise<Category[]> =>
  await apiRequest(API_ROUTES.categories.getAll, {
    query: { name },
  });

// 특정 스트리머의 카테고리 조회
export const getStreamerCategories = async (
  streamerId: number
): Promise<StreamerCategory[]> =>
  await apiRequest(API_ROUTES.streamerCategories.getByStreamer, {
    params: { streamerId },
  });

// 스트리머에 여러 카테고리 설정 (기존 카테고리를 새 목록으로 교체)
export const setStreamerCategories = async (
  streamerId: number,
  categoryIds: number[]
): Promise<StreamerCategory[]> =>
  await apiRequest(API_ROUTES.streamerCategories.setCategories, {
    params: { streamerId },
    body: { categoryIds },
  });
