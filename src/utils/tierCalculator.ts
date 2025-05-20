import { EloRanking } from "@/hooks/elo-ranking/useEloRanking";

export type TierType =
  | "주"
  | "갑"
  | "을"
  | "병"
  | "정"
  | "무"
  | "기"
  | "경"
  | "신"
  | "임"
  | "계";

interface TierDistribution {
  tier: TierType;
  percentage: number;
  color: string;
}

// Tier distribution percentages (excluding '주' which is fixed at 9 people)
const tierDistributions: TierDistribution[] = [
  { tier: "갑", percentage: 0.03, color: "#FFD700" }, // Gold
  { tier: "을", percentage: 0.05, color: "#C0C0C0" }, // Silver
  { tier: "병", percentage: 0.07, color: "#CD7F32" }, // Bronze
  { tier: "정", percentage: 0.1, color: "#4169E1" }, // Royal Blue
  { tier: "무", percentage: 0.15, color: "#2E8B57" }, // Sea Green
  { tier: "기", percentage: 0.18, color: "#6A5ACD" }, // Slate Blue
  { tier: "경", percentage: 0.17, color: "#FF6347" }, // Tomato
  { tier: "신", percentage: 0.13, color: "#FF69B4" }, // Hot Pink
  { tier: "임", percentage: 0.08, color: "#5F9EA0" }, // Cadet Blue
  { tier: "계", percentage: 0.04, color: "#808080" }, // Gray
];

// Function to assign tiers to players based on their ELO rankings
export const calculateTiers = (
  rankings: EloRanking[]
): (EloRanking & { calculatedTier: TierType; tierColor: string })[] => {
  if (!rankings || rankings.length === 0) {
    return [];
  }

  // Sort by ELO point in descending order
  const sortedRankings = [...rankings].sort((a, b) => b.eloPoint - a.eloPoint);

  // Top 9 players get '주' tier
  const result: (EloRanking & {
    calculatedTier: TierType;
    tierColor: string;
  })[] = [];

  // Assign '주' tier to top 9
  for (let i = 0; i < Math.min(9, sortedRankings.length); i++) {
    result.push({
      ...sortedRankings[i],
      calculatedTier: "주",
      tierColor: "#FF0000", // Red for '주' tier
    });
  }

  // If we have more than 9 players, distribute the remaining tiers
  if (sortedRankings.length > 9) {
    const remainingPlayers = sortedRankings.slice(9);
    let currentIndex = 0;

    // Apply percentages to assign tiers
    for (const { tier, percentage, color } of tierDistributions) {
      const count = Math.max(
        1,
        Math.floor(remainingPlayers.length * percentage)
      );

      for (
        let i = 0;
        i < count && currentIndex < remainingPlayers.length;
        i++
      ) {
        result.push({
          ...remainingPlayers[currentIndex],
          calculatedTier: tier,
          tierColor: color,
        });
        currentIndex++;
      }

      // If we've assigned all players, break
      if (currentIndex >= remainingPlayers.length) {
        break;
      }
    }

    // If there are still unassigned players (shouldn't happen due to percentages),
    // assign them to the lowest tier
    while (currentIndex < remainingPlayers.length) {
      result.push({
        ...remainingPlayers[currentIndex],
        calculatedTier: "계",
        tierColor: "#808080", // Gray
      });
      currentIndex++;
    }
  }

  return result;
};
