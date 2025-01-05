import { StarCraftMatch } from "@/hooks/match/useStarCraftMatch.type";
import { getStarCraftGameMatch } from "@/libs/api/services/starcrarft-game-match.service";
import { useQuery } from "@tanstack/react-query";

export const useStarCraftMatch = (streamerId: number | null) => {
  return useQuery<StarCraftMatch[]>({
    queryKey: ["starcraft-game-match", streamerId],
    queryFn: async () => {
      if (!streamerId) return [];
      return getStarCraftGameMatch(streamerId);
    },
    enabled: !!streamerId,
  });
};
