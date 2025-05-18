"use server";
import { StreamerFormData } from "@/app/admin/members/page";
import { apiRequest } from "@/libs/api/api-request";
import { api } from "@/libs/api/axios";
import { API_ROUTES } from "@/libs/api/route";

export async function getStreamers(categoryNames?: string | string[]) {
  if (categoryNames) {
    if (Array.isArray(categoryNames)) {
      // 여러 카테고리 이름을 콤마로 구분된 문자열로 변환
      const categoriesParam = categoryNames.join(",");
      const data = await apiRequest(API_ROUTES.streamers.list, {
        query: { categories: categoriesParam },
      });
      return data;
    } else {
      // 단일 카테고리 이름
      const data = await apiRequest(API_ROUTES.streamers.list, {
        query: { categoryName: categoryNames },
      });
      return data;
    }
  }
  const data = await apiRequest(API_ROUTES.streamers.list);
  return data;
}

export async function searchStreamers(query: string) {
  const { data } = await api.get(
    `/streamers?search=${encodeURIComponent(query)}`
  );
  return data;
}

export async function getLiveStreamers() {
  const { data } = await api.get("/crawler/broadcasts");
  const { streamInfos } = data;
  return streamInfos;
}

export async function getStreamerById(id: number) {
  const { data } = await api.get(`/streamers/${id}`);
  return data;
}
export async function createStreamer(streamer: StreamerFormData) {
  const data = await apiRequest(API_ROUTES.streamers.create, {
    body: streamer,
  });
  return data;
}
export async function updateStreamer(id: number, streamer: StreamerFormData) {
  const data = await apiRequest(API_ROUTES.streamers.update, {
    params: { id },
    body: streamer,
  });
  return data;
}

export async function deleteStreamer(id: number) {
  const data = await apiRequest(API_ROUTES.streamers.delete, {
    params: { id },
  });
  return data;
}
