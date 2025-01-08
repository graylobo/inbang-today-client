import {
  StarCraftMatch,
  StarCraftMatchQuery,
} from "@/hooks/match/useStarCraftMatch.type";
import { getStarCraftGameMatch } from "@/libs/api/services/starcrarft-game-match.service";
import { useQuery } from "@tanstack/react-query";

export const useStarCraftMatch = (query: StarCraftMatchQuery | null) => {
  return useQuery<StarCraftMatch>({
    queryKey: ["starcraft-game-match", query],
    queryFn: async () => {
      if (!query?.streamerId) return [];
      return getStarCraftGameMatch(query);
    },
    enabled: !!query?.streamerId,
  });
};
