"use server";
import { apiRequest } from "@/libs/api/api-request";
import { api } from "@/libs/api/axios";

export async function getStreamers(categoryNames?: string | string[]) {
  if (categoryNames) {
    if (Array.isArray(categoryNames)) {
      // 여러 카테고리 이름을 콤마로 구분된 문자열로 변환
      const categoriesParam = categoryNames.join(",");
      const { data } = await api.get(
        `/streamers?categories=${categoriesParam}`
      );
      return data;
    } else {
      // 단일 카테고리 이름
      const { data } = await api.get(
        `/streamers?categoryName=${categoryNames}`
      );
      return data;
    }
  }
  const { data } = await api.get("/streamers");
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
