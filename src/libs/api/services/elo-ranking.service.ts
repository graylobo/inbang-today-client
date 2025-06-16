import { MonthlyRankingResponse } from "@/hooks/elo-ranking/useEloRanking";
import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";

export async function getMonthlyEloRanking(
  month: string,
  gender?: string
): Promise<MonthlyRankingResponse> {
  return await apiRequest(API_ROUTES.eloRankings.monthly.get, {
    query: {
      month,
      ...(gender ? { gender } : {}),
    },
  });
}
