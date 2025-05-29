import { UserLevel, calculateRequiredPoints } from "../../constants/rank";
import { LevelBadge } from "./LevelBadge";
import { cn } from "../../lib/utils";
import { Progress } from "@/components/ui/progress";

interface RankInfoProps {
  userRank: UserLevel;
  className?: string;
}

export const RankInfo = ({ userRank, className }: RankInfoProps) => {
  // Calculate progress to next level
  const currentLevel = userRank.level;
  const nextLevel = currentLevel + 1;
  const currentLevelPoints = calculateRequiredPoints(currentLevel);
  const nextLevelPoints = calculateRequiredPoints(nextLevel);
  const pointsNeeded = nextLevelPoints - currentLevelPoints;
  const progress = Math.min(
    100,
    Math.round(
      ((userRank.activityPoints - currentLevelPoints) / pointsNeeded) * 100
    )
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            마지막 활동:
            {userRank.lastActivityAt
              ? new Date(userRank.lastActivityAt).toLocaleDateString()
              : "활동 기록 없음"}
          </p>
        </div>
        <LevelBadge level={userRank.level} />
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

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>다음 레벨까지</span>
          <span>
            {userRank.activityPoints.toLocaleString()} /{" "}
            {nextLevelPoints.toLocaleString()} 포인트
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {userRank.levelHistory && userRank.levelHistory.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">레벨 이력</h4>
          <div className="space-y-2">
            {userRank.levelHistory.map((history, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-500">
                  {new Date(history.date).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                  <LevelBadge level={history.level} className="text-xs" />
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
