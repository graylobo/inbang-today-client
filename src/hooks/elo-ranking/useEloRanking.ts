import { useQuery } from "@tanstack/react-query";
import { getMonthlyEloRanking } from "@/libs/api/services/elo-ranking.service";

export interface EloRanking {
  id: number;
  name: string;
  nickname: string | null;
  tier: string | null;
  race: string;
  gender: string;
  eloPoint: number;
  rank: number;
}

export interface MonthlyRankingResponse {
  month: string;
  gender: string;
  rankings: EloRanking[];
}

export const useGetMonthlyEloRanking = (month: string, gender?: string) => {
  return useQuery<MonthlyRankingResponse>({
    queryKey: ["eloRankings", "monthly", month, gender],
    queryFn: () => getMonthlyEloRanking(month, gender),
    enabled: !!month,
  });
};
