import { apiRequest } from "@/libs/api/api-request";
import { API_ROUTES } from "@/libs/api/route";
import { UserRank, UserBadge } from "@/constants/rank";

export interface LeaderboardEntry {
  userId: number;
  username: string;
  rank: string;
  points: number;
  rankCategory: string;
}

export interface LeaderboardResponse {
  data: LeaderboardEntry[];
}

export async function getMyRank(): Promise<UserRank> {
  return await apiRequest(API_ROUTES.points.my);
}

export async function getMyBadges(): Promise<UserBadge[]> {
  return await apiRequest(API_ROUTES.points.myBadges);
}

export async function getLeaderboard(
  period: "daily" | "weekly" | "monthly" = "weekly"
): Promise<LeaderboardResponse> {
  return await apiRequest(API_ROUTES.points.leaderboard, {
    query: { period },
  });
}
