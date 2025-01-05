"use server";

import { StarCraftMatchQuery } from "@/hooks/match/useStarCraftMatch.type";
import { api } from "@/libs/api/axios";

export async function getStarCraftGameMatch(params: StarCraftMatchQuery) {
  const queryParams = new URLSearchParams({
    streamerId: params.streamerId.toString(),
    ...(params.startDate && { startDate: params.startDate }),
    ...(params.endDate && { endDate: params.endDate }),
  });

  const { data } = await api.get(`/starcraft/stats?${queryParams}`);
  return data;
}
