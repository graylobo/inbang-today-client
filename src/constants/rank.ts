export enum RankCategory {
  SOLDIER = "SOLDIER",
  NON_COMMISSIONED_OFFICER = "NCO",
  OFFICER = "OFFICER",
  GENERAL = "GENERAL",
}

export enum Rank {
  // 병
  PRIVATE_SECOND_CLASS = "PRIVATE_SECOND_CLASS",
  PRIVATE_FIRST_CLASS = "PRIVATE_FIRST_CLASS",
  CORPORAL = "CORPORAL",
  SERGEANT = "SERGEANT",

  // 부사관
  STAFF_SERGEANT = "STAFF_SERGEANT",
  SERGEANT_FIRST_CLASS = "SERGEANT_FIRST_CLASS",
  MASTER_SERGEANT = "MASTER_SERGEANT",
  SERGEANT_MAJOR = "SERGEANT_MAJOR",

  // 장교 (위관급)
  SECOND_LIEUTENANT = "SECOND_LIEUTENANT",
  FIRST_LIEUTENANT = "FIRST_LIEUTENANT",
  CAPTAIN = "CAPTAIN",
  WARRANT_OFFICER = "WARRANT_OFFICER",

  // 장교 (영관급)
  MAJOR = "MAJOR",
  LIEUTENANT_COLONEL = "LIEUTENANT_COLONEL",
  COLONEL = "COLONEL",

  // 장성
  BRIGADIER_GENERAL = "BRIGADIER_GENERAL",
  MAJOR_GENERAL = "MAJOR_GENERAL",
  LIEUTENANT_GENERAL = "LIEUTENANT_GENERAL",
  GENERAL = "GENERAL",
}

export const RANK_ORDER: Record<Rank, number> = {
  [Rank.PRIVATE_SECOND_CLASS]: 0,
  [Rank.PRIVATE_FIRST_CLASS]: 1,
  [Rank.CORPORAL]: 2,
  [Rank.SERGEANT]: 3,
  [Rank.STAFF_SERGEANT]: 4,
  [Rank.SERGEANT_FIRST_CLASS]: 5,
  [Rank.MASTER_SERGEANT]: 6,
  [Rank.SERGEANT_MAJOR]: 7,
  [Rank.SECOND_LIEUTENANT]: 8,
  [Rank.FIRST_LIEUTENANT]: 9,
  [Rank.CAPTAIN]: 10,
  [Rank.WARRANT_OFFICER]: 11,
  [Rank.MAJOR]: 12,
  [Rank.LIEUTENANT_COLONEL]: 13,
  [Rank.COLONEL]: 14,
  [Rank.BRIGADIER_GENERAL]: 15,
  [Rank.MAJOR_GENERAL]: 16,
  [Rank.LIEUTENANT_GENERAL]: 17,
  [Rank.GENERAL]: 18,
};

export const RANK_CATEGORIES: Record<RankCategory, Rank[]> = {
  [RankCategory.SOLDIER]: [
    Rank.PRIVATE_SECOND_CLASS,
    Rank.PRIVATE_FIRST_CLASS,
    Rank.CORPORAL,
    Rank.SERGEANT,
  ],
  [RankCategory.NON_COMMISSIONED_OFFICER]: [
    Rank.STAFF_SERGEANT,
    Rank.SERGEANT_FIRST_CLASS,
    Rank.MASTER_SERGEANT,
    Rank.SERGEANT_MAJOR,
  ],
  [RankCategory.OFFICER]: [
    Rank.SECOND_LIEUTENANT,
    Rank.FIRST_LIEUTENANT,
    Rank.CAPTAIN,
    Rank.WARRANT_OFFICER,
    Rank.MAJOR,
    Rank.LIEUTENANT_COLONEL,
    Rank.COLONEL,
  ],
  [RankCategory.GENERAL]: [
    Rank.BRIGADIER_GENERAL,
    Rank.MAJOR_GENERAL,
    Rank.LIEUTENANT_GENERAL,
    Rank.GENERAL,
  ],
};

export interface UserRank {
  rank: Rank;
  rankCategory: RankCategory;
  activityPoints: number;
  purchasePoints: number;
  lastActivityAt: string;
  lastPointsReductionAt: string;
  rankHistory: {
    rank: Rank;
    date: string;
    reason: string;
  }[];
}

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
