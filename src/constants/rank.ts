/**
 * User level system
 */

/**
 * Calculates the required points for a given level
 * @param level - The level to calculate points for
 * @returns Required points for the level
 */
export const calculateRequiredPoints = (level: number): number => {
  // Base points required for level 1
  const basePoints = 100;

  // Points increase with level - quadratic growth
  // Level 0: 0 points
  // Level 1: 100 points
  // Level 2: 220 points
  // Level 3: 360 points
  // And so on...
  if (level <= 0) return 0;
  return basePoints * level + 20 * Math.pow(level, 2);
};

/**
 * Calculates the level based on points
 * @param points - The current points
 * @returns The level corresponding to the points
 */
export const calculateLevelFromPoints = (points: number): number => {
  if (points <= 0) return 0;

  // Binary search to find the highest level that doesn't exceed the points
  let low = 0;
  let high = 100; // Reasonable upper bound

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const requiredPoints = calculateRequiredPoints(mid);
    const nextLevelPoints = calculateRequiredPoints(mid + 1);

    if (requiredPoints <= points && nextLevelPoints > points) {
      return mid;
    } else if (requiredPoints > points) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return low;
};

/**
 * User level interface
 */
export interface UserLevel {
  level: number;
  activityPoints: number;
  purchasePoints: number;
  lastActivityAt: string;
  lastPointsReductionAt: string;
  levelHistory: {
    level: number;
    date: string;
    reason: string;
  }[];
}

/**
 * Returns the name to display for a level
 * @param level - The numeric level
 * @returns The formatted level name
 */
export const getLevelName = (level: number): string => {
  return `Lv.${level}`;
};

/**
 * Badge interface
 */
export interface Badge {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  requirements: {
    activityType?: string;
    count?: number;
    level?: number;
    points?: number;
  };
}

export interface UserBadge {
  badge: Badge;
  earnedAt: string;
  progress: {
    current: number;
    target: number;
  };
}
