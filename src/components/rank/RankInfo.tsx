import { UserRank } from "../../constants/rank";
import { RankBadge } from "./RankBadge";
import { RankProgress } from "./RankProgress";
import { cn } from "../../lib/utils";

interface RankInfoProps {
  userRank: UserRank;
  className?: string;
}

export const RankInfo = ({ userRank, className }: RankInfoProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            마지막 활동:
            {new Date(userRank.lastActivityAt).toLocaleDateString()}
          </p>
        </div>
        <RankBadge rank={userRank.rank} category={userRank.rankCategory} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">활동 포인트</p>
          <p className="text-lg font-semibold">
            {userRank.activityPoints.toLocaleString()}점
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">구매 포인트</p>
          <p className="text-lg font-semibold">
            {userRank.purchasePoints.toLocaleString()}점
          </p>
        </div>
      </div>

      <RankProgress
        currentRank={userRank.rank}
        currentPoints={userRank.activityPoints}
      />

      {userRank.rankHistory.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">계급 이력</h4>
          <div className="space-y-2">
            {userRank.rankHistory.map((history, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-500">
                  {new Date(history.date).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <RankBadge
                    rank={history.rank}
                    category={userRank.rankCategory}
                    className="text-xs"
                  />
                  <span className="text-gray-500">{history.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
