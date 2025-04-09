"use server";
import { apiRequest } from "@/libs/api/api-request";
import { api } from "@/libs/api/axios";

export async function getStreamers(categoryName?: string) {
  if (categoryName) {
    const { data } = await api.get(`/streamers?categoryName=${categoryName}`);
    return data;
  }
  const { data } = await api.get("/streamers");
  return data;
}

export async function getLiveStreamers() {
  const { data } = await api.get("/crawler/broadcasts");
  const { streamInfos } = data;
  return streamInfos;
}
