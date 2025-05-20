import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import {
  EloRanking,
  MonthlyRankingResponse,
} from "@/hooks/elo-ranking/useEloRanking";

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
