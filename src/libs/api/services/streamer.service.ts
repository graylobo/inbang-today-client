"use server";
import { api } from "@/libs/api/axios";

export async function getStreamers() {
  const { data } = await api.get("/streamers");
  return data;
}

export async function getLiveStreamers() {
  const { data } = await api.get("/crawler/broadcasts");
  const { streamInfos } = data;
  return streamInfos;
}
