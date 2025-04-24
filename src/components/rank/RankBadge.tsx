import { Rank, RankCategory } from "../../constants/rank";
import { cn } from "../../lib/utils";
import Image from "next/image";

interface RankBadgeProps {
  rank: Rank;
  category: RankCategory;
  className?: string;
}

const getRankColor = (category: RankCategory) => {
  switch (category) {
    case RankCategory.SOLDIER:
      return "bg-gray-100 text-gray-800";
    case RankCategory.NON_COMMISSIONED_OFFICER:
      return "bg-blue-100 text-blue-800";
    case RankCategory.OFFICER:
      return "bg-green-100 text-green-800";
    case RankCategory.GENERAL:
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRankIcon = (rank: Rank) => {
  switch (rank) {
    // 병
    case Rank.PRIVATE_SECOND_CLASS:
      return "/ranks/private-second-class.svg";
    case Rank.PRIVATE_FIRST_CLASS:
      return "/ranks/private-first-class.svg";
    case Rank.CORPORAL:
      return "/ranks/corporal.svg";
    case Rank.SERGEANT:
      return "/ranks/sergeant.svg";

    // 부사관
    case Rank.STAFF_SERGEANT:
      return "/ranks/staff-sergeant.svg";
    case Rank.SERGEANT_FIRST_CLASS:
      return "/ranks/sergeant-first-class.svg";
    case Rank.MASTER_SERGEANT:
      return "/ranks/master-sergeant.svg";
    case Rank.SERGEANT_MAJOR:
      return "/ranks/sergeant-major.svg";

    // 장교 (위관급)
    case Rank.SECOND_LIEUTENANT:
      return "/ranks/second-lieutenant.svg";
    case Rank.FIRST_LIEUTENANT:
      return "/ranks/first-lieutenant.svg";
    case Rank.CAPTAIN:
      return "/ranks/captain.svg";
    case Rank.WARRANT_OFFICER:
      return "/ranks/warrant-officer.svg";

    // 장교 (영관급)
    case Rank.MAJOR:
      return "/ranks/major.svg";
    case Rank.LIEUTENANT_COLONEL:
      return "/ranks/lieutenant-colonel.svg";
    case Rank.COLONEL:
      return "/ranks/colonel.svg";

    // 장성
    case Rank.BRIGADIER_GENERAL:
      return "/ranks/brigadier-general.svg";
    case Rank.MAJOR_GENERAL:
      return "/ranks/major-general.svg";
    case Rank.LIEUTENANT_GENERAL:
      return "/ranks/lieutenant-general.svg";
    case Rank.GENERAL:
      return "/ranks/general.svg";
  }
};

export const getRankName = (rank: Rank) => {
  switch (rank) {
    // 병
    case Rank.PRIVATE_SECOND_CLASS:
      return "이등병";
    case Rank.PRIVATE_FIRST_CLASS:
      return "일등병";
    case Rank.CORPORAL:
      return "상병";
    case Rank.SERGEANT:
      return "병장";

    // 부사관
    case Rank.STAFF_SERGEANT:
      return "하사";
    case Rank.SERGEANT_FIRST_CLASS:
      return "중사";
    case Rank.MASTER_SERGEANT:
      return "상사";
    case Rank.SERGEANT_MAJOR:
      return "원사";

    // 장교 (위관급)
    case Rank.SECOND_LIEUTENANT:
      return "소위";
    case Rank.FIRST_LIEUTENANT:
      return "중위";
    case Rank.CAPTAIN:
      return "대위";
    case Rank.WARRANT_OFFICER:
      return "준위";

    // 장교 (영관급)
    case Rank.MAJOR:
      return "소령";
    case Rank.LIEUTENANT_COLONEL:
      return "중령";
    case Rank.COLONEL:
      return "대령";

    // 장성
    case Rank.BRIGADIER_GENERAL:
      return "준장";
    case Rank.MAJOR_GENERAL:
      return "소장";
    case Rank.LIEUTENANT_GENERAL:
      return "중장";
    case Rank.GENERAL:
      return "대장";
  }
};

export const RankBadge = ({ rank, category, className }: RankBadgeProps) => {
  const rankIcon = getRankIcon(rank);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
        getRankColor(category),
        className
      )}
    >
      {rankIcon && (
        <div className="relative w-5 h-5">
          <Image
            src={rankIcon}
            alt={getRankName(rank) || ""}
            fill
            className="object-contain"
          />
        </div>
      )}
      <span>{getRankName(rank)}</span>
    </div>
  );
};
