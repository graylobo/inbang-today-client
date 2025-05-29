import { cn } from "../../lib/utils";
import { getLevelName } from "../../constants/rank";

interface LevelBadgeProps {
  level: number;
  className?: string;
}

const getLevelColor = (level: number) => {
  // Different color schemes based on level ranges
  if (level < 5) {
    return "bg-gray-100 text-gray-800"; // Beginner
  } else if (level < 10) {
    return "bg-blue-100 text-blue-800"; // Intermediate
  } else if (level < 15) {
    return "bg-green-100 text-green-800"; // Advanced
  } else if (level < 20) {
    return "bg-yellow-100 text-yellow-800"; // Expert
  } else {
    return "bg-red-100 text-red-800"; // Master
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
