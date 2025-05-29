import { cn } from "../../lib/utils";
import { getLevelName } from "../../constants/rank";

interface LevelBadgeProps {
  level: number;
  className?: string;
}

const getLevelColor = (level: number) => {
  // 더 넓은 레벨 범위 지원
  if (level < 5) {
    return "bg-gray-100 text-gray-800"; // 입문자
  } else if (level < 10) {
    return "bg-blue-100 text-blue-800"; // 초급
  } else if (level < 20) {
    return "bg-green-100 text-green-800"; // 중급
  } else if (level < 50) {
    return "bg-yellow-100 text-yellow-800"; // 고급
  } else if (level < 100) {
    return "bg-orange-100 text-orange-800"; // 전문가
  } else if (level < 200) {
    return "bg-red-100 text-red-800"; // 마스터
  } else if (level < 500) {
    return "bg-purple-100 text-purple-800"; // 그랜드마스터
  } else {
    return "bg-pink-100 text-pink-800 ring-2 ring-pink-500"; // 레전드
  }
};

export const LevelBadge = ({ level, className }: LevelBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium",
        getLevelColor(level),
        className
      )}
    >
      <span>{getLevelName(level)}</span>
    </div>
  );
};
