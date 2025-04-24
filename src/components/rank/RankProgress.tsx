import { getRankName } from "@/components/rank/RankBadge";
import { Rank, RANK_ORDER, RANK_CATEGORIES } from "../../constants/rank";
import { cn } from "../../lib/utils";

interface RankProgressProps {
  currentRank: Rank;
  currentPoints: number;
  className?: string;
}

const getNextRank = (currentRank: Rank): Rank | null => {
  const currentOrder = RANK_ORDER[currentRank];
  const nextRank = Object.entries(RANK_ORDER).find(
    ([_, order]) => order === currentOrder + 1
  );
  return nextRank ? (nextRank[0] as Rank) : null;
};

const getRankPoints = (rank: Rank): number => {
  // 서버에서 받아온 포인트 기준값을 사용해야 함
  // 임시로 RANK_ORDER를 기준으로 계산
  return RANK_ORDER[rank] * 100;
};

export const RankProgress = ({
  currentRank,
  currentPoints,
  className,
}: RankProgressProps) => {
  const nextRank = getNextRank(currentRank);
  const currentRankPoints = getRankPoints(currentRank);
  const nextRankPoints = nextRank ? getRankPoints(nextRank) : currentRankPoints;
  const progress =
    ((currentPoints - currentRankPoints) /
      (nextRankPoints - currentRankPoints)) *
    100;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">현재 계급</span>
        <span className="font-medium">{getRankName(currentRank)}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">다음 계급까지</span>
        <span className="font-medium">
          {nextRank ? `${nextRankPoints - currentPoints}점` : "최고 계급"}
        </span>
      </div>
    </div>
  );
};
