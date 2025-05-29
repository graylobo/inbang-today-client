import { useQuery } from "@tanstack/react-query";
import {
  getMyRank,
  getMyBadges,
  getLeaderboard,
} from "@/libs/api/services/rank.service";
import { UserLevel, UserBadge } from "@/constants/rank";

export const useUserRank = () => {
  return useQuery<UserLevel>({
    queryKey: ["userRank"],
    queryFn: () => getMyRank(),
  });
};

export const useUserBadges = () => {
  return useQuery<UserBadge[]>({
    queryKey: ["userBadges"],
    queryFn: () => getMyBadges(),
  });
};

export const useLeaderboard = (
  period: "daily" | "weekly" | "monthly" = "weekly"
) => {
  return useQuery({
    queryKey: ["leaderboard", period],
    queryFn: () => getLeaderboard(period),
  });
};
