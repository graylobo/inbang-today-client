"use server";

import { api } from "@/libs/api/axios";

export async function getStarCraftGameMatch(streamerId: number) {
  const { data } = await api.get(`/starcraft/stats/${streamerId}`);
  return data;
}
